import { BadRequestException, ConflictException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { extname } from 'node:path'
import { DataSource, EntityManager, Not, Repository } from 'typeorm'

import { EDailyMetricType } from '../../../interfaces/EDailyMetricType'
import { EFileStatus } from '../../../interfaces/EFileStatus'
import { EOgImageMode } from '../../../interfaces/EOgImageMode'
import { EResourceStatus } from '../../../interfaces/EResourceStatus'
import { IMultipartFile } from '../../../interfaces/IMultipartFile'
import { IUploadedFile, IUploadedImage } from '../../../interfaces/IUploadedFile'
import { generateRandomSuffix } from '../../../utils/generate-random-suffix.util'
import { generateSlug } from '../../../utils/slug.util'
import { Deal } from '../../deal/entities/Deal.entity'
import { ImageQueueService } from '../../image-queue/image-queue.service'
import { DailyMetric } from '../../metrics/entities/Metrics.entity'
import { MetricsSystemService } from '../../metrics/services/metrics-system.service'
import { S3StorageService } from '../../s3-storage/s3-storage.service'
import { ScheduleQueueService } from '../../schedule-queue/schedule-queue.service'
import { ChangePosContentSectionsDto } from '../dtos/ChangePosContentSections.dto'
import { ChangeStatusDto } from '../dtos/ChangeStatus.dto'
import { DeleteResourceDto } from '../dtos/DeleteResource.dto'
import { SaveBasicInformationDto } from '../dtos/SaveBasicInformation.dto'
import { SaveContentSectionDto } from '../dtos/SaveContentSection.dto'
import { SaveSEODto } from '../dtos/SaveSEO.dto'
import { SetSelectRelatedDto } from '../dtos/SetSelectRelated.dto'
import { SwitchFeaturedDto } from '../dtos/SwitchFeatured.dto'
import { SwitchRelatedMode } from '../dtos/SwitchRelatedMode.dto'
import { Resource } from '../entities/Resource.entity'
import { ResourceImage } from '../entities/ResourceImage.entity'
import { ResourceRelated } from '../entities/ResourceRelated.entity'
import { ResourceSection } from '../entities/ResourceSection.entity'
import { ResourceSectionAttachment } from '../entities/ResourceSectionAttachment.entity'
import { ResourceSectionImages } from '../entities/ResourceSectionImages.entity'
import { ResourceTag } from '../entities/ResourceTag.entity'

import { ResourceQueryService } from './resource-query.service'

@Injectable()
export class ResourceCommandService {
	constructor(
		@InjectRepository(Resource)
		private readonly resourceRepository: Repository<Resource>,
		@InjectRepository(ResourceImage)
		private readonly resourceImageRepository: Repository<ResourceImage>,
		@InjectRepository(ResourceSection)
		private readonly resourceSectionRepository: Repository<ResourceSection>,
		@InjectRepository(ResourceRelated)
		private readonly resourceRelatedRepository: Repository<ResourceRelated>,
		@InjectRepository(ResourceSectionImages)
		private readonly resourceSectionImagesRepository: Repository<ResourceSectionImages>,
		private readonly dataSource: DataSource,
		private readonly imageQueueService: ImageQueueService,
		private readonly scheduleQueueService: ScheduleQueueService,
		private readonly s3StorageService: S3StorageService,
		private readonly metricsSystemService: MetricsSystemService,
		private readonly resourceQueryService: ResourceQueryService
	) {}

	private async saveImage(file: IMultipartFile, resourceId: number): Promise<IUploadedImage> {
		const { url, key } = await this.s3StorageService.uploadPublic(file.buffer, file.mimetype, false, {
			filename: file.filename,
			path: 'resource/heroes/' + resourceId
		})
		return { key, url, width: file.width, height: file.height }
	}

	private async saveSectionImage(file: IMultipartFile, dealId: number): Promise<IUploadedImage> {
		const { url, key } = await this.s3StorageService.uploadPublic(file.buffer, file.mimetype, false, {
			filename: file.filename,
			path: 'resource/section_image/' + dealId
		})
		return { key, url, width: file.width, height: file.height }
	}

	private async saveFile(file: IMultipartFile, resourceId: number, sectionId: number): Promise<IUploadedFile> {
		const { url, key } = await this.s3StorageService.uploadPublic(
			file.buffer,
			file.mimetype,
			false,
			{
				filename: file.filename,
				path: 'resource/attachments/' + resourceId + '/' + sectionId
			},
			{
				download: true
			}
		)

		return { key, url, name: file.filename, ext: extname(file.filename).substring(1), size: file.size }
	}

	private async generateSlugUnique(title: string) {
		let slug = generateSlug(title)
		const exists = await this.resourceRepository.exists({ where: { slug } })
		if (exists) slug = `${slug}-${generateRandomSuffix()}`
		return slug
	}

	private async upsertTagsByNames(
		names: string[] | null | undefined,
		manager: EntityManager
	): Promise<ResourceTag[] | undefined> {
		if (names === undefined) return undefined
		if (names === null) return []

		const tags = names.map(n => n.trim()).filter(Boolean)
		if (tags.length === 0) return []
		await manager
			.createQueryBuilder()
			.insert()
			.into(ResourceTag)
			.values(tags.map(name => ({ name })))
			.onConflict('("name") DO NOTHING')
			.execute()
		return manager
			.getRepository(ResourceTag)
			.createQueryBuilder('tag')
			.where('tag.name IN (:...names)', { names: tags })
			.getMany()
	}

	async initResource() {
		return await this.resourceRepository.save({})
	}

	async saveBasicInformation(resourceId: number, dto: SaveBasicInformationDto, file?: IMultipartFile) {
		const exists = await this.resourceRepository.findOne({
			where: { id: resourceId },
			relations: ['image', 'ogImage', 'featuredDeal'],
			select: {
				id: true,
				title: true,
				slug: true,
				categories: true,
				format: true,
				ogImageMode: true,
				featuredDeal: {
					id: true
				},
				image: {
					id: true,
					originalKey: true,
					processedKey: true
				},
				ogImage: {
					id: true,
					originalKey: true,
					processedKey: true
				}
			}
		})
		if (!exists) throw new NotFoundException('Resource not found.')

		const errorReqFields: string[] = []
		if (!exists.image && !file) errorReqFields.push('Image required.')
		if (!exists.title && !dto.title) errorReqFields.push('Title required.')
		if (!exists.categories.length && !dto.categories?.length) errorReqFields.push('Categories required.')
		if (!exists.format && !dto.format) errorReqFields.push('Resource type required.')

		if (errorReqFields.length > 0) {
			throw new BadRequestException(errorReqFields)
		}

		let newImage: IUploadedImage | undefined = undefined
		const oldKeys: string[] = []

		if (file) {
			newImage = await this.saveImage(file, exists.id)
			if (exists.image?.originalKey) oldKeys.push(exists.image.originalKey)
			if (exists.image?.processedKey) oldKeys.push(exists.image.processedKey)
			if (exists.ogImageMode === EOgImageMode.USE_HERO) {
				if (exists.ogImage?.originalKey) oldKeys.push(exists.ogImage.originalKey)
				if (exists.ogImage?.processedKey) oldKeys.push(exists.ogImage.processedKey)
			}
		}

		let slug: string | undefined
		if (dto.slug) {
			if (await this.resourceRepository.exists({ where: { slug: dto.slug, id: Not(resourceId) } })) {
				throw new ConflictException('This slug already exists.')
			} else {
				slug = dto.slug
			}
		} else {
			if (dto.slug === null || !exists.slug) {
				const titleForSlug = dto.title ?? exists.title

				if (!titleForSlug) {
					throw new BadRequestException('Title required.')
				}

				slug = await this.generateSlugUnique(titleForSlug)
			}
		}

		const seoMetaTitle = () => {
			if (!exists.seoMetaTitle || exists.seoMetaTitle === exists.title) {
				return dto.title
			} else {
				return undefined
			}
		}

		const seoMetaDescription = () => {
			if (!exists.seoMetaDescription || exists.seoMetaTitle === exists.teaser) {
				return dto.teaser === '' ? null : dto.teaser
			} else {
				return undefined
			}
		}

		const updated = await this.dataSource.transaction(async manager => {
			const repo = manager.getRepository(Resource)

			const tagsToSet = await this.upsertTagsByNames(dto.tags, manager)

			if (newImage !== undefined && exists.image) {
				await manager.getRepository(ResourceImage).delete(exists.image.id)
				if (exists.ogImage && exists.ogImageMode === EOgImageMode.USE_HERO) {
					await manager.getRepository(ResourceImage).delete(exists.ogImage.id)
				}
			}

			if (typeof dto.featuredDealId === 'number') {
				manager.getRepository(Deal).save({
					id: dto.featuredDealId,
					featuredDeal: { id: resourceId }
				})
			}
			if (dto.featuredDealId === null && exists.featuredDeal) {
				manager.getRepository(Deal).save({
					id: exists.featuredDeal.id,
					featuredDeal: null
				})
			}

			return repo.save({
				id: resourceId,
				title: dto.title,
				seoMetaTitle: seoMetaTitle(),
				slug: slug,
				tags: tagsToSet,
				tagsText: dto.tags?.join(' '),
				teaser: dto.teaser === '' ? null : dto.teaser,
				seoMetaDescription: seoMetaDescription(),
				categories: dto.categories,
				format: dto.format,
				featuredDeal: typeof dto.featuredDealId === 'number' ? { id: dto.featuredDealId } : dto.featuredDealId,
				image:
					newImage !== undefined
						? {
								originalKey: newImage.key,
								height: newImage.height,
								width: newImage.width,
								url: newImage.url
							}
						: undefined,
				ogImage:
					newImage !== undefined && exists.ogImageMode === EOgImageMode.USE_HERO
						? {
								originalKey: newImage.key,
								height: newImage.height,
								width: newImage.width,
								url: newImage.url
							}
						: undefined
			})
		})

		for (const key of oldKeys) {
			try {
				await this.s3StorageService.delete(key)
			} catch {}
		}

		if (newImage && updated.image) {
			await this.imageQueueService.enqueueResourceHeroProcess({
				entityId: updated.id,
				entityFileId: updated.image.id,
				srcKey: newImage.key
			})
			if (updated.ogImage && exists.ogImageMode === EOgImageMode.USE_HERO) {
				await this.imageQueueService.enqueueResourceOgImageProcess({
					entityId: updated.id,
					entityFileId: updated.ogImage.id,
					srcKey: newImage.key
				})
			}
		}
	}

	async createContentSection(resourceId: number) {
		const sections = await this.resourceRepository.findOne({ where: { id: resourceId }, relations: ['sections'] })

		let maxPost = 0

		for (const block of sections?.sections || []) {
			if (maxPost < block.position) {
				maxPost = block.position
			}
		}

		const newSection = await this.resourceSectionRepository.save({ position: maxPost + 1, resource: { id: resourceId } })

		return await this.resourceSectionRepository.findOne({ where: { id: newSection.id }, relations: ['attachments'] })
	}

	async uploadContentSectionImage(resourceId: number, file: IMultipartFile) {
		const exists = await this.resourceSectionRepository.exists({
			where: { id: resourceId }
		})
		if (!exists) throw new NotFoundException('Deal section not found.')

		const uploadedImage = await this.saveSectionImage(file, resourceId)

		const newSectionImage = await this.resourceSectionImagesRepository.save({
			dealSection: { id: resourceId },
			url: uploadedImage.url,
			originalKey: uploadedImage.key,
			width: uploadedImage.width || 0,
			height: uploadedImage.height || 0
		})

		const updated = await this.resourceSectionImagesRepository.findOne({
			where: { id: newSectionImage.id }
		})
		if (!updated) throw new InternalServerErrorException('Unable to load image.')

		return updated
	}

	async deleteContentSectionImage(imageId: number) {
		const image = await this.resourceSectionImagesRepository.findOne({
			where: { id: imageId },
			select: {
				id: true,
				originalKey: true
			}
		})
		if (!image) throw new NotFoundException('Content section image not found.')

		await this.resourceSectionImagesRepository.delete(imageId)
		if (image.originalKey) {
			await this.s3StorageService.delete(image.originalKey)
		}
	}

	async deleteContentSection(resourceId: number, sectionId: number) {
		await this.resourceSectionRepository.delete({ id: sectionId, resource: { id: resourceId } })
	}

	async changePosContentSections(resourceId: number, dto: ChangePosContentSectionsDto) {
		await this.dataSource.query(
			`
                    UPDATE resource_sections AS ds
                    SET position = v.position
                    FROM (VALUES 
                    ${dto.items.map(u => `(${u.sectionId}, ${u.position})`).join(',')}
                    ) AS v(id, position)
                    WHERE ds.id = v.id
                    AND ds.resource_id = $1
                `,
			[resourceId]
		)
	}

	async saveContentSection(resourceId: number, sectionId: number, dto: SaveContentSectionDto, files?: IMultipartFile[]) {
		const exists = await this.resourceSectionRepository.findOne({
			where: { id: sectionId, resource: { id: resourceId } },
			relations: ['attachments'],
			select: {
				id: true,
				attachments: {
					id: true,
					originalKey: true,
					processedKey: true
				}
			}
		})
		if (!exists) throw new NotFoundException('Resource section not found.')

		const deleteAttachments: ResourceSectionAttachment[] = []
		const remainedAttachments: ResourceSectionAttachment[] = []

		exists.attachments?.forEach(item => {
			if (dto.remainedAttachments?.includes(item.id)) {
				remainedAttachments.push(item)
			} else {
				deleteAttachments.push(item)
			}
		})

		const newAttachments: IUploadedFile[] = []
		const oldKeys: string[] = []

		if (files?.length) {
			newAttachments.push(
				...(await Promise.all(
					files.map(file => {
						return this.saveFile(file, resourceId, sectionId)
					})
				))
			)
		}

		deleteAttachments.forEach(attachment => {
			if (attachment.originalKey) oldKeys.push(attachment.originalKey)
			if (attachment.processedKey) oldKeys.push(attachment.processedKey)
		})

		const updated = await this.dataSource.transaction(async manager => {
			if (deleteAttachments.length) {
				await manager.getRepository(ResourceSectionAttachment).delete(deleteAttachments.map(a => a.id))
			}

			return await manager.getRepository(ResourceSection).save({
				id: sectionId,
				title: dto.title,
				bodyMd: dto.bodyMd,
				enabled: dto.enabled,
				attachments: [
					...remainedAttachments,
					...newAttachments.map(newAttachment => ({
						originalKey: newAttachment.key,
						name: newAttachment.name,
						ext: newAttachment.ext,
						url: newAttachment.url,
						sizeBytes: newAttachment.size
					}))
				]
			})
		})

		for (const key of oldKeys) {
			try {
				await this.s3StorageService.delete(key)
			} catch {}
		}

		if (newAttachments.length && updated.attachments?.length) {
			updated.attachments.forEach((item: ResourceSectionAttachment) => {
				if (item.status === EFileStatus.QUEUED) {
					this.imageQueueService.enqueueResourceAttachmentProcess({
						entityId: updated.id,
						entityFileId: item.id,
						srcKey: item.originalKey || ''
					})
				}
			})
		}
	}

	async switchRelatedMode(resourceId: number, dto: SwitchRelatedMode) {
		await this.resourceRepository.update(resourceId, {
			relatedAutoMode: dto.relatedAutoMode
		})
	}

	async switchFeatured(resourceId: number, dto: SwitchFeaturedDto) {
		await this.resourceRepository.update(resourceId, {
			isFeatured: dto.isFeatured
		})
	}

	async addSelectRelated(resourceId: number, dto: SetSelectRelatedDto) {
		await this.resourceRelatedRepository.insert(
			dto.resourceIds.map(relatedResourceId => ({
				source: { id: resourceId },
				target: { id: relatedResourceId }
			}))
		)
	}

	async deleteSelectRelated(dealId: number, dto: SetSelectRelatedDto) {
		await this.resourceRelatedRepository.delete(
			dto.resourceIds.map(relatedDealId => ({
				source: { id: dealId },
				target: { id: relatedDealId }
			}))
		)
	}

	async saveSEO(resourceId: number, dto: SaveSEODto, file?: IMultipartFile) {
		if (dto.ogImageMode === EOgImageMode.CUSTOM && !file) {
			throw new BadRequestException('Please upload an image for the custom OG mode')
		}

		if (dto.ogImageMode === EOgImageMode.USE_HERO && file) {
			throw new BadRequestException('You selected "Use hero image", so no custom OG file should be uploaded')
		}

		const exists = await this.resourceRepository.findOne({
			where: { id: resourceId },
			relations: ['image', 'ogImage'],
			select: {
				id: true,
				title: true,
				teaser: true,
				ogImageMode: true,
				image: {
					id: true,
					originalKey: true,
					processedKey: true,
					width: true,
					height: true
				},
				ogImage: {
					id: true,
					originalKey: true,
					processedKey: true
				}
			}
		})
		if (!exists) throw new NotFoundException('Resource not found.')

		let newImage: IUploadedImage | undefined = undefined
		const oldKeys: string[] = []

		if (dto.ogImageMode === EOgImageMode.USE_HERO && exists.ogImageMode === EOgImageMode.CUSTOM) {
			if (!exists.image?.originalKey) {
				throw new BadRequestException('Hero image is missing, cannot use it as OG image')
			}

			newImage = {
				key: exists.image.originalKey,
				url: this.s3StorageService.publicUrlForKey(exists.image.originalKey),
				width: exists.image?.width,
				height: exists.image?.height
			}
			if (exists.ogImage?.originalKey) oldKeys.push(exists.ogImage.originalKey)
			if (exists.ogImage?.processedKey) oldKeys.push(exists.ogImage.processedKey)
		}

		if (file) {
			newImage = await this.saveImage(file, exists.id)
			if (exists.ogImage?.originalKey) oldKeys.push(exists.ogImage.originalKey)
			if (exists.ogImage?.processedKey) oldKeys.push(exists.ogImage.processedKey)
		}

		const seoMetaTitle = () => {
			if (dto.seoMetaTitle === undefined) {
				return undefined
			}

			if (!dto.seoMetaTitle) {
				return exists.title
			} else {
				return dto.seoMetaTitle
			}
		}

		const seoMetaDescription = () => {
			if (dto.seoMetaDescription === undefined) {
				return undefined
			}

			if (!dto.seoMetaDescription) {
				return exists.teaser
			} else {
				return dto.seoMetaDescription
			}
		}

		const updated = await this.dataSource.transaction(async manager => {
			const repo = manager.getRepository(Resource)

			if (newImage !== undefined && exists.ogImage) {
				await manager.getRepository(ResourceImage).delete(exists.ogImage.id)
			}

			return repo.save({
				id: resourceId,
				seoMetaTitle: seoMetaTitle(),
				seoMetaDescription: seoMetaDescription(),
				ogImageMode: dto.ogImageMode,
				canonicalUrl: dto.canonicalUrl,
				allowIndexing: dto.allowIndexing,
				ogImage:
					newImage !== undefined
						? {
								originalKey: newImage.key,
								height: newImage.height,
								width: newImage.width,
								url: newImage.url
							}
						: undefined
			})
		})

		for (const key of oldKeys) {
			try {
				await this.s3StorageService.delete(key)
			} catch {}
		}

		if (newImage && updated.ogImage) {
			await this.imageQueueService.enqueueResourceOgImageProcess({
				entityId: updated.id,
				entityFileId: updated.ogImage.id,
				srcKey: newImage.key
			})
		}
	}

	async changeStatus(resourceId: number, dto: ChangeStatusDto) {
		const exists = await this.resourceRepository.findOne({
			where: { id: resourceId },
			relations: ['image']
		})
		if (!exists) throw new NotFoundException('Resource not found.')

		if (dto.status !== EResourceStatus.SCHEDULED && dto.schedulePublish) {
			throw new BadRequestException('When specifying Schedule Publish, you must specify the Scheduled status.')
		}

		if (dto.status === EResourceStatus.PUBLISHED || dto.status === EResourceStatus.SCHEDULED) {
			const errorReqFields: string[] = []
			if (!exists.image) errorReqFields.push('Image required.')
			if (!exists.title) errorReqFields.push('Title required.')
			if (!exists.slug) errorReqFields.push('Slug required.')
			if (!exists.categories.length) errorReqFields.push('Categories required.')
			if (!exists.format) errorReqFields.push('Resource type required.')

			if (errorReqFields.length > 0) {
				throw new BadRequestException(errorReqFields)
			}
		}

		let lastPublishedAt: Date | undefined
		if (dto.status === EResourceStatus.PUBLISHED) {
			lastPublishedAt = new Date()
		}

		if (dto.schedulePublish) {
			await this.scheduleQueueService.resourceSchedulePublish({
				entityId: resourceId,
				runAt: dto.schedulePublish
			})
		}

		if (dto.scheduleExpire) {
			await this.scheduleQueueService.resourceScheduleExpired({
				entityId: resourceId,
				runAt: dto.scheduleExpire
			})
		}

		await this.resourceRepository.save({
			id: resourceId,
			status: dto.status,
			publishAt: dto.schedulePublish,
			expireAt: dto.scheduleExpire,
			lastPublishedAt: lastPublishedAt,
			commentsEnabled: dto.commentsEnabled
		})
	}

	async deleteResource(resourceId: number, dto: DeleteResourceDto) {
		if (dto.method === 'soft') {
			await this.resourceRepository.update(resourceId, { status: EResourceStatus.ARCHIVED })
			return
		}

		if (dto.method === 'hard') {
			const resource = await this.resourceRepository
				.createQueryBuilder('resource')
				.leftJoinAndSelect('resource.image', 'image')
				.addSelect(['image.originalKey', 'image.processedKey'])
				.leftJoinAndSelect('resource.ogImage', 'ogImage')
				.addSelect(['ogImage.originalKey', 'ogImage.processedKey'])
				.leftJoinAndSelect('resource.sections', 'section')
				.leftJoinAndSelect('section.attachments', 'attachment')
				.addSelect(['attachment.originalKey', 'attachment.processedKey'])
				.where('resource.id = :id', { id: resourceId })
				.getOne()

			if (!resource) return

			const keysToDelete: string[] = []
			const attachmentIds: number[] = []

			const pushKey = (key?: string | null) => {
				if (key) keysToDelete.push(key)
			}

			if (resource.image) {
				pushKey(resource.image.originalKey)
				pushKey(resource.image.processedKey)
			}

			if (resource.ogImage) {
				pushKey(resource.ogImage.originalKey)
				pushKey(resource.ogImage.processedKey)
			}

			for (const section of resource.sections ?? []) {
				for (const attachment of section.attachments ?? []) {
					attachmentIds.push(attachment.id)
					pushKey(attachment.originalKey)
					pushKey(attachment.processedKey)
				}
			}

			await this.dataSource.transaction(async manager => {
				const sectionAttachmentRepo = manager.getRepository(ResourceSectionAttachment)
				const resourceImageRepo = manager.getRepository(ResourceImage)
				const resourceRepo = manager.getRepository(Resource)

				if (attachmentIds.length) {
					await sectionAttachmentRepo.delete(attachmentIds)
				}

				if (resource.image) {
					await resourceImageRepo.delete(resource.image.id)
				}

				if (resource.ogImage) {
					await resourceImageRepo.delete(resource.ogImage.id)
				}

				await resourceRepo.delete(resourceId)
			})

			for (const key of keysToDelete) {
				try {
					await this.s3StorageService.delete(key)
				} catch {}
			}
		}
	}

	async addView(resourceId: number) {
		await this.metricsSystemService.addView(EDailyMetricType.RESOURCE_VIEW, resourceId)
	}

	async toggleHelpful(resourceId: number, userId: number) {
		await this.dataSource.transaction(async manager => {
			const del = await manager
				.getRepository(DailyMetric)
				.createQueryBuilder()
				.delete()
				.from(DailyMetric)
				.where('user = :userId AND metricType = :metricType AND entityId = :entityId', {
					userId,
					metricType: EDailyMetricType.RESOURCE_HELPFUL,
					entityId: resourceId
				})
				.execute()

			const deleted = del.affected ?? 0

			if (deleted > 0) {
				await manager
					.getRepository(Resource)
					.createQueryBuilder()
					.update(Resource)
					.set({
						totalHelpful: () => 'GREATEST(total_helpful - :dec, 0)'
					})
					.where('id = :id', { id: resourceId })
					.setParameters({ dec: deleted })
					.execute()

				return
			}

			await manager
				.getRepository(DailyMetric)
				.createQueryBuilder()
				.insert()
				.into(DailyMetric)
				.values({
					metricType: EDailyMetricType.RESOURCE_HELPFUL,
					entityId: resourceId,
					user: { id: userId },
					day: new Date().toISOString().slice(0, 10)
				})
				.execute()

			await manager
				.getRepository(Resource)
				.createQueryBuilder()
				.update(Resource)
				.set({
					totalHelpful: () => 'total_helpful + 1'
				})
				.where('id = :id', { id: resourceId })
				.execute()
		})

		return await this.resourceQueryService.getResourceHelpful(resourceId)
	}
}
