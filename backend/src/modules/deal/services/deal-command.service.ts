import { ConflictException, Injectable } from '@nestjs/common'
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
import { DealTag } from '../entities/DealTag.entity'

@Injectable()
export class DealCommandService {
	constructor(
		@InjectRepository(Deal) private readonly dealRepository: Repository<Deal>,
		private readonly dataSource: DataSource,
		private readonly imageQueueService: ImageQueueService,
		private readonly s3StorageService: S3StorageService
	) {}

	private async saveImage(file: IMultipartFile, linkId: number): Promise<IUploadedImage> {
		const { url, key } = await this.s3StorageService.uploadPublic(file.buffer, file.mimetype, false, {
			filename: file.filename,
			path: 'links',
			entityId: linkId
		})
		return { key, url, width: file.width, height: file.height }
	}

	private async generateSlugUnique(title: string) {
		let slug = generateSlug(title)
		const exists = await this.dealRepository.exists({ where: { slug } })
		if (exists) slug = `${slug}-${generateRandomSuffix()}`
		return slug
	}

	private async upsertTagsByNames(names: string[] | null, manager: EntityManager): Promise<DealTag[] | null | undefined> {
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

	async saveBasicInformation(dto: SaveBasicInformationDto, file: IMultipartFile) {
		let slug: string | undefined 
		
		if (dto.slug) {
			if (await this.dealRepository.exists({ where: { slug: dto.slug } })) {
				throw new ConflictException('This slug already exists.')
			}
		} else {
			if (dto.title) {
				slug = await this.generateSlugUnique(dto.title)
			}
		}

		const deal = await this.dataSource.transaction(async manager => {
			const tags = await this.upsertTagsByNames(dto.tags ?? [], manager)

			return manager.getRepository(Deal).save({
				title: dto.title,
				slug,
				tags: tags || [],
				teaser: dto.teaser,
				branches: dto.branches || [],
				outboundURL: dto.outboundURL,
				outboundURLButtonLabel: dto.outboundURLButtonLabel
			})
		})

		if (!deal) return

		const uploaded = await this.saveImage(file, deal.id)
		const { image } = await this.dealRepository.save({
			id: deal.id,
			image: {
				originalKey: uploaded.key,
				height: uploaded.height,
				width: uploaded.width,
				url: uploaded.url
			}
		})

		this.imageQueueService.enqueueProcess({ linkId: deal.id, linkImageId: image.id, srcKey: uploaded.key })
	}
}
