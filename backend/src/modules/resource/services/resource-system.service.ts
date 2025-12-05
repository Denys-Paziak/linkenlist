import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, FindOneOptions, Repository } from 'typeorm'

import { EFileStatus } from '../../../interfaces/EFileStatus'
import { EResourceStatus } from '../../../interfaces/EResourceStatus'
import { Resource } from '../entities/Resource.entity'
import { ResourceImage } from '../entities/ResourceImage.entity'
import { ResourceSection } from '../entities/ResourceSection.entity'
import { ResourceSectionAttachment } from '../entities/ResourceSectionAttachment.entity'

@Injectable()
export class ResourceSystemService {
	constructor(
		@InjectRepository(Resource)
		private readonly resourceRepository: Repository<Resource>,
		@InjectRepository(ResourceImage)
		private readonly resourceImageRepository: Repository<ResourceImage>,
		@InjectRepository(ResourceSection)
		private readonly resourceSection: Repository<ResourceSection>,
		@InjectRepository(ResourceSectionAttachment)
		private readonly resourceSectionAttachmentRepository: Repository<ResourceSectionAttachment>
	) {}

	async findResource(options: FindOneOptions<Resource>) {
		return await this.resourceRepository.findOne(options)
	}

	async updateResource(id: number, data: DeepPartial<Resource>) {
		return await this.resourceRepository.save({ id, ...data })
	}

	async updateResourceStatus(id: number, status: EResourceStatus) {
		let lastPublishedAt: Date | undefined
		let publishAt: Date | undefined | null
		let expireAt: Date | undefined | null
		if (status === EResourceStatus.PUBLISHED) {
			lastPublishedAt = new Date()
			publishAt = null
		}
		if (status === EResourceStatus.EXPIRED) {
			expireAt = null
		}

		await this.resourceRepository.update(id, { status, lastPublishedAt, publishAt, expireAt })
	}

	async isImageStatus(id: number, status: EFileStatus) {
		return await this.resourceImageRepository.exists({ where: { id, status } })
	}

	async updatImageStatus(id: number, status: EFileStatus) {
		await this.resourceImageRepository.update(id, { status })
	}

	async updateResourceSectionAttachment(id: number, data: DeepPartial<ResourceSectionAttachment>) {
		return await this.resourceSectionAttachmentRepository.save({ id, ...data })
	}

	async isAttachmentStatus(id: number, status: EFileStatus) {
		return await this.resourceSectionAttachmentRepository.exists({ where: { id, status } })
	}

	async updateAttachmentStatus(id: number, status: EFileStatus) {
		await this.resourceSectionAttachmentRepository.update(id, { status })
	}
}
