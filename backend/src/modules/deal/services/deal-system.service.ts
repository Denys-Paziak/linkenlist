import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'

import { EFileStatus } from '../../../interfaces/EFileStatus'
import { Deal } from '../entities/Deal.entity'
import { DealImage } from '../entities/DealImage.entity'
import { DealSectionAttachment } from '../entities/DealSectionAttachment.entity'
import { DealSection } from '../entities/DealSection.entity'

@Injectable()
export class DealSystemService {
	constructor(
		@InjectRepository(Deal)
		private readonly dealRepository: Repository<Deal>,
		@InjectRepository(DealImage)
		private readonly dealImageRepository: Repository<DealImage>,
		@InjectRepository(DealSection)
		private readonly dealSection: Repository<DealSection>,
		@InjectRepository(DealSectionAttachment)
		private readonly dealSectionAttachmentRepository: Repository<DealSectionAttachment>
	) {}

	async updateDeal(id: number, data: DeepPartial<Deal>) {
		return await this.dealRepository.save({ id, ...data })
	}

	async isImageStatus(id: number, status: EFileStatus) {
		return await this.dealImageRepository.exists({ where: { id, status } })
	}

	async updatImageStatus(id: number, status: EFileStatus) {
		await this.dealImageRepository.update(id, { status })
	}

	async updateDealSectionAttachment(id: number, data: DeepPartial<DealSectionAttachment>) {
		return await this.dealSectionAttachmentRepository.save({ id, ...data })
	}

	async isAttachmentStatus(id: number, status: EFileStatus) {
		return await this.dealSectionAttachmentRepository.exists({ where: { id, status } })
	}

	async updatAttachmentStatus(id: number, status: EFileStatus) {
		await this.dealSectionAttachmentRepository.update(id, { status })
	}
}
