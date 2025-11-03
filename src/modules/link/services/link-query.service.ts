import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Link } from '../entities/Link.entity'
import { LinkTag } from '../entities/LinkTag.entity'

@Injectable()
export class LinkQueryService {
	constructor(
		@InjectRepository(Link)
		private readonly linkRepository: Repository<Link>,
		@InjectRepository(LinkTag)
		private readonly linkTagRepository: Repository<LinkTag>
	) {}

	async getAllLinks() {
		return await this.linkRepository.find()
	}

	async getAllLinkTags() {
		return await this.linkTagRepository
			.createQueryBuilder('tag')
			.leftJoin('link_tags_join', 'ltj', 'ltj."linkTagsId" = tag.id')
			.leftJoin(Link, 'link', 'link.id = ltj."linksId"')
			.select(['tag.id AS id', 'tag.name AS name'])
			.addSelect('COUNT(DISTINCT link.id)', 'count')
			.groupBy('tag.id')
			.addGroupBy('tag.name')
			.orderBy('count', 'DESC')
			.getRawMany<{ id: number; name: string; count: string }>()
	}
}
