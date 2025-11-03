import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, EntityManager, Repository } from 'typeorm'

import { ELinkStatus } from '../../../interfaces/ELinkStatus'
import { IMultipartFile } from '../../../interfaces/IMultipartFile'
import { generateRandomSuffix } from '../../../utils/generate-random-suffix.util'
import { generateSlug } from '../../../utils/slug.util'
import { ImageQueueService } from '../../image-queue/image-queue.service'
import { S3StorageService } from '../../s3-storage/s3-storage.service'
import { CreateLinkDto } from '../dtos/CreateLink.dto'
import { DeleteLinkDto } from '../dtos/DeleteLink.dto'
import { UpdateLinkDto } from '../dtos/UpdateLink.dto'
import { Link } from '../entities/Link.entity'
import { LinkImage } from '../entities/LinkImage.entity'
import { LinkTag } from '../entities/LinkTag.entity'

type UploadedImage = { key: string; url: string; width?: number; height?: number }

@Injectable()
export class LinkCommandService {
	constructor(
		@InjectRepository(Link) private readonly linkRepository: Repository<Link>,
		@InjectRepository(LinkImage) private readonly linkImageRepository: Repository<LinkImage>,
		private readonly dataSource: DataSource,
		private readonly imageQueueService: ImageQueueService,
		private readonly s3StorageService: S3StorageService
	) {}

	private async saveImage(file: IMultipartFile, linkId: number): Promise<UploadedImage> {
		const { url, key } = await this.s3StorageService.uploadPublic(file.buffer, file.mimetype, false, {
			filename: file.filename,
			path: 'links',
			entityId: linkId
		})
		return { key, url, width: file.width, height: file.height }
	}

	private async generateSlugUnique(title: string) {
		let slug = generateSlug(title)
		const exists = await this.linkRepository.exists({ where: { slug } })
		if (exists) slug = `${slug}-${generateRandomSuffix()}`
		return slug
	}

	private async upsertTagsByNames(names: string[] | null, manager: EntityManager): Promise<LinkTag[] | null | undefined> {
		if (names === undefined) return undefined
		if (names === null) return []

		const tags = names.map(n => n.trim().toLowerCase()).filter(Boolean)
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
		const slug = await this.generateSlugUnique(dto.title)
		const link = await this.dataSource.transaction(async manager => {
			const tags = await this.upsertTagsByNames(dto.tags ?? [], manager)

			return manager.getRepository(Link).save({
				title: dto.title,
				description: dto.description,
				branches: dto.branches,
				category: dto.category,
				tags: tags ?? [],
				slug,
				status: dto.status,
				url: dto.url,
				verified: dto.verified ?? false,
				verifiedAt: dto.verified ? new Date() : null,
				verifiedBy: dto.verified ? 'admin' : null
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

		this.imageQueueService.enqueueProcess({ linkId: link.id, linkImageId: image.id, srcKey: uploaded.key })
	}

	async updateLink(linkId: number, dto: UpdateLinkDto, file?: IMultipartFile) {
		const exists = await this.linkRepository.findOne({ where: { id: linkId }, relations: ['image'] })
		if (!exists) throw new NotFoundException('Link not found.')

		let newImage: UploadedImage | undefined = undefined
		const oldKeys: string[] = []

		if (file) {
			newImage = await this.saveImage(file, exists.id)
			if (exists.image?.originalKey) oldKeys.push(exists.image.originalKey)
			if (exists.image?.processedKey) oldKeys.push(exists.image.processedKey)
		}

		let slugToSet: string | undefined = undefined
		if (dto.title) {
			slugToSet = await this.generateSlugUnique(dto.title)
		}

		const updated = await this.dataSource.transaction(async manager => {
			const repo = manager.getRepository(Link)

			const tagsToSet = await this.upsertTagsByNames(dto.tags as any, manager)

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

				tags: tagsToSet === undefined ? undefined : (tagsToSet ?? []),

				slug: slugToSet,

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
				verifiedBy: verified === undefined ? undefined : verified ? 'admin' : null
			})
		})

		for (const key of oldKeys) {
			try {
				await this.s3StorageService.delete(key)
			} catch {}
		}

		if (newImage && updated.image) {
			this.imageQueueService.enqueueProcess({
				linkId: updated.id,
				linkImageId: updated.image.id,
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
}
