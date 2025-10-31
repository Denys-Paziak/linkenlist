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

@Injectable()
export class LinkCommandService {
	constructor(
		@InjectRepository(Link)
		private readonly linkRepository: Repository<Link>,
		@InjectRepository(LinkImage)
		private readonly linkImageRepository: Repository<LinkImage>,

		private readonly dataSource: DataSource,
		private readonly imageQueueService: ImageQueueService,

		private readonly s3StorageService: S3StorageService
	) {}

	async createLink(dto: CreateLinkDto, file?: IMultipartFile) {
		const slug = await this.generateSlug(dto.title)

		const link = await this.dataSource.transaction(async manager => {
			const { title, description, branches, category, tags, status, url } = dto
			const verified = dto.verified === 'true'

			const tagEntities = await this.saveTags(tags, manager)

			return await manager.getRepository(Link).save({
				title,
				description,
				branches,
				category,
				tags: tagEntities,
				slug,
				status,
				url,
				verified: verified,
				verifiedAt: verified ? new Date() : undefined,
				verifiedBy: verified ? 'admin' : null
			})
		})

		if (link) {
			const imageData = file ? await this.saveImage(file, link.id) : null

			const { image } = await this.linkRepository.save({
				id: link.id,
				image: imageData
					? {
							originalKey: imageData.key,
							height: imageData.height,
							width: imageData.width,
							url: imageData.url
						}
					: null
			})

			if (image && imageData) {
				this.imageQueueService.enqueueProcess({ linkId: link.id, linkImageId: image.id, srcKey: imageData.key })
			}
		}
	}

	async updateLink(dto: UpdateLinkDto, file?: IMultipartFile | null) {
		const existsLink = await this.linkRepository.findOne({ where: { id: dto.id }, relations: ['image'] })
		if (!existsLink) throw new NotFoundException('Link not found.')

		let newImageData:
			| {
					key: string
					url: string
					width?: number
					height?: number
			  }
			| undefined
			| null = !file ? file : undefined

		let newSlug: string | undefined = undefined
		let newTags: LinkTag[] | undefined = undefined

		if (file !== undefined) {
			if (existsLink.image) {
				if (existsLink.image?.originalKey) {
					await this.s3StorageService.delete(existsLink.image.originalKey)
				}
				if (existsLink.image?.processedKey) {
					await this.s3StorageService.delete(existsLink.image.processedKey)
				}
			}
			if (file !== null) {
				newImageData = await this.saveImage(file, existsLink.id)
			}
		}

		if (dto.title) {
			newSlug = await this.generateSlug(dto.title)
		}

		const link = await this.dataSource.transaction(async manager => {
			const { id, title, description, branches, category, tags, status, url } = dto
			const verified = dto.verified === undefined ? undefined : dto.verified === 'true'

			if (tags?.length) {
				newTags = await this.saveTags(tags, manager)
			}

			if (newImageData === null && existsLink.image) {
				await this.linkImageRepository.delete(existsLink.image.id)
			}

			return await manager.getRepository(Link).save({
				id,
				title,
				description,
				branches: branches?.length ? branches : undefined,
				category,
				tags: newTags?.length ? newTags : undefined,
				slug: newSlug,
				status,
				url,
				image: newImageData
					? {
							originalKey: newImageData.key,
							height: newImageData.height,
							width: newImageData.width,
							url: newImageData.url
						}
					: newImageData,
				verified: verified,
				verifiedAt: verified ? new Date() : undefined,
				verifiedBy: verified === undefined ? undefined : verified ? 'admin' : null
			})
		})
		
		if (newImageData && link.image) {
			this.imageQueueService.enqueueProcess({
				linkId: link.id,
				linkImageId: link.image.id,
				srcKey: newImageData.key
			})
		}
	}

	async deleteLink(dto: DeleteLinkDto) {
		if (dto.method === 'soft') {
			await this.linkRepository.update(dto.id, { status: ELinkStatus.ARCHIVED })
		}

		if (dto.method === 'hard') {
			const link = await this.linkRepository.findOne({ where: { id: dto.id } })

			if (link?.image) {
				if (link.image?.originalKey) {
					await this.s3StorageService.delete(link.image.originalKey)
				}
				if (link.image?.processedKey) {
					await this.s3StorageService.delete(link.image.processedKey)
				}
				await this.linkImageRepository.delete(link.image.id)
			}

			await this.linkRepository.delete(dto.id)
		}
	}

	private async saveImage(file: IMultipartFile, linkId: number) {
		const { url, key } = await this.s3StorageService.uploadPublic(file.buffer, file.mimetype, false, {
			filename: file.filename,
			path: 'links',
			entityId: linkId
		})

		return {
			key,
			url,
			width: file.width,
			height: file.height
		}
	}

	private async generateSlug(title: string) {
		let slug = generateSlug(title)

		const exists = await this.linkRepository.exists({ where: { slug } })
		if (exists) {
			const randomSuffix = generateRandomSuffix()
			slug = `${slug}-${randomSuffix}`
		}

		return slug
	}

	private async saveTags(tags: string[], manager: EntityManager) {
		const tagsFormat = tags.map(name => name.trim().toLowerCase())

		await manager
			.createQueryBuilder()
			.insert()
			.into(LinkTag)
			.values(tagsFormat.map(name => ({ name })))
			.onConflict('("name") DO NOTHING')
			.execute()

		return await manager
			.getRepository(LinkTag)
			.createQueryBuilder('tag')
			.where('tag.name IN (:...names)', { names: tagsFormat })
			.getMany()
	}
}
