import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, EntityManager, Repository } from 'typeorm'

import { IMultipartFile } from '../../../interfaces/IMultipartFile'
import { IUploadedImage } from '../../../interfaces/IUploadedImage'
import { generateRandomSuffix } from '../../../utils/generate-random-suffix.util'
import { generateSlug } from '../../../utils/slug.util'
import { ImageQueueService } from '../../image-queue/image-queue.service'
import { S3StorageService } from '../../s3-storage/s3-storage.service'
import { SaveBasicInformationDto } from '../dtos/SaveBasicInformation.dto'
import { Deal } from '../entities/Deal.entity'
import { DealImage } from '../entities/DealImage.entity'
import { DealTag } from '../entities/DealTag.entity'

@Injectable()
export class DealCommandService {
	constructor(
		@InjectRepository(Deal) private readonly dealRepository: Repository<Deal>,
		@InjectRepository(Deal) private readonly dealImageRepository: Repository<DealImage>,
		private readonly dataSource: DataSource,
		private readonly imageQueueService: ImageQueueService,
		private readonly s3StorageService: S3StorageService
	) {}

	private async saveImage(file: IMultipartFile, dealId: number): Promise<IUploadedImage> {
		const { url, key } = await this.s3StorageService.uploadPublic(file.buffer, file.mimetype, false, {
			filename: file.filename,
			path: 'deals',
			entityId: dealId
		})
		return { key, url, width: file.width, height: file.height }
	}

	private async generateSlugUnique(title: string) {
		let slug = generateSlug(title)
		const exists = await this.dealRepository.exists({ where: { slug } })
		if (exists) slug = `${slug}-${generateRandomSuffix()}`
		return slug
	}

	private async upsertTagsByNames(
		names: string[] | null | undefined,
		manager: EntityManager
	): Promise<DealTag[] | undefined> {
		if (names === undefined) return undefined
		if (names === null) return []

		const tags = names.map(n => n.trim()).filter(Boolean)
		if (tags.length === 0) return []
		await manager
			.createQueryBuilder()
			.insert()
			.into(DealTag)
			.values(tags.map(name => ({ name })))
			.onConflict('("name") DO NOTHING')
			.execute()
		return manager
			.getRepository(DealTag)
			.createQueryBuilder('tag')
			.where('tag.name IN (:...names)', { names: tags })
			.getMany()
	}

	async saveBasicInformation(dealId: number, dto: SaveBasicInformationDto, file?: IMultipartFile) {
		const exists = await this.dealRepository.findOne({ where: { id: dealId }, relations: ['image'] })
		if (!exists) throw new NotFoundException('Deal not found.')
		if (!exists.image && !file) throw new BadRequestException('Image required.')
		if (!exists.title && !dto.title) throw new BadRequestException('Title required.')
		if (!exists.categories && !dto.categories) throw new BadRequestException('Categories required.')
		if (!exists.outboundUrl && !dto.outboundUrl) throw new BadRequestException('Outbound URL required.')

		let newImage: IUploadedImage | undefined = undefined
		const oldKeys: string[] = []

		if (file) {
			newImage = await this.saveImage(file, exists.id)
			if (exists.image?.originalKey) oldKeys.push(exists.image.originalKey)
			if (exists.image?.processedKey) oldKeys.push(exists.image.processedKey)
		}

		let slug: string | undefined

		if (dto.slug) {
			if (await this.dealRepository.exists({ where: { slug: dto.slug } })) {
				throw new ConflictException('This slug already exists.')
			} else {
				slug = dto.slug
			}
		} else {
			if (dto.title) {
				slug = await this.generateSlugUnique(dto.title)
			}
		}

		const updated = await this.dataSource.transaction(async manager => {
			const repo = manager.getRepository(Deal)

			const tagsToSet = await this.upsertTagsByNames(dto.tags, manager)

			if (newImage !== undefined && exists.image) {
				await this.dealImageRepository.delete(exists.image.id)
			}

			return repo.save({
				id: dealId,
				title: dto.title,
				seoMetaTitle: dto.title,
				slug: slug === '' ? undefined : slug,
				tags: tagsToSet,
				teaser: dto.teaser === '' ? null : dto.teaser,
				seoMetaDescription: dto.teaser === '' ? null : dto.teaser,
				categories: dto.categories,
				outboundURL: dto.outboundUrl,
				outboundURLButtonLabel: dto.outboundUrlButtonLabel === '' ? 'Go to Deal' : dto.outboundUrlButtonLabel,
				image:
					newImage === undefined
						? undefined
						: {
								originalKey: newImage.key,
								height: newImage.height,
								width: newImage.width,
								url: newImage.url
							}
			})
		})

		for (const key of oldKeys) {
			try {
				await this.s3StorageService.delete(key)
			} catch {}
		}

		if (newImage && updated.image) {
			this.imageQueueService.enqueueDealProcess({
				entityId: updated.id,
				entityImageId: updated.image.id,
				srcKey: newImage.key
			})
		}
	}
}
