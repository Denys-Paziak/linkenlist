import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ELinkStatus } from '@/interfaces/ELinkStatus'
import { IMultipartFile } from '@/interfaces/IMultipartFile'
import { S3StorageService } from '@/modules/s3-storage/s3-storage.service'
import { generateRandomSuffix } from '@/utils/generate-random-suffix.util'
import { generateSlug } from '@/utils/slug.util'

import { CreateLinkDto } from '../dtos/CreateLink.dto'
import { DeleteLinkDto } from '../dtos/DeleteLink.dto'
import { Link } from '../entities/Link.entity'
import { LinkImage } from '../entities/LinkImage.entity'

@Injectable()
export class LinkCommandService {
	constructor(
		@InjectRepository(Link)
		private readonly linkRepository: Repository<Link>,
		@InjectRepository(LinkImage)
		private readonly linkImageRepository: Repository<LinkImage>,

		private readonly s3StorageService: S3StorageService
	) {}

	async createLink(dto: CreateLinkDto, file?: IMultipartFile) {
		let imageData: {
			key: string
			url: string
			width?: number
			height?: number
		} | null = null

		if (file) {
			const { url, key } = await this.s3StorageService.uploadPublic(file.buffer, file.filename, file.mimetype, 'links')

			imageData = {
				key,
				url,
				width: file.width,
				height: file.height
			}
		}

		try {
			let slug = generateSlug(dto.title)

			const exists = await this.linkRepository.exists({ where: { slug } })
			if (exists) {
				const randomSuffix = generateRandomSuffix()
				slug = `${slug}-${randomSuffix}`
			}

			await this.linkRepository.save({
				title: dto.title,
				description: dto.description,
				branches: dto.branches,
				category: dto.category,
				tags: dto.tags,
				slug,
				status: ELinkStatus.PUBLISHED,
				url: dto.url,
				image: imageData,
				verified: true,
				verifiedAt: new Date(),
				verifiedBy: 'admin'
			})
		} catch (error) {
			if (imageData) {
				await this.s3StorageService.delete(imageData.key)
			}

			throw error
		}
	}

	async deleteLink(dto: DeleteLinkDto) {
		if (dto.method === 'soft') {
			await this.linkRepository.update(dto.id, { status: ELinkStatus.ARCHIVED })
		}

		if (dto.method === 'hard') {
			const link = await this.linkRepository.findOne({ where: { id: dto.id } })

			if (link?.image) {
				await this.s3StorageService.delete(link.image.key)
				await this.linkImageRepository.delete(link.image.id)
			}

			await this.linkRepository.delete(dto.id)
		}
	}
}
