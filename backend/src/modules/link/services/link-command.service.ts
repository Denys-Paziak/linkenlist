import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, EntityManager, Repository } from 'typeorm'

import { EDailyViewEntityType } from '../../../interfaces/EDailyViewEntityType'
import { ELinkStatus } from '../../../interfaces/ELinkStatus'
import { IMultipartFile } from '../../../interfaces/IMultipartFile'
import { IUploadedImage } from '../../../interfaces/IUploadedImage'
import { ImageQueueService } from '../../image-queue/image-queue.service'
import { S3StorageService } from '../../s3-storage/s3-storage.service'
import { ViewsSystemService } from '../../views/services/views-system.service'
import { CreateLinkDto } from '../dtos/CreateLink.dto'
import { DeleteLinkDto } from '../dtos/DeleteLink.dto'
import { UpdateLinkDto } from '../dtos/UpdateLink.dto'
import { Link } from '../entities/Link.entity'
import { LinkImage } from '../entities/LinkImage.entity'
import { LinkTag } from '../entities/LinkTag.entity'

@Injectable()
export class LinkCommandService {
	constructor(
		@InjectRepository(Link) private readonly linkRepository: Repository<Link>,
		@InjectRepository(LinkImage) private readonly linkImageRepository: Repository<LinkImage>,
		private readonly dataSource: DataSource,
		private readonly imageQueueService: ImageQueueService,
		private readonly s3StorageService: S3StorageService,
		private readonly viewsSystemService: ViewsSystemService
	) {}

	private async saveImage(file: IMultipartFile, linkId: number): Promise<IUploadedImage> {
		const { url, key } = await this.s3StorageService.uploadPublic(file.buffer, file.mimetype, false, {
			filename: file.filename,
			path: 'links',
			entityId: linkId
		})
		return { key, url, width: file.width, height: file.height }
	}

	private async upsertTagsByNames(
		names: string[] | undefined,
		manager: EntityManager
	): Promise<LinkTag[] | undefined> {
		if (names === undefined) return undefined
		if (names === null) return []

		const tags = names.map(n => n.trim()).filter(Boolean)
		if (tags.length === 0) return []
		await manager
			.createQueryBuilder()
			.insert()
			.into(LinkTag)
			.values(tags.map(name => ({ name })))
			.onConflict('("name") DO NOTHING')
			.execute()
		return manager
			.getRepository(LinkTag)
			.createQueryBuilder('tag')
			.where('tag.name IN (:...names)', { names: tags })
			.getMany()
	}

	async createLink(dto: CreateLinkDto, file: IMultipartFile) {
		const link = await this.dataSource.transaction(async manager => {
			const tags = await this.upsertTagsByNames(dto.tags ?? [], manager)

			return manager.getRepository(Link).save({
				title: dto.title,
				description: dto.description,
				branches: dto.branches,
				category: dto.category,
				tags: tags ?? [],
				status: dto.status,
				url: dto.url,
				verified: dto.verified ?? false,
				verifiedAt: dto.verified ? new Date() : null,
				verifiedBy: dto.verified ? 'admin' : null,
				isOfficial: dto.url.split('/')[0].includes('.mil') || dto.url.split('/')[0].includes('.gov')
			})
		})

		if (!link) return

		const uploaded = await this.saveImage(file, link.id)
		const { image } = await this.linkRepository.save({
			id: link.id,
			image: {
				originalKey: uploaded.key,
				height: uploaded.height,
				width: uploaded.width,
				url: uploaded.url
			}
		})

		this.imageQueueService.enqueueLinkProcess({ entityId: link.id, entityImageId: image.id, srcKey: uploaded.key })
	}

	async updateLink(linkId: number, dto: UpdateLinkDto, file?: IMultipartFile) {
		const exists = await this.linkRepository.findOne({ where: { id: linkId }, relations: ['image'] })
		if (!exists) throw new NotFoundException('Link not found.')

		let newImage: IUploadedImage | undefined = undefined
		const oldKeys: string[] = []

		if (file) {
			newImage = await this.saveImage(file, exists.id)
			if (exists.image?.originalKey) oldKeys.push(exists.image.originalKey)
			if (exists.image?.processedKey) oldKeys.push(exists.image.processedKey)
		}

		const updated = await this.dataSource.transaction(async manager => {
			const repo = manager.getRepository(Link)

			const tagsToSet = await this.upsertTagsByNames(dto.tags, manager)

			if (newImage !== undefined && exists.image) {
				await this.linkImageRepository.delete(exists.image.id)
			}

			const verified = dto.verified

			return repo.save({
				id: linkId,

				title: dto.title,
				description: dto.description,
				branches: dto.branches,
				category: dto.category,

				tags: tagsToSet,

				status: dto.status,
				url: dto.url,

				image:
					newImage === undefined
						? undefined
						: {
								originalKey: newImage.key,
								height: newImage.height,
								width: newImage.width,
								url: newImage.url
							},

				verified: verified === undefined ? undefined : !!verified,
				verifiedAt: verified === undefined ? undefined : verified ? new Date() : null,
				verifiedBy: verified === undefined ? undefined : verified ? 'admin' : null,
				isOfficial: dto.url ? dto.url.split('/')[0].includes('.mil') || dto.url.split('/')[0].includes('.gov') : undefined
			})
		})

		for (const key of oldKeys) {
			try {
				await this.s3StorageService.delete(key)
			} catch {}
		}

		if (newImage && updated.image) {
			this.imageQueueService.enqueueLinkProcess({
				entityId: updated.id,
				entityImageId: updated.image.id,
				srcKey: newImage.key
			})
		}
	}

	async deleteLink(linkId: number, dto: DeleteLinkDto) {
		if (dto.method === 'soft') {
			await this.linkRepository.update(linkId, { status: ELinkStatus.ARCHIVED })
			return
		}

		if (dto.method === 'hard') {
			const link = await this.linkRepository.findOne({ where: { id: linkId } })
			if (!link) return

			const keysToDelete: string[] = []
			if (link.image?.originalKey) keysToDelete.push(link.image.originalKey)
			if (link.image?.processedKey) keysToDelete.push(link.image.processedKey)

			await this.dataSource.transaction(async manager => {
				if (link.image) await this.linkImageRepository.delete(link.image.id)
				await manager.getRepository(Link).delete(linkId)
			})

			for (const key of keysToDelete) {
				try {
					await this.s3StorageService.delete(key)
				} catch {}
			}
		}
	}

	async addView(linkId: number) {
		this.viewsSystemService.incrementDailyView(EDailyViewEntityType.LINK, linkId)
	}
}
