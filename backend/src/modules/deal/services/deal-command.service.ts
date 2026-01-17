import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { extname } from 'node:path'
import { DataSource, EntityManager, Not, Repository } from 'typeorm'

import { EDailyMetricType } from '../../../interfaces/EDailyMetricType'
import { EDealStatus } from '../../../interfaces/EDealStatus'
import { EFileStatus } from '../../../interfaces/EFileStatus'
import { EOgImageMode } from '../../../interfaces/EOgImageMode'
import { IMultipartFile } from '../../../interfaces/IMultipartFile'
import { IUploadedFile, IUploadedImage } from '../../../interfaces/IUploadedFile'
import { generateRandomSuffix } from '../../../utils/generate-random-suffix.util'
import { generateSlug } from '../../../utils/slug.util'
import { ImageQueueService } from '../../image-queue/image-queue.service'
import { MetricsSystemService } from '../../metrics/services/metrics-system.service'
import { Resource } from '../../resource/entities/Resource.entity'
import { S3StorageService } from '../../s3-storage/s3-storage.service'
import { ScheduleQueueService } from '../../schedule-queue/schedule-queue.service'
import { ChangePosContentSectionsDto } from '../dtos/ChangePosContentSections.dto'
import { ChangeStatusDto } from '../dtos/ChangeStatus.dto'
import { DeleteDealDto } from '../dtos/DeleteDeal.dto'
import { SaveBasicInformationDto } from '../dtos/SaveBasicInformation.dto'
import { SaveContentSectionDto } from '../dtos/SaveContentSection.dto'
import { SaveOfferDetailsDto } from '../dtos/SaveOfferDetails.dto'
import { SaveSEODto } from '../dtos/SaveSEO.dto'
import { SetSelectRelatedDto } from '../dtos/SetSelectRelatedDto.dto'
import { SwitchFeaturedDto } from '../dtos/SwitchFeatured.dto'
import { SwitchRelatedMode } from '../dtos/SwitchRelatedMode.dto'
import { SwitchShowOfferDetailsDto } from '../dtos/SwitchShowOfferDetails.dto'
import { Deal } from '../entities/Deal.entity'
import { DealImage } from '../entities/DealImage.entity'
import { DealRelated } from '../entities/DealRelated.entity'
import { DealSection } from '../entities/DealSection.entity'
import { DealSectionAttachment } from '../entities/DealSectionAttachment.entity'
import { DealTag } from '../entities/DealTag.entity'

import { DealQueryService } from './deal-query.service'
import { DailyMetric } from '../../metrics/entities/Metrics.entity'

@Injectable()
export class DealCommandService {
	constructor(
		@InjectRepository(Deal)
		private readonly dealRepository: Repository<Deal>,
		@InjectRepository(DealSection)
		private readonly dealSectionRepository: Repository<DealSection>,
		@InjectRepository(DealRelated)
		private readonly dealRelatedRepository: Repository<DealRelated>,
		private readonly dataSource: DataSource,
		private readonly imageQueueService: ImageQueueService,
		private readonly scheduleQueueService: ScheduleQueueService,
		private readonly s3StorageService: S3StorageService,
		private readonly metricsSystemService: MetricsSystemService,
		private readonly dealQueryService: DealQueryService
	) {}

	private async saveImage(file: IMultipartFile, dealId: number): Promise<IUploadedImage> {
		const { url, key } = await this.s3StorageService.uploadPublic(file.buffer, file.mimetype, false, {
			filename: file.filename,
			path: 'deals/heroes/' + dealId
		})
		return { key, url, width: file.width, height: file.height }
	}

	private async saveFile(file: IMultipartFile, dealId: number, sectionId: number): Promise<IUploadedFile> {
		const { url, key } = await this.s3StorageService.uploadPublic(
			file.buffer,
			file.mimetype,
			false,
			{
				filename: file.filename,
				path: 'deals/attachments/' + dealId + '/' + sectionId
			},
			{
				download: true
			}
		)

		return { key, url, name: file.filename, ext: extname(file.filename).substring(1), size: file.size }
	}

	private async generateSlugUnique(title: string) {
		let slug = generateSlug(title)
		const exists = await this.dealRepository.exists({ where: { slug } })
		if (exists) slug = `${slug}-${generateRandomSuffix()}`
		return slug
	}

	private async upsertTagsByNames(names: string[] | null | undefined, manager: EntityManager): Promise<DealTag[] | undefined> {
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

	async initDeal() {
		return (await this.dealRepository.save({})).id
	}

	async saveBasicInformation(dealId: number, dto: SaveBasicInformationDto, file?: IMultipartFile) {
		const exists = await this.dealRepository.findOne({
			where: { id: dealId },
			relations: ['image', 'ogImage', 'featuredResource'],
			select: {
				id: true,
				title: true,
				slug: true,
				categories: true,
				outboundUrl: true,
				ogImageMode: true,
				featuredResource: {
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
		if (!exists) throw new NotFoundException('Deal not found.')

		const errorReqFields: string[] = []
		if (!exists.image && !file) errorReqFields.push('Image required.')
		if (!exists.title && !dto.title) errorReqFields.push('Title required.')
		if (!exists.categories.length && !dto.categories?.length) errorReqFields.push('Categories required.')
		if (!exists.outboundUrl && !dto.outboundUrl) errorReqFields.push('Outbound URL required.')

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
			if (await this.dealRepository.exists({ where: { slug: dto.slug, id: Not(dealId) } })) {
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
			const repo = manager.getRepository(Deal)

			const tagsToSet = await this.upsertTagsByNames(dto.tags, manager)

			if (newImage !== undefined && exists.image) {
				await manager.getRepository(DealImage).delete(exists.image.id)
				if (exists.ogImage && exists.ogImageMode === EOgImageMode.USE_HERO) {
					await manager.getRepository(DealImage).delete(exists.ogImage.id)
				}
			}

			if (typeof dto.featuredResourceId === 'number') {
				manager.getRepository(Resource).save({
					id: dto.featuredResourceId,
					featuredDeal: { id: dealId }
				})
			}
			if (dto.featuredResourceId === null && exists.featuredResource) {
				manager.getRepository(Resource).save({
					id: exists.featuredResource.id,
					featuredDeal: null
				})
			}

			return repo.save({
				id: dealId,
				title: dto.title,
				seoMetaTitle: seoMetaTitle(),
				slug: slug,
				tags: tagsToSet,
				tagsText: dto.tags?.join(' '),
				teaser: dto.teaser === '' ? null : dto.teaser,
				seoMetaDescription: seoMetaDescription(),
				categories: dto.categories,
				outboundUrl: dto.outboundUrl,
				outboundUrlButtonLabel: dto.outboundUrlButtonLabel === '' ? 'Go to Deal' : dto.outboundUrlButtonLabel,
				featuredResource:
					typeof dto.featuredResourceId === 'number' ? { id: dto.featuredResourceId } : dto.featuredResourceId,
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
			await this.imageQueueService.enqueueDealHeroProcess({
				entityId: updated.id,
				entityFileId: updated.image.id,
				srcKey: newImage.key
			})
			if (updated.ogImage && exists.ogImageMode === EOgImageMode.USE_HERO) {
				await this.imageQueueService.enqueueDealOgImageProcess({
					entityId: updated.id,
					entityFileId: updated.ogImage.id,
					srcKey: newImage.key
				})
			}
		}
	}

	async saveOfferDetails(dealId: number, dto: SaveOfferDetailsDto) {
		const exists = await this.dealRepository.findOne({ where: { id: dealId } })
		if (!exists) throw new NotFoundException('Deal not found.')

		const errorReqFields: string[] = []
		if (!exists.dealType && !dto.dealType) errorReqFields.push('Deal type required.')
		if (!exists.originalPrice && !dto.originalPrice) errorReqFields.push('Original price required.')
		if (!exists.yourPrice && !dto.yourPrice) errorReqFields.push('Your price required.')
		if (!exists.providerDisplayName && !dto.providerDisplayName) errorReqFields.push('Provider display name required.')
		if (dto.ongoingOffer !== true) {
			if (dto.ongoingOffer === false || exists.ongoingOffer === false) {
				if (!dto.validFrom && !exists.validFrom) {
					errorReqFields.push('Valid from is required when Ongoing offer is false.')
				}
			}
		}
		if (dto.ongoingOffer !== true) {
			if (dto.ongoingOffer === false || exists.ongoingOffer === false) {
				if (!dto.validUntil && !exists.validUntil) {
					errorReqFields.push('Valid until is required when Ongoing offer is false.')
				}
			}
		}

		if (errorReqFields.length > 0) {
			throw new BadRequestException(errorReqFields)
		}

		await this.dealRepository.save({
			id: dealId,
			dealType: dto.dealType,
			originalPrice: dto.originalPrice,
			yourPrice: dto.yourPrice,
			cadencePrice: dto.cadencePrice,
			promoCode: dto.promoCode,
			whereToEnterCode: dto.whereToEnterCode,
			ongoingOffer: dto.ongoingOffer,
			validFrom: dto.validFrom,
			validUntil: dto.validUntil,
			providerDisplayName: dto.providerDisplayName
		})
	}

	async switchShowOfferDetails(dealId: number, dto: SwitchShowOfferDetailsDto) {
		await this.dealRepository.update(dealId, { offerEnabled: dto.offerEnabled })
	}

	async createContentSection(dealId: number) {
		const sections = await this.dealRepository.findOne({ where: { id: dealId }, relations: ['sections'] })

		let maxPost = 0

		for (const block of sections?.sections || []) {
			if (maxPost < block.position) {
				maxPost = block.position
			}
		}

		const newSection = await this.dealSectionRepository.save({ position: maxPost + 1, deal: { id: dealId } })

		return await this.dealSectionRepository.findOne({ where: { id: newSection.id }, relations: ['attachments'] })
	}

	async deleteContentSection(dealId: number, sectionId: number) {
		await this.dealSectionRepository.delete({ id: sectionId, deal: { id: dealId } })
	}

	async changePosContentSections(dealId: number, dto: ChangePosContentSectionsDto) {
		await this.dataSource.query(
			`
				UPDATE deal_sections AS ds
				SET position = v.position
				FROM (VALUES 
				${dto.items.map(u => `(${u.sectionId}, ${u.position})`).join(',')}
				) AS v(id, position)
				WHERE ds.id = v.id
				AND ds.deal_id = $1
			`,
			[dealId]
		)
	}

	async saveContentSection(dealId: number, sectionId: number, dto: SaveContentSectionDto, files?: IMultipartFile[]) {
		const exists = await this.dealSectionRepository.findOne({
			where: { id: sectionId, deal: { id: dealId } },
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
		if (!exists) throw new NotFoundException('Deal section not found.')

		const deleteAttachments: DealSectionAttachment[] = []
		const remainedAttachments: DealSectionAttachment[] = []

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
						return this.saveFile(file, dealId, sectionId)
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
				await manager.getRepository(DealSectionAttachment).delete(deleteAttachments.map(a => a.id))
			}

			return await manager.getRepository(DealSection).save({
				id: sectionId,
				title: dto.title || 'Section',
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
			for (const item of updated.attachments) {
				if (item.status === EFileStatus.QUEUED) {
					await this.imageQueueService.enqueueDealAttachmentProcess({
						entityId: updated.id,
						entityFileId: item.id,
						srcKey: item.originalKey || ''
					})
				}
			}
		}
	}

	async switchRelatedMode(dealId: number, dto: SwitchRelatedMode) {
		await this.dealRepository.update(dealId, {
			relatedAutoMode: dto.relatedAutoMode
		})
	}

	async switchFeatured(resourceId: number, dto: SwitchFeaturedDto) {
		await this.dealRepository.update(resourceId, {
			isFeatured: dto.isFeatured
		})
	}

	async addSelectRelated(dealId: number, dto: SetSelectRelatedDto) {
		await this.dealRelatedRepository.insert(
			dto.dealIds.map(relatedDealId => ({
				source: { id: dealId },
				target: { id: relatedDealId }
			}))
		)
	}

	async deleteSelectRelated(dealId: number, dto: SetSelectRelatedDto) {
		await this.dealRelatedRepository.delete(
			dto.dealIds.map(relatedDealId => ({
				source: { id: dealId },
				target: { id: relatedDealId }
			}))
		)
	}

	async saveSEO(dealId: number, dto: SaveSEODto, file?: IMultipartFile) {
		if (dto.ogImageMode === EOgImageMode.CUSTOM && !file) {
			throw new BadRequestException('Please upload an image for the custom OG mode')
		}

		if (dto.ogImageMode === EOgImageMode.USE_HERO && file) {
			throw new BadRequestException('You selected "Use hero image", so no custom OG file should be uploaded')
		}

		const exists = await this.dealRepository.findOne({
			where: { id: dealId },
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
		if (!exists) throw new NotFoundException('Deal not found.')

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
			const repo = manager.getRepository(Deal)

			if (newImage !== undefined && exists.ogImage) {
				await manager.getRepository(DealImage).delete(exists.ogImage.id)
			}

			return repo.save({
				id: dealId,
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
			await this.imageQueueService.enqueueDealOgImageProcess({
				entityId: updated.id,
				entityFileId: updated.ogImage.id,
				srcKey: newImage.key
			})
		}
	}

	async changeStatus(dealId: number, dto: ChangeStatusDto) {
		const exists = await this.dealRepository.findOne({
			where: { id: dealId },
			relations: ['image']
		})
		if (!exists) throw new NotFoundException('Deal not found.')

		if (dto.status !== EDealStatus.SCHEDULED && dto.schedulePublish) {
			throw new BadRequestException('When specifying Schedule Publish, you must specify the Scheduled status.')
		}

		if (dto.status === EDealStatus.PUBLISHED || dto.status === EDealStatus.SCHEDULED) {
			const errorReqFields: string[] = []
			if (!exists.image) errorReqFields.push('Image required.')
			if (!exists.title) errorReqFields.push('Title required.')
			if (!exists.slug) errorReqFields.push('Slug required.')
			if (!exists.categories.length) errorReqFields.push('Categories required.')
			if (!exists.outboundUrl) errorReqFields.push('Outbound URL required.')
			if (!exists.dealType) errorReqFields.push('Deal type required.')
			if (!exists.originalPrice) errorReqFields.push('Original price required.')
			if (!exists.yourPrice) errorReqFields.push('Your price required.')
			if (!exists.providerDisplayName) errorReqFields.push('Provider display name required.')

			if (errorReqFields.length > 0) {
				throw new BadRequestException(errorReqFields)
			}
		}

		let lastPublishedAt: Date | undefined
		if (dto.status === EDealStatus.PUBLISHED) {
			lastPublishedAt = new Date()
		}

		if (dto.schedulePublish) {
			await this.scheduleQueueService.dealSchedulePublish({
				entityId: dealId,
				runAt: dto.schedulePublish
			})
		}

		if (dto.scheduleExpire) {
			await this.scheduleQueueService.dealScheduleExpired({
				entityId: dealId,
				runAt: dto.scheduleExpire
			})
		}

		await this.dealRepository.save({
			id: dealId,
			status: dto.status,
			publishAt: dto.schedulePublish,
			expireAt: dto.scheduleExpire,
			lastPublishedAt: lastPublishedAt,
			commentsEnabled: dto.commentsEnabled
		})
	}

	async deleteDeal(dealId: number, dto: DeleteDealDto) {
		if (dto.method === 'soft') {
			await this.dealRepository.update(dealId, { status: EDealStatus.ARCHIVED })
			return
		}

		if (dto.method === 'hard') {
			const deal = await this.dealRepository
				.createQueryBuilder('deal')
				.leftJoinAndSelect('deal.image', 'image')
				.addSelect(['image.originalKey', 'image.processedKey'])
				.leftJoinAndSelect('deal.ogImage', 'ogImage')
				.addSelect(['ogImage.originalKey', 'ogImage.processedKey'])
				.leftJoinAndSelect('deal.sections', 'section')
				.leftJoinAndSelect('section.attachments', 'attachment')
				.addSelect(['attachment.originalKey', 'attachment.processedKey'])
				.where('deal.id = :id', { id: dealId })
				.getOne()

			if (!deal) return

			const keysToDelete: string[] = []
			const attachmentIds: number[] = []

			const pushKey = (key?: string | null) => {
				if (key) keysToDelete.push(key)
			}

			if (deal.image) {
				pushKey(deal.image.originalKey)
				pushKey(deal.image.processedKey)
			}

			if (deal.ogImage) {
				pushKey(deal.ogImage.originalKey)
				pushKey(deal.ogImage.processedKey)
			}

			for (const section of deal.sections ?? []) {
				for (const attachment of section.attachments ?? []) {
					attachmentIds.push(attachment.id)
					pushKey(attachment.originalKey)
					pushKey(attachment.processedKey)
				}
			}

			await this.dataSource.transaction(async manager => {
				const sectionAttachmentRepo = manager.getRepository(DealSectionAttachment)
				const resourceImageRepo = manager.getRepository(DealImage)
				const resourceRepo = manager.getRepository(Deal)

				if (attachmentIds.length) {
					await sectionAttachmentRepo.delete(attachmentIds)
				}

				if (deal.image) {
					await resourceImageRepo.delete(deal.image.id)
				}

				if (deal.ogImage) {
					await resourceImageRepo.delete(deal.ogImage.id)
				}

				await resourceRepo.delete(dealId)
			})

			for (const key of keysToDelete) {
				try {
					await this.s3StorageService.delete(key)
				} catch {}
			}
		}
	}

	async addView(dealId: number) {
		await this.metricsSystemService.addView(EDailyMetricType.DEAL_VIEW, dealId)
	}

	async toggleHelpful(dealId: number, userId: number) {
		await this.dataSource.transaction(async manager => {
			const del = await manager
				.getRepository(DailyMetric)
				.createQueryBuilder()
				.delete()
				.from(DailyMetric)
				.where('user = :userId AND metricType = :metricType AND entityId = :entityId', {
					userId,
					metricType: EDailyMetricType.DEAL_HELPFUL,
					entityId: dealId
				})
				.execute()

			const deleted = del.affected ?? 0

			if (deleted > 0) {
				await manager
					.getRepository(Deal)
					.createQueryBuilder()
					.update(Deal)
					.set({
						totalHelpful: () => 'GREATEST(total_helpful - :dec, 0)'
					})
					.where('id = :id', { id: dealId })
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
					metricType: EDailyMetricType.DEAL_HELPFUL,
					entityId: dealId,
					user: { id: userId },
					day: new Date().toISOString().slice(0, 10)
				})
				.execute()

			await manager
				.getRepository(Deal)
				.createQueryBuilder()
				.update(Deal)
				.set({
					totalHelpful: () => 'total_helpful + 1'
				})
				.where('id = :id', { id: dealId })
				.execute()
		})

		return await this.dealQueryService.getDealHelpful(dealId)
	}
}
