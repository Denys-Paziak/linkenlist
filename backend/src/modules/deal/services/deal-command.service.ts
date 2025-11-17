import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { extname } from 'node:path'
import { DataSource, EntityManager, Like, Not, Repository } from 'typeorm'

import { EOgImageMode } from '../../../interfaces/EOgImageMode'
import { IMultipartFile } from '../../../interfaces/IMultipartFile'
import { IUploadedFile, IUploadedImage } from '../../../interfaces/IUploadedFile'
import { generateRandomSuffix } from '../../../utils/generate-random-suffix.util'
import { generateSlug } from '../../../utils/slug.util'
import { ImageQueueService } from '../../image-queue/image-queue.service'
import { S3StorageService } from '../../s3-storage/s3-storage.service'
import { ChangePosContentSectionsDto } from '../dtos/ChangePosContentSections.dto'
import { GetSimplifiedDealsDto } from '../dtos/GetSimplifiedDeals.dto'
import { SaveBasicInformationDto } from '../dtos/SaveBasicInformation.dto'
import { SaveContentSectionDto } from '../dtos/SaveContentSection.dto'
import { SaveOfferDetailsDto } from '../dtos/SaveOfferDetails.dto'
import { SetSelectRelatedDealsDto } from '../dtos/SetSelectRelatedDeals.dto'
import { SwitchRelatedDealsMode } from '../dtos/SwitchRelatedDealsMode.dto'
import { SwitchShowOfferDetailsDto } from '../dtos/SwitchShowOfferDetails.dto'
import { Deal } from '../entities/Deal.entity'
import { DealImage } from '../entities/DealImage.entity'
import { DealRelated } from '../entities/DealRelated.entity'
import { DealSection } from '../entities/DealSection.entity'
import { DealSectionAttachment } from '../entities/DealSectionAttachment.entity'
import { DealTag } from '../entities/DealTag.entity'

@Injectable()
export class DealCommandService {
	constructor(
		@InjectRepository(Deal) 
		private readonly dealRepository: Repository<Deal>,
		@InjectRepository(DealImage) 
		private readonly dealImageRepository: Repository<DealImage>,
		@InjectRepository(DealSection) 
		private readonly dealSectionRepository: Repository<DealSection>,
		@InjectRepository(DealRelated)
		private readonly dealRelatedRepository: Repository<DealRelated>,
		private readonly dataSource: DataSource,
		private readonly imageQueueService: ImageQueueService,
		private readonly s3StorageService: S3StorageService
	) {}

	private async saveImage(file: IMultipartFile, dealId: number): Promise<IUploadedImage> {
		const { url, key } = await this.s3StorageService.uploadPublic(file.buffer, file.mimetype, false, {
			filename: file.filename,
			path: 'deals/heroes/' + dealId
		})
		return { key, url, width: file.width, height: file.height }
	}

	private async saveFile(file: IMultipartFile, dealId: number, sectionId: number): Promise<IUploadedFile> {
		const { url, key } = await this.s3StorageService.uploadPublic(file.buffer, file.mimetype, false, {
			filename: file.filename,
			path: 'deals/attachments/' + dealId + '/' + sectionId
		})

		return { key, url, name: file.filename, ext: extname(file.filename).substring(1) }
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
		return await this.dealRepository.save({})
	}

	async saveBasicInformation(dealId: number, dto: SaveBasicInformationDto, file?: IMultipartFile) {
		const exists = await this.dealRepository.findOne({
			where: { id: dealId },
			relations: ['image', 'ogImage'],
			select: {
				id: true,
				title: true,
				categories: true,
				outboundUrl: true,
				ogImageMode: true,
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
			if (dto.title) {
				slug = await this.generateSlugUnique(dto.title)
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

			return repo.save({
				id: dealId,
				title: dto.title,
				seoMetaTitle: dto.title,
				slug: slug === '' ? undefined : slug,
				tags: tagsToSet,
				teaser: dto.teaser === '' ? null : dto.teaser,
				seoMetaDescription: dto.teaser === '' ? null : dto.teaser,
				categories: dto.categories,
				outboundUrl: dto.outboundUrl,
				outboundUrlButtonLabel: dto.outboundUrlButtonLabel === '' ? 'Go to Deal' : dto.outboundUrlButtonLabel,
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
			this.imageQueueService.enqueueDealHeroProcess({
				entityId: updated.id,
				entityFileId: updated.image.id,
				srcKey: newImage.key
			})
			if (updated.ogImage && exists.ogImageMode === EOgImageMode.USE_HERO) {
				this.imageQueueService.enqueueDealOgImageProcess({
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
		if (!exists.yourPrice && !dto.yourPrice) errorReqFields.push('Your price URL required.')
		if (!exists.providerDisplayName && !dto.providerDisplayName) errorReqFields.push('Provider display name required.')

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
		const sections = await this.dealRepository.findOne({ where: { id: dealId }, relations: ['contentBlocks'] })

		let maxPost = 0

		for (const block of sections?.contentBlocks || []) {
			if (maxPost < block.position) {
				maxPost = block.position
			}
		}

		return await this.dealSectionRepository.save({ position: maxPost + 1, deal: { id: dealId } })
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

	async saveContentSection(dealId: number, sectionId: number, dto: SaveContentSectionDto, file?: IMultipartFile) {
		const exists = await this.dealSectionRepository.findOne({
			where: { id: sectionId },
			relations: ['attachment'],
			select: {
				id: true,
				attachment: {
					id: true,
					originalKey: true,
					processedKey: true
				}
			}
		})
		if (!exists) throw new NotFoundException('Deal not found.')

		let newAttachment: IUploadedFile | undefined = undefined
		const oldKeys: string[] = []

		if (file) {
			newAttachment = await this.saveFile(file, dealId, sectionId)

			if (exists.attachment?.originalKey) oldKeys.push(exists.attachment.originalKey)
			if (exists.attachment?.processedKey) oldKeys.push(exists.attachment.processedKey)
		}

		const updated = await this.dataSource.transaction(async manager => {
			const repo = manager.getRepository(DealSection)

			if (newAttachment !== undefined && exists.attachment) {
				await manager.getRepository(DealSectionAttachment).delete(exists.attachment.id)
			}

			return await repo.save({
				id: sectionId,
				title: dto.title || 'Section',
				bodyMd: dto.bodyMd,
				enabled: dto.enabled,
				attachment:
					newAttachment === undefined
						? undefined
						: {
								originalKey: newAttachment.key,
								name: newAttachment.name,
								ext: newAttachment.ext,
								url: newAttachment.url
							}
			})
		})

		for (const key of oldKeys) {
			try {
				await this.s3StorageService.delete(key)
			} catch {}
		}

		if (newAttachment && updated.attachment) {
			this.imageQueueService.enqueueDealAttachmentProcess({
				entityId: updated.id,
				entityFileId: updated.attachment.id,
				srcKey: newAttachment.key
			})
		}
	}

	async switchRelatedDealsMode(dealId: number, dto: SwitchRelatedDealsMode) {
		await this.dealRepository.update(dealId, {
			relatedAutoMode: dto.relatedAutoMode
		})
	}

	async getSimplifiedDeals(query: GetSimplifiedDealsDto) {
		return await this.dealRepository.find({
			where: query?.search ? { title: Like(query.search) } : {},
			select: { id: true, title: true, slug: true, isVerified: true },
			skip: (query.page - 1) * query.limit,
			take: query.limit,
			order: { id: 'ASC' }
		})
	}

	async setSelectRelatedDeals(dealId: number, dto: SetSelectRelatedDealsDto) {
		await this.dealRelatedRepository.insert(
			dto.dealIds.map(relatedDealId => ({
				source: { id: dealId },
				target: { id: relatedDealId }
			}))
		)
	}
}
