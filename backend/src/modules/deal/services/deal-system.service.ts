import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'

import { EImageStatus } from '../../../interfaces/EImageStatus'
import { Deal } from '../entities/Deal.entity'
import { DealImage } from '../entities/DealImage.entity'

@Injectable()
export class DealSystemService {
	constructor(
		@InjectRepository(Deal)
		private readonly dealRepository: Repository<Deal>,
		@InjectRepository(DealImage)
		private readonly dealImageRepository: Repository<DealImage>
	) {}

	async updateDeal(id: number, link: DeepPartial<Deal>) {
		return await this.dealRepository.save({ id, ...link })
	}

	async isImageStatus(id: number, status: EImageStatus) {
		return await this.dealImageRepository.exists({ where: { id, status } })
	}

	async updateImageStatus(id: number, status: EImageStatus) {
		await this.dealImageRepository.update(id, { status })
	}
}
