import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, IsNull, Repository } from 'typeorm'

import { ECommentStatus } from '../../../interfaces/ECommentStatus'
import { EDailyMetricType } from '../../../interfaces/EDailyMetricType'
import { EDealStatus } from '../../../interfaces/EDealStatus'
import { EResourceStatus } from '../../../interfaces/EResourceStatus'
import { UserFavoriteResource } from '../../favorite/entities/UserFavorite.entity'
import { GetAllResourcesDto } from '../dtos/GetAllResources.dto'
import { GetAllResourcesAdminDto } from '../dtos/GetAllResourcesAdmin.dto'
import { GetSimplifiedResourceDto } from '../dtos/GetSimplifiedResource.dto'
import { Resource } from '../entities/Resource.entity'
import { ResourceTag } from '../entities/ResourceTag.entity'

@Injectable()
export class ResourceQueryService {
	constructor(
		@InjectRepository(Resource)
		private readonly resourceRepository: Repository<Resource>,
		@InjectRepository(ResourceTag)
		private readonly resourceTagRepository: Repository<ResourceTag>,
		@Inject(CACHE_MANAGER)
		private readonly cacheManager: Cache
	) {}

	async getAllResourcesAdmin(query: GetAllResourcesAdminDto) {
		const page = Math.max(1, Number(query.page ?? 1))
		const limit = Math.max(1, Number(query.limit ?? 16))
		const offset = (page - 1) * limit

		const qb = this.resourceRepository
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
				OR similarity(d.title, :q) > 0.05
				OR similarity(d.tags_text, :q) > 0.05
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

	async getAllResources(query: GetAllResourcesDto, userId?: number) {
		const page = Math.max(1, Number(query.page ?? 1))
		const limit = Math.max(16, Number(query.limit ?? 16))
		const offset = (page - 1) * limit

		const cacheKey =
			'resources:list|' +
			`page:${page}|` +
			`limit:${limit}|` +
			`cat:${query.category ?? 'all'}|` +
			`format:${query.format ?? 'all'}|` +
			`isFeatured:${query.isFeatured ?? false}`

		if (!query.search || query.isFavorite) {
			const cached = await this.cacheManager.get<[Resource[], number]>(cacheKey)
			if (cached) return cached
		}

		const qb = this.resourceRepository
			.createQueryBuilder('l')
			.leftJoinAndSelect('l.image', 'img')
			.leftJoinAndSelect('l.tags', 't')
			.where('l.status = :status', { status: EResourceStatus.PUBLISHED })
			.loadRelationCountAndMap('l.commentsCount', 'l.comments', 'c', subQb =>
				subQb.andWhere('c.status = :cs', { cs: ECommentStatus.APPROVED })
			)

		// CATEGORY
		if (query.category) {
			qb.andWhere(':category = ANY(l.categories)', { category: query.category })
		}

		// FORMAT
		if (query.format) {
			qb.andWhere('l.format = :format', { format: query.format })
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

			qb.innerJoin(UserFavoriteResource, 'ufd', 'ufd.resourceId = l.id AND ufd.userId = :userId', { userId })
		}

		// SELECT LIST
		qb.select([
			'l.id',
			'l.title',
			'l.slug',
			'l.teaser',
			'l.categories',
			'l.format',
			'l.status',
			'l.popularScore',
			'l.totalHelpful',
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
		const countQb = this.resourceRepository
			.createQueryBuilder('l')
			.leftJoin('l.tags', 't')
			.where('l.status = :status', { status: EResourceStatus.PUBLISHED })

		if (query.category) {
			countQb.andWhere(':category = ANY(l.categories)', { category: query.category })
		}

		if (query.format) {
			countQb.andWhere('l.format = :format', { format: query.format })
		}

		if (query.isFeatured) {
			countQb.andWhere('l.isFeatured = :isFeatured', { isFeatured: true })
		}

		if (query.isFavorite) {
			if (!userId) {
				return [[], 0]
			}

			countQb.innerJoin(UserFavoriteResource, 'ufd', 'ufd.resourceId = l.id AND ufd.userId = :userId', { userId })
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
		const result: [Resource[], number] = [items, Number(cnt?.cnt || 0)]

		if (!query.search || query.isFavorite) {
			await this.cacheManager.set(cacheKey, result, 60000)
		}

		return result
	}

	async getSimplifiedResources(query: GetSimplifiedResourceDto) {
		const where: any = {
			status: EResourceStatus.PUBLISHED
		}

		if (query?.search) {
			where.title = ILike(`%${query.search}%`)
		}

		return this.resourceRepository.find({
			where,
			relations: ['featuredDeal'],
			select: {
				id: true,
				title: true,
				slug: true,
				status: true,
				createdAt: true,
				featuredDeal: { id: true }
			},
			skip: (query.page - 1) * query.limit,
			take: query.limit,
			order: { createdAt: 'DESC' }
		})
	}

	async getAllResourceTags() {
		return await this.resourceTagRepository
			.createQueryBuilder('tag')
			.leftJoin('resource_tags_join', 'ltj', 'ltj."resourceTagsId" = tag.id')
			.leftJoin(Resource, 'resource', 'resource.id = ltj."resourcesId"')
			.select(['tag.id AS id', 'tag.name AS name'])
			.addSelect('COUNT(DISTINCT resource.id)', 'count')
			.groupBy('tag.id')
			.addGroupBy('tag.name')
			.orderBy('count', 'DESC')
			.getRawMany<{ id: number; name: string; count: string }>()
	}

	async getOneResourceAdmin(resourceId: number) {
		const resource = await this.resourceRepository
			.createQueryBuilder('resource')
			.leftJoinAndSelect('resource.image', 'image')
			.leftJoinAndSelect('resource.ogImage', 'ogImage')
			.leftJoinAndSelect('resource.featuredDeal', 'featuredDeal')

			.leftJoinAndSelect('resource.tags', 'tag')

			.leftJoinAndSelect('resource.sections', 'section')
			.leftJoinAndSelect('section.attachments', 'sectionAttachment')
			.leftJoinAndSelect('section.images', 'sectionImages')

			.leftJoinAndSelect('resource.relatedManual', 'related')
			.leftJoinAndSelect('related.target', 'relatedTarget')

			.where('resource.id = :id', { id: resourceId })
			.orderBy('section.position', 'ASC')
			.getOne()

		if (!resource) {
			throw new NotFoundException('Resource not found.')
		}

		return resource
	}

	async getOneResource(resourceSlug: string) {
		const qb = this.resourceRepository
			.createQueryBuilder('resource')
			.leftJoinAndSelect('resource.image', 'image')
			.leftJoinAndSelect('resource.ogImage', 'ogImage')

			.leftJoinAndSelect('resource.featuredDeal', 'featuredDeal', 'featuredDeal.status = :publishedDeal', {
				publishedDeal: EDealStatus.PUBLISHED
			})
			.loadRelationCountAndMap('featuredDeal.commentsCount', 'featuredDeal.comments', 'c', subQb =>
				subQb.andWhere('c.status = :cs', { cs: ECommentStatus.APPROVED })
			)
			.leftJoinAndSelect('featuredDeal.tags', 'featuredTag')
			.leftJoinAndSelect('featuredDeal.image', 'featuredImage')

			.leftJoinAndSelect('resource.tags', 'tag')
			.leftJoinAndSelect('resource.sections', 'section', 'section.enabled = :enabled', { enabled: true })
			.leftJoinAndSelect('section.attachments', 'sectionAttachment')

			.where('resource.slug = :slug', { slug: resourceSlug })
			.orderBy('section.position', 'ASC')

		const baseResource = await qb.getOne()

		if (!baseResource) {
			throw new NotFoundException('Resource not found.')
		}

		if (baseResource.relatedAutoMode === true) {
			qb.leftJoinAndSelect('resource.relatedManual', 'related')
				.leftJoinAndSelect('related.target', 'relatedTarget', 'relatedTarget.status = :publishedResource', {
					publishedResource: EResourceStatus.PUBLISHED
				})
				.leftJoinAndSelect('relatedTarget.tags', 'relatedTag')
				.leftJoinAndSelect('relatedTarget.image', 'relatedImage')

			const resourceWithRelated = await qb.getOne()

			if (!resourceWithRelated) {
				throw new NotFoundException('Resource not found.')
			}

			if (resourceWithRelated.relatedManual?.length) {
				resourceWithRelated.relatedManual = resourceWithRelated.relatedManual.filter(r => r.target)
			}

			return resourceWithRelated
		}

		return baseResource
	}

	async getResourceHelpful(resourceId: number) {
		const raw = await this.resourceRepository.manager
			.createQueryBuilder()
			.select('ARRAY_AGG(dm.user_id)', 'helpful')
			.from('daily_metrics', 'dm')
			.where('dm.entity_id = :resourceId', { resourceId })
			.andWhere('dm.metric_type = :helpfulType', {
				helpfulType: EDailyMetricType.RESOURCE_HELPFUL
			})
			.andWhere('dm.user_id IS NOT NULL')
			.getRawOne<{ helpful: (number | null)[] | null }>()

		const helpfulArray = raw?.helpful ?? []
		return (helpfulArray || []).filter((id): id is number => id !== null)
	}
}
