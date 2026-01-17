import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ELinkStatus } from '../../../interfaces/ELinkStatus'
import { UserFavoriteLink } from '../../favorite/entities/UserFavorite.entity'
import { GetAllLinksDto } from '../dtos/GetAllLinks.dto'
import { GetAllLinksAdminDto } from '../dtos/GetAllLinksAdmin.dto'
import { Link } from '../entities/Link.entity'
import { LinkTag } from '../entities/LinkTag.entity'

@Injectable()
export class LinkQueryService {
	constructor(
		@InjectRepository(Link)
		private readonly linkRepository: Repository<Link>,
		@InjectRepository(LinkTag)
		private readonly linkTagRepository: Repository<LinkTag>,
		@Inject(CACHE_MANAGER)
		private readonly cacheManager: Cache
	) {}

	async getAllLinksAdmin(query: GetAllLinksAdminDto) {
		const page = Math.max(1, Number(query.page ?? 1))
		const limit = Math.max(9, Number(query.limit ?? 9))
		const offset = (page - 1) * limit

		const qb = this.linkRepository
			.createQueryBuilder('l')
			.leftJoinAndSelect('l.image', 'img')
			.select([
				'l.id',
				'l.title',
				'l.verified',
				'l.category',
				'l.status',
				'l.url',
				'l.updatedAt',
				'l.createdAt',
				'img.id',
				'img.url',
				'img.width',
				'img.height'
			])

		if (query.search && query.search.trim() !== '') {
			qb.andWhere(
				`(
					l.search_document @@ plainto_tsquery('english', :q)
					OR similarity(l.title, :q) > 0.15
					OR word_similarity(l.description, :q) > 0.07
					OR similarity(l.tags_text, :q) > 0.15
				)`,
				{ q: query.search }
			)

			qb.addSelect(
				`GREATEST(
					ts_rank_cd(l.search_document, plainto_tsquery('english', :q)),
					similarity(l.title, :q),
					word_similarity(l.description, :q),
					similarity(l.tags_text, :q)
				)`,
				'relevance'
			)

			qb.orderBy('relevance', 'DESC').addOrderBy('l.createdAt', 'DESC')
		} else {
			qb.orderBy('l.createdAt', 'DESC')
		}

		qb.skip(offset).take(limit)

		const [items, total] = await qb.getManyAndCount()
		return [items, total] as const
	}

	async getAllLinks(query: GetAllLinksDto, userId?: number) {
		const page = Math.max(1, Number(query.page ?? 1))
		const limit = Math.max(35, Number(query.limit ?? 35))
		const offset = (page - 1) * limit

		const cacheKey =
			'links:list|' +
			`page:${page}|` +
			`limit:${limit}|` +
			`cat:${query.category ?? 'all'}|` +
			`branch:${query.branch ?? 'all'}|` +
			`sort:${query.sort ?? 'default'}`

		if (!query.search || query.isFavorite) {
			const cached = await this.cacheManager.get<[Link[], number]>(cacheKey)
			if (cached) return cached
		}

		const qb = this.linkRepository
			.createQueryBuilder('l')
			.leftJoinAndSelect('l.image', 'img')
			.leftJoinAndSelect('l.tags', 't')
			.where('l.status = :status', { status: ELinkStatus.PUBLISHED })

		// CATEGORY
		if (query.category) {
			qb.andWhere('l.category = :category', { category: query.category })
		}

		// BRANCH
		if (query.branch) {
			qb.andWhere(':branch = ANY(l.branches)', { branch: query.branch })
		}

		// FAVORITES FILTER
		if (query.isFavorite) {
			if (!userId) {
				return [[], 0]
			}

			qb.innerJoin(UserFavoriteLink, 'ufd', 'ufd.linkId = l.id AND ufd.userId = :userId', { userId })
		}

		// SELECT LIST
		qb.select([
			'l.id',
			'l.title',
			'l.description',
			'l.url',
			'l.category',
			'l.branches',
			'l.status',
			'l.verified',
			'l.verifiedAt',
			'l.totalViews',
			'l.views30d',
			'l.popularScore',
			'l.isOfficial',
			'l.updatedAt',
			'l.createdAt',
			'img',
			't.id',
			't.name'
		])

		// 🔍 SEARCH (FTS + trigram)
		if (query.search && query.search.trim() !== '') {
			qb.andWhere(
				`(
					l.search_document @@ plainto_tsquery('english', :q)
					OR similarity(l.title, :q) > 0.15
					OR word_similarity(l.description, :q) > 0.07
					OR similarity(l.tags_text, :q) > 0.15
				)`,
				{ q: query.search }
			)

			qb.addSelect(
				`
					GREATEST(
						ts_rank_cd(l.search_document, plainto_tsquery('english', :q)),
						similarity(l.title, :q),
						word_similarity(l.description, :q),
						similarity(l.tags_text, :q)
					)
				`,
				'relevance'
			)

			qb.orderBy('relevance', 'DESC')
		}

		// СОРТУВАННЯ (лише якщо не search)
		if (!query.search) {
			switch (query.sort) {
				case 'recently_verified':
					qb.orderBy('l.verifiedAt', 'DESC', 'NULLS LAST')
					break

				case 'alphabetical':
					qb.addSelect('LOWER(l.title)', 'title_lower')
					qb.orderBy('title_lower', 'ASC')
					break

				case 'official_first':
					qb.orderBy('l.isOfficial', 'DESC').addOrderBy('l.popularScore', 'DESC')
					break

				case 'most_used':
					qb.orderBy('l.views30d', 'DESC')
					break

				case 'popularity':
					qb.orderBy('l.popularScore', 'DESC')
					break

				default:
					qb.orderBy('l.updatedAt', 'DESC')
					break
			}
		}

		qb.skip(offset).take(limit)

		// COUNT BUILDER
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

		if (query.isFavorite) {
			if (!userId) {
				return [[], 0]
			}

			countQb.innerJoin(UserFavoriteLink, 'ufd', 'ufd.linkId = l.id AND ufd.userId = :userId', { userId })
		}

		if (query.search && query.search.trim() !== '') {
			countQb.andWhere(
				`(
					l.search_document @@ plainto_tsquery('english', :q)
					OR similarity(l.title, :q) > 0.15
					OR word_similarity(l.description, :q) > 0.07
					OR similarity(l.tags_text, :q) > 0.15
				)`,
				{ q: query.search }
			)
		}

		const cnt = await countQb.select('COUNT(DISTINCT l.id)', 'cnt').getRawOne<{ cnt: string }>()

		const items = await qb.getMany()
		const result: [Link[], number] = [items, Number(cnt?.cnt || 0)]

		if (!query.search || query.isFavorite) {
			await this.cacheManager.set(cacheKey, result, 60000)
		}

		return result
	}

	async getOneLink(id: number) {
		const link = await this.linkRepository.findOne({ where: { id }, relations: ['tags'] })

		if (!link) {
			throw new NotFoundException('Link not found.')
		}

		return link
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
