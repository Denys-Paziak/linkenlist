import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ELinkStatus } from '../../../interfaces/ELinkStatus'
import { GetAllLinksAdminDto } from '../dtos/GetAllLinks.admin.dto'
import { GetAllLinksDto } from '../dtos/GetAllLinks.dto'
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

	async getAllLinksAdmin(query: GetAllLinksAdminDto) {
		return await this.linkRepository.findAndCount({
			skip: (query.page - 1) * query.limit,
			take: query.limit,
			order: { createdAt: 'DESC' },
			relations: ['tags']
		})
	}

	async getAllLinks(query: GetAllLinksDto) {
		const page = Math.max(1, Number(query.page ?? 1))
		const limit = Math.max(1, Number(query.limit ?? 9))
		const offset = (page - 1) * limit

		const qb = this.linkRepository
			.createQueryBuilder('l')
			.leftJoinAndSelect('l.image', 'img')
			.leftJoinAndSelect('l.tags', 't')
			.where('l.status = :status', { status: ELinkStatus.PUBLISHED })

		if (query.category) {
			qb.andWhere('l.category = :category', { category: query.category })
		}
		if (query.branch) {
			qb.andWhere(':branch = ANY(l.branches)', { branch: query.branch })
		}

		qb.select([
			'l.id',
			'l.title',
			'l.description',
			'l.url',
			'l.category',
			'l.branches',
			'l.status',
			'l.verified',
			'l.totalViews',
			'l.views30d',
			'l.popularScore',
			'l.isOfficial',
			'img',
			't.id',
			't.name'
		])

		switch (query.sort) {
			case 'recently_verified':
				qb.orderBy('l.verifiedAt', 'DESC', 'NULLS LAST')
				break

			case 'alphabetical':
				qb.addSelect('LOWER(l.title)', 'title_lower');
				qb.orderBy('title_lower', 'ASC');
				break

			case 'official_first':
				qb.orderBy('l.isOfficial', 'DESC').addOrderBy('l.popularScore', 'DESC')
				break

			case 'most_used':
				qb.orderBy('l.views30d', 'DESC')
				break

			default:
				qb.orderBy('l.popularScore', 'DESC')
				break
		}

		qb.skip(offset).take(limit)

		const countQb = this.linkRepository
			.createQueryBuilder('l')
			.leftJoin('l.tags', 't')
			.where('l.status = :status', { status: ELinkStatus.PUBLISHED })

		if (query.category) {
			countQb.andWhere('l.category = :category', { category: query.category })
		}
		if (query.branch) {
			countQb.andWhere(':branch = ANY(l.branches)', { branch: query.branch })
		}

		const cnt = await countQb.select('COUNT(DISTINCT l.id)', 'cnt').getRawOne<{ cnt: string }>()

		const items = await qb.getMany()
		return [items, Number(cnt?.cnt || 0)] as const
	}

	async getOneLink(id: number) {
		return await this.linkRepository.findOne({ where: { id }, relations: ['tags'] })
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
