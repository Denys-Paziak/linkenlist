import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, IsNull, Repository } from 'typeorm'

import { ECommentStatus } from '../../../interfaces/ECommentStatus'
import { EDailyMetricType } from '../../../interfaces/EDailyMetricType'
import { EDealStatus } from '../../../interfaces/EDealStatus'
import { EResourceStatus } from '../../../interfaces/EResourceStatus'
import { UserFavoriteDeal } from '../../favorite/entities/UserFavorite.entity'
import { GetSimplifiedResourceDto } from '../../resource/dtos/GetSimplifiedResource.dto'
import { GetAllDealsDto } from '../dtos/GetAllDeals.dto'
import { GetAllDealsAdminDto } from '../dtos/GetAllDealsAdmin.dto'
import { Deal } from '../entities/Deal.entity'
import { DealTag } from '../entities/DealTag.entity'

@Injectable()
export class DealQueryService {
	constructor(
		@InjectRepository(Deal)
		private readonly dealRepository: Repository<Deal>,
		@InjectRepository(DealTag)
		private readonly dealTagRepository: Repository<DealTag>,
		@Inject(CACHE_MANAGER)
		private readonly cacheManager: Cache
	) {}

	async getAllDealsAdmin(query: GetAllDealsAdminDto) {
		const page = Math.max(1, Number(query.page ?? 1))
		const limit = Math.max(1, Number(query.limit ?? 16))
		const offset = (page - 1) * limit

		const qb = this.dealRepository
			.createQueryBuilder('d')
			.leftJoinAndSelect('d.image', 'img')
			.select(['d.id', 'd.title', 'd.categories', 'd.status', 'd.lastEdit', 'd.createdAt', 'd.slug', 'd.totalViews', 'img'])
			.distinct(true)
			.skip(offset)
			.take(limit)

		// 🔍 SEARCH (FTS + trigram)
		if (query.search && query.search.trim() !== '') {
			const q = query.search.trim()

			qb.andWhere(
				`(
				d.search_document @@ plainto_tsquery('english', :q)
				OR similarity(d.title, :q) > 0.15
				OR similarity(d.tags_text, :q) > 0.15
			)`,
				{ q }
			)

			qb.addSelect(
				`
				GREATEST(
					ts_rank_cd(d.search_document, plainto_tsquery('english', :q)),
					similarity(d.title, :q),
					similarity(d.tags_text, :q)
				)
			`,
				'relevance'
			)

			qb.orderBy('relevance', 'DESC')
			qb.addOrderBy('d.createdAt', 'DESC')
		} else {
			qb.orderBy('d.createdAt', 'DESC')
		}

		return await qb.getManyAndCount()
	}

	async getAllDeals(query: GetAllDealsDto, userId?: number) {
		const page = Math.max(1, Number(query.page ?? 1))
		const limit = Math.max(16, Number(query.limit ?? 16))
		const offset = (page - 1) * limit

		const cacheKey =
			'deals:list|' +
			`page:${page}|` +
			`limit:${limit}|` +
			`cat:${query.category ?? 'all'}|` +
			`isFeatured:${query.isFeatured ?? false}`

		if (!query.search && !query.isFavorite) {
			const cached = await this.cacheManager.get<[Deal[], number]>(cacheKey)
			if (cached) return cached
		}

		const qb = this.dealRepository
			.createQueryBuilder('l')
			.leftJoinAndSelect('l.image', 'img')
			.leftJoinAndSelect('l.tags', 't')
			.where('l.status = :status', { status: EDealStatus.PUBLISHED })
			.loadRelationCountAndMap('l.commentsCount', 'l.comments', 'c', subQb =>
				subQb.andWhere('c.status = :cs', { cs: ECommentStatus.APPROVED })
			)

		// CATEGORY
		if (query.category) {
			qb.andWhere(':category = ANY(l.categories)', { category: query.category })
		}

		// IS FEATURED
		if (query.isFeatured) {
			qb.andWhere('l.isFeatured = :isFeatured', { isFeatured: true })
		}

		// FAVORITES FILTER
		if (query.isFavorite) {
			if (!userId) {
				return [[], 0]
			}

			qb.innerJoin(UserFavoriteDeal, 'ufd', 'ufd.dealId = l.id AND ufd.userId = :userId', { userId })
		}

		// SELECT LIST
		qb.select([
			'l.id',
			'l.title',
			'l.slug',
			'l.teaser',
			'l.categories',
			'l.status',
			'l.popularScore',
			'l.totalHelpful',
			'l.outboundUrl',
			'l.isFeatured',
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
					OR similarity(l.tags_text, :q) > 0.15
				)`,
				{ q: query.search }
			)

			qb.addSelect(
				`
					GREATEST(
						ts_rank_cd(l.search_document, plainto_tsquery('english', :q)),
						similarity(l.title, :q),
						similarity(l.tags_text, :q)
					)
				`,
				'relevance'
			)

			qb.orderBy('l.isFeatured', 'DESC')
			qb.addOrderBy('relevance', 'DESC')
		}

		// СОРТУВАННЯ (лише якщо не search)
		if (!query.search) {
			switch (query.sort) {
				case 'popularity':
					qb.orderBy('l.isFeatured', 'DESC')
					qb.addOrderBy('l.popularScore', 'DESC')
					break
				default:
					qb.orderBy('l.isFeatured', 'DESC')
					qb.addOrderBy('l.createdAt', 'DESC')
					break
			}
		}

		qb.skip(offset).take(limit)

		// COUNT BUILDER
		const countQb = this.dealRepository
			.createQueryBuilder('l')
			.leftJoin('l.tags', 't')
			.where('l.status = :status', { status: EDealStatus.PUBLISHED })

		if (query.category) {
			countQb.andWhere(':category = ANY(l.categories)', { category: query.category })
		}

		if (query.isFeatured) {
			countQb.andWhere('l.isFeatured = :isFeatured', { isFeatured: true })
		}

		if (query.isFavorite) {
			if (!userId) {
				return [[], 0]
			}

			countQb.innerJoin(UserFavoriteDeal, 'ufd', 'ufd.dealId = l.id AND ufd.userId = :userId', { userId })
		}

		if (query.search && query.search.trim() !== '') {
			countQb.andWhere(
				`(
					l.search_document @@ plainto_tsquery('english', :q)
					OR similarity(l.title, :q) > 0.15
					OR similarity(l.tags_text, :q) > 0.15
				)`,
				{ q: query.search }
			)
		}

		const cnt = await countQb.select('COUNT(DISTINCT l.id)', 'cnt').getRawOne<{ cnt: string }>()

		const items = await qb.getMany()
		const result: [Deal[], number] = [items, Number(cnt?.cnt || 0)]

		if (!query.search && !query.isFavorite) {
			await this.cacheManager.set(cacheKey, result, 60000)
		}

		return result
	}

	async getSimplifiedDeals(query: GetSimplifiedResourceDto) {
		const where: any = {
			status: EDealStatus.PUBLISHED
		}

		if (query?.search) {
			where.title = ILike(`%${query.search}%`)
		}

		return this.dealRepository.find({
			where,
			relations: ['featuredResource'],
			select: {
				id: true,
				title: true,
				slug: true,
				status: true,
				createdAt: true,
				featuredResource: { id: true }
			},
			skip: (query.page - 1) * query.limit,
			take: query.limit,
			order: { createdAt: 'DESC' }
		})
	}

	async getAllDealTags() {
		return await this.dealTagRepository
			.createQueryBuilder('tag')
			.leftJoin('deal_tags_join', 'ltj', 'ltj."dealTagsId" = tag.id')
			.leftJoin(Deal, 'deal', 'deal.id = ltj."dealsId"')
			.select(['tag.id AS id', 'tag.name AS name'])
			.addSelect('COUNT(DISTINCT deal.id)', 'count')
			.groupBy('tag.id')
			.addGroupBy('tag.name')
			.orderBy('count', 'DESC')
			.getRawMany<{ id: number; name: string; count: string }>()
	}

	async getOneDealAdmin(dealId: number) {
		const deal = await this.dealRepository
			.createQueryBuilder('deal')
			.leftJoinAndSelect('deal.image', 'image')
			.leftJoinAndSelect('deal.ogImage', 'ogImage')
			.leftJoinAndSelect('deal.featuredResource', 'featuredResource')

			.leftJoinAndSelect('deal.tags', 'tag')

			.leftJoinAndSelect('deal.sections', 'section')
			.leftJoinAndSelect('section.attachments', 'sectionAttachment')
			.leftJoinAndSelect('section.images', 'sectionImages')

			.leftJoinAndSelect('deal.relatedManual', 'related')
			.leftJoinAndSelect('related.target', 'relatedTarget')

			.where('deal.id = :id', { id: dealId })
			.orderBy('section.position', 'ASC')
			.getOne()

		if (!deal) {
			throw new NotFoundException('Deal not found.')
		}

		return deal
	}

	async getOneDeal(dealSlug: string) {
		const qb = this.dealRepository
			.createQueryBuilder('deal')
			.leftJoinAndSelect('deal.image', 'image')
			.leftJoinAndSelect('deal.ogImage', 'ogImage')

			.leftJoinAndSelect('deal.featuredResource', 'featuredResource', 'featuredResource.status = :publishedResource', {
				publishedResource: EResourceStatus.PUBLISHED
			})
			.loadRelationCountAndMap('featuredResource.commentsCount', 'featuredResource.comments', 'c', subQb =>
				subQb.andWhere('c.status = :cs', { cs: ECommentStatus.APPROVED })
			)
			.leftJoinAndSelect('featuredResource.tags', 'featuredTag')
			.leftJoinAndSelect('featuredResource.image', 'featuredImage')

			.leftJoinAndSelect('deal.tags', 'tag')
			.leftJoinAndSelect('deal.sections', 'section', 'section.enabled = :enabled', { enabled: true })
			.leftJoinAndSelect('section.attachments', 'sectionAttachment')

			.where('deal.slug = :slug', { slug: dealSlug })
			.orderBy('section.position', 'ASC')

		const baseDeal = await qb.getOne()

		if (!baseDeal) {
			throw new NotFoundException('Deal not found.')
		}

		if (baseDeal.relatedAutoMode === true) {
			qb.leftJoinAndSelect('deal.relatedManual', 'related')
				.leftJoinAndSelect('related.target', 'relatedTarget', 'relatedTarget.status = :publishedDeal', {
					publishedDeal: EDealStatus.PUBLISHED
				})
				.leftJoinAndSelect('relatedTarget.tags', 'relatedTag')
				.leftJoinAndSelect('relatedTarget.image', 'relatedImage')

			const dealWithRelated = await qb.getOne()

			if (!dealWithRelated) {
				throw new NotFoundException('Deal not found.')
			}

			if (dealWithRelated.relatedManual?.length) {
				dealWithRelated.relatedManual = dealWithRelated.relatedManual.filter(r => r.target)
			}

			return dealWithRelated
		}

		return baseDeal
	}

	async getDealHelpful(dealId: number): Promise<number[]> {
		const raw = await this.dealRepository.manager
			.createQueryBuilder()
			.select('ARRAY_AGG(dm.user_id)', 'helpful')
			.from('daily_metrics', 'dm')
			.where('dm.entity_id = :dealId', { dealId })
			.andWhere('dm.metric_type = :helpfulType', {
				helpfulType: EDailyMetricType.DEAL_HELPFUL
			})
			.andWhere('dm.user_id IS NOT NULL')
			.getRawOne<{ helpful: (number | null)[] | null }>()

		const helpfulArray = raw?.helpful ?? []
		return (helpfulArray || []).filter((id): id is number => id !== null)
	}
}
