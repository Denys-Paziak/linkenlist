import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'

import { EImageStatus } from '../../../interfaces/EImageStatus'
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

	async updateLink(id: number, link: DeepPartial<Link>) {
		return await this.linkRepository.save({ id, ...link })
	}

	async isImageStatus(id: number, status: EImageStatus) {
		return await this.linkImageRepository.exists({ where: { id, status } })
	}

	async updateImageStatus(id: number, status: EImageStatus) {
		await this.linkImageRepository.update(id, { status })
	}
}
