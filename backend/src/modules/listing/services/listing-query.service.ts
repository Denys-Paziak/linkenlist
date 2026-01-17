import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, Repository } from 'typeorm'

import { EListingStatus } from '../../../interfaces/EListingStatus'
import { EDealType, ESortBy, GetAllListingsDto } from '../dtos/GetAllListings.dto'
import { GetOwnerAllListingsDto } from '../dtos/GetOwnerAllListings.dto'
import { Listing } from '../entities/Listing.entity'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'

@Injectable()
export class ListingQueryService {
	constructor(
		@InjectRepository(Listing)
		private readonly listingRepository: Repository<Listing>,
		@Inject(CACHE_MANAGER)
		private readonly cacheManager: Cache
	) {}

	async getAllListings(filters: GetAllListingsDto) {
		const {
			dealType,
			minPrice,
			maxPrice,
			beds,
			baths,
			bedsExact,
			bathsExact,
			propertyTypes,
			keywords,
			minSqft,
			maxSqft,
			minYearBuilt,
			maxYearBuilt,
			noHoa,
			sortBy = ESortBy.RECOMMENDED,
			petFriendly,
			garage,
			limit = 16,
			page = 1
		} = filters

		const cacheKey =
			'listings:list|' +
			`page:${page}|` +
			`limit:${limit}|` +
			`dealType:${dealType ?? ''}|` +
			`minPrice:${minPrice ?? ''}|` +
			`maxPrice:${maxPrice ?? ''}|` +
			`beds:${beds ?? ''}|` +
			`baths:${baths ?? ''}|` +
			`bedsExact:${bedsExact ?? false}|` +
			`bathsExact:${bathsExact ?? false}|` +
			`propertyTypes:${propertyTypes ?? ''}|` +
			`minSqft:${minSqft ?? ''}|` +
			`maxSqft:${maxSqft ?? ''}|` +
			`minYearBuilt:${minYearBuilt ?? ''}|` +
			`maxYearBuilt:${maxYearBuilt ?? ''}|` +
			`noHoa:${noHoa ?? false}|` +
			`petFriendly:${petFriendly ?? false}|` +
			`garage:${garage ?? false}`

		if (!keywords) {
			const cached = await this.cacheManager.get(cacheKey)
			if (cached) return cached
		}

		const safePage = Math.max(1, Number(page) || 1)
		const safeLimit = Math.min(Math.max(1, Number(limit) || 16), 100)
		const offset = (safePage - 1) * safeLimit

		const hasKeywords = typeof keywords === 'string' && keywords.trim() !== ''
		const q = hasKeywords ? keywords.trim() : ''

		/**
		 * Base QB (тільки listings) — без join photos/base, щоб:
		 * - не було дублікатів
		 * - не було DISTINCT по json (b_location)
		 */
		const baseQb = this.listingRepository.createQueryBuilder('l')

		// 1) Active + dealType
		baseQb.andWhere('l.status = :activeStatus', { activeStatus: EListingStatus.ACTIVE })

		if (dealType) {
			if (dealType === 'rent') baseQb.andWhere('l.forRent = true')
			else baseQb.andWhere('l.forSale = true')
		}

		// 2) Price
		const hasMin = typeof minPrice === 'number' && Number.isFinite(minPrice)
		const hasMax = typeof maxPrice === 'number' && Number.isFinite(maxPrice)
		const invalidRange = hasMin && hasMax && minPrice! > maxPrice!
		if (!invalidRange && (hasMin || hasMax)) {
			const col = dealType === 'rent' ? 'l.monthlyRent' : 'l.listPrice'
			if (hasMin) baseQb.andWhere(`${col} >= :minPrice`, { minPrice })
			if (hasMax) baseQb.andWhere(`${col} <= :maxPrice`, { maxPrice })
		}

		// 3) Beds & Baths
		if (typeof beds === 'number' && beds > 0) {
			baseQb.andWhere(bedsExact ? 'l.bedrooms = :beds' : 'l.bedrooms >= :beds', { beds })
		}

		if (typeof baths === 'number' && baths > 0) {
			const bathsExpr = '(COALESCE(l.bathroomsFull, 0) + COALESCE(l.bathroomsHalf, 0) * 0.5)'
			baseQb.andWhere(bathsExact ? `${bathsExpr} = :baths` : `${bathsExpr} >= :baths`, { baths })
		}

		// 4) Property types
		if (propertyTypes) {
			baseQb.andWhere('l.propertyType IN (:...propertyTypes)', {
				propertyTypes: propertyTypes
					.split(',')
					.map(s => s.trim())
					.filter(Boolean)
			})
		}

		// 5) More filters
		if (typeof minSqft === 'number') baseQb.andWhere('l.interiorSize >= :minSqft', { minSqft })
		if (typeof maxSqft === 'number') baseQb.andWhere('l.interiorSize <= :maxSqft', { maxSqft })

		if (typeof minYearBuilt === 'number') baseQb.andWhere('l.yearBuilt >= :minYearBuilt', { minYearBuilt })
		if (typeof maxYearBuilt === 'number') baseQb.andWhere('l.yearBuilt <= :maxYearBuilt', { maxYearBuilt })

		if (noHoa) baseQb.andWhere('l.hoaPresent = false')

		if (petFriendly) {
			baseQb.andWhere(`
				COALESCE(l.petPolicy, '') <> ''
				AND l.petPolicy NOT ILIKE '%no pets%'
			`)
		}

		if (garage) {
			baseQb.andWhere(`
				COALESCE(l.parkingType, '') <> ''
				AND l.parkingType NOT ILIKE '%none%'
			`)
		}

		// 6) Keywords
		const relevanceExpr = hasKeywords
			? `
				GREATEST(
					ts_rank_cd(l.search_document, plainto_tsquery('english', :q)),
					word_similarity(l.title, :q)
				)
			`
			: `0`

		if (hasKeywords) {
			baseQb.andWhere(
				new Brackets(wqb => {
					wqb.where(`l.search_document @@ plainto_tsquery('english', :q)`).orWhere(
						`word_similarity(l.title, :q) > 0.10`
					)
				})
			)
			baseQb.setParameter('q', q)
		} else {
			// щоб :q не вимагався ніде
			baseQb.setParameter('q', '')
		}

		/**
		 * Count (окремо, без joins)
		 */
		const total = await baseQb.clone().select('l.id').distinct(true).getCount()

		if (total === 0) return [[], 0] as const

		/**
		 * IDs query:
		 * - select тільки l.id (+ computed score для сортування)
		 * - жодних join photos/base
		 */
		const idsQb = baseQb.clone().select('l.id', 'id').addSelect(relevanceExpr, 'relevance')

		// “has photo” без join
		const hasPhotoExpr = `
			CASE WHEN EXISTS (
				SELECT 1 FROM listing_photos lp
				WHERE lp."listingId" = l.id
				LIMIT 1
			) THEN 1 ELSE 0 END
		`

		if (sortBy === 'most_relevant' && hasKeywords) {
			idsQb.orderBy('relevance', 'DESC').addOrderBy('l.publishedAt', 'DESC', 'NULLS LAST').addOrderBy('l.id', 'ASC')
		} else if (sortBy === 'newest') {
			idsQb.orderBy('l.publishedAt', 'DESC', 'NULLS LAST').addOrderBy('l.id', 'ASC')
		} else if (sortBy === 'oldest') {
			idsQb.orderBy('l.publishedAt', 'ASC', 'NULLS LAST').addOrderBy('l.id', 'ASC')
		} else if (sortBy === 'price_asc' || sortBy === 'price_desc') {
			const dir = sortBy === 'price_asc' ? 'ASC' : 'DESC'
			const col = dealType === 'rent' ? 'l.monthlyRent' : 'l.listPrice'
			idsQb.orderBy(col, dir as any, 'NULLS LAST').addOrderBy('l.id', 'ASC')
		} else {
			// recommended: published + hasPhoto + description + relevance
			const recScoreExpr = `
				(
					CASE WHEN l.publishedAt IS NULL THEN 0 ELSE 1 END
					+ (${hasPhotoExpr})
					+ CASE WHEN COALESCE(l.description,'') <> '' THEN 1 ELSE 0 END
					+ (${relevanceExpr})
				)
			`
			idsQb.addSelect(recScoreExpr, 'rec_score')
			idsQb.orderBy('rec_score', 'DESC').addOrderBy('l.publishedAt', 'DESC', 'NULLS LAST').addOrderBy('l.id', 'ASC')
		}

		idsQb.take(safeLimit).skip(offset)

		const rawIds = await idsQb.getRawMany<{ id: number }>()
		const ids = rawIds.map(r => Number(r.id)).filter(Number.isFinite)

		if (!ids.length) return [[], total] as const

		/**
		 * Entities query:
		 * - тягнемо повні дані з joins
		 * - порядок відновлюємо через CASE WHEN (бо IN не гарантує порядок)
		 */
		const orderCase = `CASE ${ids.map((id, i) => `WHEN l.id = ${id} THEN ${i}`).join(' ')} ELSE ${ids.length} END`

		const entities = await this.listingRepository
			.createQueryBuilder('l')
			.leftJoinAndSelect('l.photos', 'p')
			.leftJoinAndSelect('l.nearestBase', 'b')
			.where('l.id IN (:...ids)', { ids })
			.orderBy(orderCase, 'ASC')
			.addOrderBy('p.position', 'ASC')
			.getMany()

		const items = entities.map(e => ({
			id: e.id,
			status: e.status,
			listPrice: e.listPrice ?? null,
			monthlyRent: e.monthlyRent ?? null,
			premiumFeatures: e.premiumFeatures ?? null,
			bedrooms: e.bedrooms ?? null,
			bathroomsFull: e.bathroomsFull ?? null,
			bathroomsHalf: e.bathroomsHalf ?? null,
			interiorSize: e.interiorSize ?? null,
			street: e.hideStreet ? null : (e.street ?? null),
			unit: e.hideStreet ? null : (e.unit ?? null),
			zip: e.zip ?? null,
			state: e.state ?? null,
			city: e.city ?? null,
			slug: e.slug,
			title: e.title ?? null,
			photos: e.photos ?? [],
			nearestBase: e.nearestBase ?? null
		}))

		if (!keywords) {
			await this.cacheManager.set(cacheKey, [items, total], 60000)
		}

		return [items, total] as const
	}

	async getOwnerAllListings(userId: number, query: GetOwnerAllListingsDto) {
		const page = Math.max(1, Number(query.page ?? 1))
		const limit = Math.max(1, Number(query.limit ?? 16))
		const offset = (page - 1) * limit

		return await this.listingRepository.findAndCount({
			where: { owner: { id: userId } },
			relations: ['photos'],
			select: {
				id: true,
				status: true,
				listPrice: true,
				monthlyRent: true,
				premiumFeatures: true,
				bedrooms: true,
				bathroomsFull: true,
				bathroomsHalf: true,
				interiorSize: true,
				street: true,
				unit: true,
				zip: true,
				state: true,
				city: true,
				slug: true,
				package: true,
				title: true,
				expiresAt: true,
				isExpired: true,
				photos: true,
				createdAt: true
			},
			skip: offset,
			take: limit,
			order: {
				createdAt: 'DESC'
			}
		})
	}

	async getOwnerOneListing(userId: number, listingId: number) {
		const listing = await this.listingRepository
			.createQueryBuilder('listing')
			.leftJoinAndSelect('listing.owner', 'owner')
			.leftJoinAndSelect('listing.photos', 'photo')
			.where('listing.id = :listingId', { listingId })
			.andWhere('owner.id = :userId', { userId })
			.orderBy('photo.position', 'ASC')
			.getOne()

		if (!listing) throw new NotFoundException('Listing not found.')

		return listing
	}

	async getOneListing(listingSlug: string) {
		const listing = await this.listingRepository
			.createQueryBuilder('listing')
			.leftJoinAndSelect('listing.photos', 'photo')
			.leftJoinAndSelect('listing.nearestBase', 'nearestBase')
			.where('listing.slug = :listingSlug', { listingSlug })
			.andWhere('listing.status = :status', { status: EListingStatus.ACTIVE })
			.orderBy('photo.position', 'ASC')
			.getOne()

		if (!listing) throw new NotFoundException('Listing not found.')

		return {
			...listing,
			street: listing.hideStreet ? null : listing.street,
			unit: listing.hideStreet ? null : listing.unit,
			expiresAt: null,
			updatedAt: null
		}
	}
}
