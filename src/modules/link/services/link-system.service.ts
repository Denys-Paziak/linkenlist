import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'

import { Link } from '../entities/Link.entity'

@Injectable()
export class LinkSystemService {
	constructor(
		@InjectRepository(Link)
		private readonly linkRepository: Repository<Link>
	) {}

	async saveLink(id: number, link: DeepPartial<Link>) {
		return await this.linkRepository.save({ id, ...link })
	}
}
