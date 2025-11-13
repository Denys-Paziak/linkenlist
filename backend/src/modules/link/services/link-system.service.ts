import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'

import { EFileStatus } from '../../../interfaces/EFileStatus'
import { Link } from '../entities/Link.entity'
import { LinkImage } from '../entities/LinkImage.entity'

@Injectable()
export class LinkSystemService {
	constructor(
		@InjectRepository(Link)
		private readonly linkRepository: Repository<Link>,
		@InjectRepository(LinkImage)
		private readonly linkImageRepository: Repository<LinkImage>
	) {}

	async updateLink(id: number, data: DeepPartial<Link>) {
		return await this.linkRepository.save({ id, ...data })
	}

	async isImageStatus(id: number, status: EFileStatus) {
		return await this.linkImageRepository.exists({ where: { id, status } })
	}

	async updatImageStatus(id: number, status: EFileStatus) {
		await this.linkImageRepository.update(id, { status })
	}
}
