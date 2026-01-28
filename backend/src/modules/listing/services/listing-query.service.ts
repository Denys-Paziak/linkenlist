import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, Repository } from 'typeorm'

import { EContactInboxStatus } from '../../../interfaces/EContactInboxStatus'
import { EListingStatus } from '../../../interfaces/EListingStatus'
import { ERoleName } from '../../../interfaces/ERoleName'
import { ITokenUser } from '../../../interfaces/ITokenUser'
import { ContactInbox } from '../../contact-inbox/entities/ContactInbox.entity'
import { GetAdminAllListingsDto, ListingAdminFilter } from '../dtos/GetAdminAllListings.dto'
import { ESortBy, GetAllListingsDto } from '../dtos/GetAllListings.dto'
import { GetBAHRatesDto } from '../dtos/GetBAHRates.dto'
import { GetMapListingsDto } from '../dtos/GetMapListings.dto'
import { GetOwnerAllListingsDto } from '../dtos/GetOwnerAllListings.dto'
import { BahRate } from '../entities/BAH.entity'
import { Listing } from '../entities/Listing.entity'
import { BahZipMapping } from '../entities/MHA.entity'

@Injectable()
export class ListingQueryService {
	constructor(
		@InjectRepository(Listing)
		private readonly listingRepository: Repository<Listing>,
		@InjectRepository(BahRate)
		private readonly bahRateRepository: Repository<BahRate>,
		@InjectRepository(BahZipMapping)
		private readonly bahZipMappingRepository: Repository<BahZipMapping>,
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
			page = 1,
			neLat,
			neLng,
			swLat,
			swLng
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

		if (!keywords && !neLat && !neLng && !swLat && !swLng) {
			const cached = await this.cacheManager.get(cacheKey)
			if (cached) return cached
		}

		const safePage = Math.max(1, Number(page) || 1)
		const safeLimit = Math.min(Math.max(1, Number(limit) || 16), 100)
		const offset = (safePage - 1) * safeLimit

		const hasKeywords = typeof keywords === 'string' && keywords.trim() !== ''
		const q = hasKeywords ? keywords.trim() : ''

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
			baseQb.setParameter('q', '')
		}

		const hasViewport = Number.isFinite(swLat) && Number.isFinite(swLng) && Number.isFinite(neLat) && Number.isFinite(neLng)

		if (hasViewport) {
			// geography -> geometry, envelope -> geometry
			baseQb.andWhere(
				`l.location IS NOT NULL AND ST_Intersects(
					l.location::geometry,
					ST_MakeEnvelope(:swLng, :swLat, :neLng, :neLat, 4326)
				)`,
				{ swLat, swLng, neLat, neLng }
			)
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

		const orderCase = `CASE ${ids.map((id, i) => `WHEN l.id = ${id} THEN ${i}`).join(' ')} ELSE ${ids.length} END`

		const qb = this.listingRepository
			.createQueryBuilder('l')
			.leftJoinAndSelect('l.photos', 'p')
			.leftJoinAndSelect('l.nearestBase', 'b')
			.where('l.id IN (:...ids)', { ids })
			.orderBy(orderCase, 'ASC')
			.addOrderBy('p.position', 'ASC')
			.addSelect('ST_Y(l.location::geometry)', 'lat')
			.addSelect('ST_X(l.location::geometry)', 'lng')

		const { entities, raw } = await qb.getRawAndEntities()

		const items = entities.map((e, i) => ({
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
			nearestBase: e.nearestBase ?? null,

			lat: raw[i]?.lat != null ? Number(raw[i].lat) : null,
			lng: raw[i]?.lng != null ? Number(raw[i].lng) : null
		}))

		if (!keywords && !neLat && !neLng && !swLat && !swLng) {
			await this.cacheManager.set(cacheKey, [items, total], 60000)
		}

		return [items, total] as const
	}

	async getMapListings(filters: GetMapListingsDto) {
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
			petFriendly,
			garage,
			swLat,
			swLng,
			neLat,
			neLng,
			limit = 2000
		} = filters

		if (swLat >= neLat || swLng >= neLng) {
			throw new BadRequestException('Invalid viewport bounds')
		}

		const hasKeywords = typeof keywords === 'string' && keywords.trim() !== ''
		const q = hasKeywords ? keywords.trim() : ''

		const qb = this.listingRepository.createQueryBuilder('l')

		// 1) active
		qb.andWhere('l.status = :activeStatus', { activeStatus: EListingStatus.ACTIVE })

		// 2) dealType
		if (dealType) {
			if (dealType === 'rent') qb.andWhere('l.forRent = true')
			else qb.andWhere('l.forSale = true')
		}

		// 3) price
		const hasMin = typeof minPrice === 'number' && Number.isFinite(minPrice)
		const hasMax = typeof maxPrice === 'number' && Number.isFinite(maxPrice)
		const invalidRange = hasMin && hasMax && minPrice! > maxPrice!
		if (!invalidRange && (hasMin || hasMax)) {
			const col = dealType === 'rent' ? 'l.monthlyRent' : 'l.listPrice'
			if (hasMin) qb.andWhere(`${col} >= :minPrice`, { minPrice })
			if (hasMax) qb.andWhere(`${col} <= :maxPrice`, { maxPrice })
		}

		// 4) beds/baths
		if (typeof beds === 'number' && beds > 0) {
			qb.andWhere(bedsExact ? 'l.bedrooms = :beds' : 'l.bedrooms >= :beds', { beds })
		}
		if (typeof baths === 'number' && baths > 0) {
			const bathsExpr = '(COALESCE(l.bathroomsFull, 0) + COALESCE(l.bathroomsHalf, 0) * 0.5)'
			qb.andWhere(bathsExact ? `${bathsExpr} = :baths` : `${bathsExpr} >= :baths`, { baths })
		}

		// 5) property types
		if (propertyTypes) {
			qb.andWhere('l.propertyType IN (:...propertyTypes)', {
				propertyTypes: propertyTypes
					.split(',')
					.map(s => s.trim())
					.filter(Boolean)
			})
		}

		// 6) more filters
		if (typeof minSqft === 'number') qb.andWhere('l.interiorSize >= :minSqft', { minSqft })
		if (typeof maxSqft === 'number') qb.andWhere('l.interiorSize <= :maxSqft', { maxSqft })
		if (typeof minYearBuilt === 'number') qb.andWhere('l.yearBuilt >= :minYearBuilt', { minYearBuilt })
		if (typeof maxYearBuilt === 'number') qb.andWhere('l.yearBuilt <= :maxYearBuilt', { maxYearBuilt })
		if (noHoa) qb.andWhere('l.hoaPresent = false')

		if (petFriendly) {
			qb.andWhere(`
				COALESCE(l.petPolicy, '') <> ''
				AND l.petPolicy NOT ILIKE '%no pets%'
			`)
		}

		if (garage) {
			qb.andWhere(`
				COALESCE(l.parkingType, '') <> ''
				AND l.parkingType NOT ILIKE '%none%'
			`)
		}

		// 7) keywords
		if (hasKeywords) {
			qb.andWhere(
				new Brackets(wqb => {
					wqb.where(`l.search_document @@ plainto_tsquery('english', :q)`).orWhere(
						`word_similarity(l.title, :q) > 0.10`
					)
				})
			)
			qb.setParameter('q', q)
		}

		// 8) viewport filter (ключове)
		qb.andWhere(
			`l.location IS NOT NULL AND ST_Intersects(
				l.location::geometry,
				ST_MakeEnvelope(:swLng, :swLat, :neLng, :neLat, 4326)
			)`,
			{ swLat, swLng, neLat, neLng }
		)

		// 9) select мінімум полів + lat/lng
		qb.select([
			'l.id AS "id"',
			'l.slug AS "slug"',
			'l.title AS "title"',
			'l.listPrice AS "listPrice"',
			'l.monthlyRent AS "monthlyRent"',
			'l.forRent AS "forRent"',
			'l.forSale AS "forSale"'
		])
			.addSelect('ST_Y(l.location::geometry)', 'lat')
			.addSelect('ST_X(l.location::geometry)', 'lng')
			.take(Math.min(Math.max(1, Number(limit) || 2000), 5000))

		const rows = await qb.getRawMany<{
			id: number
			slug: string
			title: string
			listPrice: string | null
			monthlyRent: string | null
			forRent: boolean
			forSale: boolean
			lat: string
			lng: string
		}>()

		// 10) нормалізувати типи
		const markers = rows.map(r => ({
			id: Number(r.id),
			slug: r.slug,
			title: r.title,
			listPrice: r.listPrice != null ? Number(r.listPrice) : null,
			monthlyRent: r.monthlyRent != null ? Number(r.monthlyRent) : null,
			forRent: r.forRent,
			forSale: r.forSale,
			lat: Number(r.lat),
			lng: Number(r.lng)
		}))

		return markers
	}

	async getOwnerAllListings(userId: number, query: GetOwnerAllListingsDto) {
		const page = Math.max(1, Number(query.page ?? 1))
		const limit = Math.max(1, Number(query.limit ?? 16))
		const offset = (page - 1) * limit

		const [items, total] = await this.listingRepository.findAndCount({
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

		const activeCount = await this.listingRepository.count({
			where: {
				owner: { id: userId },
				status: EListingStatus.ACTIVE
			}
		})

		return {
			items,
			meta: {
				total,
				activeCount
			}
		}
	}

	async getAdminAllListings(query: GetAdminAllListingsDto) {
		const page = Math.max(1, Number(query.page ?? 1))
		const limit = Math.max(1, Number(query.limit ?? 16))
		const offset = (page - 1) * limit

		const qb = this.listingRepository
			.createQueryBuilder('listing')
			.leftJoinAndSelect('listing.photos', 'photos')
			.leftJoinAndSelect('listing.owner', 'owner')

		if (query.filter === ListingAdminFilter.DRAFT) {
			qb.andWhere('listing.status = :status', { status: EListingStatus.DRAFT })
		}

		if (query.filter === ListingAdminFilter.PENDING) {
			qb.andWhere('listing.status = :status', { status: EListingStatus.PENDING })
		}

		if (query.filter === ListingAdminFilter.EXPIRING) {
			qb.andWhere('listing.isExpired = true')
		}

		if (query.filter === ListingAdminFilter.REPORTED) {
			qb.innerJoinAndSelect('listing.reports', 'reports', 'reports.status != :resolved', {
				resolved: EContactInboxStatus.RESOLVED
			})
		} else {
			qb.leftJoinAndSelect('listing.reports', 'reports', 'reports.status != :resolved', {
				resolved: EContactInboxStatus.RESOLVED
			})
		}

		const [items, total] = await qb
			.skip(offset)
			.take(limit)
			.orderBy('listing.createdAt', 'DESC')
			.select([
				'listing.id',
				'listing.status',
				'listing.listPrice',
				'listing.monthlyRent',
				'listing.premiumFeatures',
				'listing.bedrooms',
				'listing.bathroomsFull',
				'listing.bathroomsHalf',
				'listing.interiorSize',
				'listing.street',
				'listing.unit',
				'listing.zip',
				'listing.state',
				'listing.city',
				'listing.slug',
				'listing.package',
				'listing.title',
				'listing.expiresAt',
				'listing.isExpired',
				'listing.createdAt',
				'listing.totalViews',
				'photos',
				'owner.id',
				'owner.firstName',
				'owner.lastName',
				'reports.id',
				'reports.reportReason'
			])
			.getManyAndCount()

		return [items, total]
	}

	async getAdminListingsCounters() {
		const qb = this.listingRepository.createQueryBuilder('listing')

		const reportedExists = qb
			.subQuery()
			.select('1')
			.from(ContactInbox, 'ci')
			.where('ci.reportListing = listing.id')
			.andWhere('ci.status != :resolved')
			.getQuery()

		const result = await qb
			.select([
				`COUNT(*) AS all`,
				`COUNT(*) FILTER (WHERE listing.status = :draft) AS draft`,
				`COUNT(*) FILTER (WHERE listing.status = :pending) AS pending`,
				`COUNT(*) FILTER (WHERE listing.isExpired = true) AS expiring`,
				`COUNT(*) FILTER (WHERE EXISTS (${reportedExists})) AS reported`
			])
			.setParameters({
				draft: EListingStatus.DRAFT,
				pending: EListingStatus.PENDING,
				resolved: EContactInboxStatus.RESOLVED
			})
			.getRawOne()

		return {
			all: Number(result.all),
			draft: Number(result.draft),
			pending: Number(result.pending),
			expiring: Number(result.expiring),
			reported: Number(result.reported)
		}
	}

	async getOwnerOneListing(user: ITokenUser, listingId: number) {
		const query = this.listingRepository
			.createQueryBuilder('listing')
			.leftJoin('listing.owner', 'owner')
			.addSelect('owner.id')
			.leftJoinAndSelect('listing.photos', 'photo')
			.where('listing.id = :listingId', { listingId })
		if (user.role === ERoleName.USER) {
			query.andWhere('owner.id = :userId', { userId: user.id })
		}

		const listing = query.orderBy('photo.position', 'ASC').getOne()

		if (!listing) throw new NotFoundException('Listing not found.')

		return listing
	}

	async getOneListing(listingSlug: string) {
		const qb = this.listingRepository
			.createQueryBuilder('listing')
			.leftJoinAndSelect('listing.photos', 'photo')
			.leftJoinAndSelect('listing.owner', 'owner')
			.leftJoinAndSelect('owner.avatar', 'avatar')
			.leftJoinAndSelect('listing.nearestBase', 'nearestBase')
			.where('listing.slug = :listingSlug', { listingSlug })
			.andWhere('listing.status = :status', { status: EListingStatus.ACTIVE })
			.loadRelationCountAndMap('owner.forSaleCount', 'owner.listings', 'ol_sale', sub =>
				sub.andWhere('ol_sale.forSale = true').andWhere('ol_sale.status = :activeStatus', {
					activeStatus: EListingStatus.ACTIVE
				})
			)
			.loadRelationCountAndMap('owner.forRentCount', 'owner.listings', 'ol_rent', sub =>
				sub.andWhere('ol_rent.forRent = true').andWhere('ol_rent.status = :activeStatus', {
					activeStatus: EListingStatus.ACTIVE
				})
			)
			.orderBy('photo.position', 'ASC')

		const listing = await qb.getOne()

		if (!listing) throw new NotFoundException('Listing not found.')

		return {
			...listing,
			street: listing.hideStreet ? null : listing.street,
			unit: listing.hideStreet ? null : listing.unit,
			owner: {
				id: listing.owner.id,
				professionalTitle: listing.owner.professionalTitle,
				avatar: listing.owner.avatar,
				createdAt: listing.owner.createdAt,
				listings: {
					forSale: (listing.owner as any).forSaleCount ?? 0,
					forRent: (listing.owner as any).forRentCount ?? 0
				}
			},
			expiresAt: null,
			updatedAt: null
		}
	}

	async getBahRates(dto: GetBAHRatesDto) {
		const year = new Date().getFullYear()

		const raw = String(dto.search ?? '').trim()
		const q = raw.replace(/\s+/g, ' ')
		const qUpper = q.toUpperCase()

		// -------- helpers --------

		const normalizeState = (s: string) => s.trim().toUpperCase()

		const isZipCandidate = (s: string) => /^\d{5}(-\d{4})?$/.test(s.trim())
		const toZip5 = (s: string) => (isZipCandidate(s) ? s.trim().slice(0, 5) : null)

		// MHA коди типу AK400 (2 літери + 3 цифри). Якщо у вас зустрічаються інші формати — розширите regex.
		const isMhaCode = (s: string) => /^[A-Z]{2}\d{3}$/.test(s.trim().toUpperCase())

		function parseSearch(input: string): { zip5?: string; city?: string; state?: string; mhaCode?: string } {
			const cleaned = input.trim()
			if (!cleaned) return {}

			// розіб'ємо по комі або по пробілах (як fallback)
			const parts = cleaned
				.split(',')
				.map(p => p.trim())
				.filter(Boolean)

			// Якщо користувач ввів без ком — пробуємо грубий fallback
			const partsFallback = cleaned
				.split(/\s+/)
				.map(p => p.trim())
				.filter(Boolean)

			const tokens = parts.length ? parts : partsFallback

			let zip5: string | undefined
			let state: string | undefined
			let city: string | undefined
			let mhaCode: string | undefined

			// 1) знайдемо ZIP
			for (const t of tokens) {
				const z = toZip5(t)
				if (z) {
					zip5 = z
					break
				}
			}

			// 2) знайдемо MHA code (може бути введений як перший токен)
			for (const t of tokens) {
				const tt = t.toUpperCase()
				if (isMhaCode(tt)) {
					mhaCode = tt
					break
				}
			}

			// 3) state: якщо є токен з 2 букв (US state code) — беремо його
			for (const t of tokens) {
				const tt = t.trim()
				if (/^[A-Za-z]{2}$/.test(tt)) {
					state = normalizeState(tt)
					break
				}
			}

			// 4) city: якщо є коми — типово "ZIP, City, ST" або "City, ST"
			//    візьмемо перший сегмент, який не ZIP і не state і не mhaCode
			const skipSet = new Set<string>()
			if (zip5) skipSet.add(zip5)
			if (state) skipSet.add(state)
			if (mhaCode) skipSet.add(mhaCode)

			// якщо було з комами, то city зазвичай окремим chunk'ом
			if (parts.length) {
				// candidates: усі chunk-и окрім zip/state/mha
				const candidates = parts.filter(p => {
					const pu = p.toUpperCase()
					const z = toZip5(p)
					if (z) return false
					if (state && pu === state) return false
					if (mhaCode && pu === mhaCode) return false
					return true
				})

				// якщо "39530, Biloxi, MS" -> candidates[0] = Biloxi
				// якщо "Biloxi, MS" -> candidates[0] = Biloxi
				if (candidates.length) city = candidates[0].trim()
			} else {
				// fallback без ком: якщо останній токен state, то решта може бути city
				// приклад: "Biloxi MS" -> city="Biloxi"
				if (state && tokens.length >= 2) {
					const withoutState = tokens.filter(t => normalizeState(t) !== state)
					const withoutZip = withoutState.filter(t => !toZip5(t))
					const withoutMha = withoutZip.filter(t => !isMhaCode(t))
					if (withoutMha.length) city = withoutMha.join(' ').trim()
				}
			}

			return { zip5, city, state, mhaCode }
		}

		const parsed = parseSearch(q)

		// -------- resolve MHA codes --------

		let mhaCodes: string[] = []

		// A) якщо є ZIP — це найточніше
		if (parsed.zip5) {
			const mappings = await this.bahZipMappingRepository.find({
				where: { zip: parsed.zip5 },
				take: 20
			})

			mhaCodes = Array.from(
				new Set(
					mappings
						.map(m =>
							String(m.mhaCode ?? '')
								.toUpperCase()
								.trim()
						)
						.filter(Boolean)
				)
			).slice(0, 10)
		}

		// B) якщо немає ZIP або ZIP не дав результат, але є city/state — шукаємо по місту (та штату якщо є)
		if (mhaCodes.length === 0 && parsed.city) {
			const qb = this.bahZipMappingRepository.createQueryBuilder('m').where('m.city ILIKE :city', {
				city: `%${parsed.city}%`
			})

			if (parsed.state) {
				qb.andWhere('m.state = :state', { state: parsed.state })
			}

			// fallback: mhaName ILIKE по повному search (включно зі штатом), якщо користувач вводить “KETCHIKAN, AK”
			qb.orWhere('m.mhaName ILIKE :mhaName', { mhaName: `%${q}%` })

			const mappings = await qb.limit(50).getMany()

			mhaCodes = Array.from(
				new Set(
					mappings
						.map(m =>
							String(m.mhaCode ?? '')
								.toUpperCase()
								.trim()
						)
						.filter(Boolean)
				)
			).slice(0, 10)
		}

		// C) якщо користувач явно ввів MHA code — беремо його (якщо ще не маємо mhaCodes)
		if (mhaCodes.length === 0 && parsed.mhaCode) {
			mhaCodes = [parsed.mhaCode]
		}

		// D) fallback: пробуємо знайти MHA через bah_rates (exact mha або locationName ILIKE)
		if (mhaCodes.length === 0) {
			const foundMhaCodesFromRates = await this.bahRateRepository
				.createQueryBuilder('r')
				.select('DISTINCT r.mhaCode', 'mhaCode')
				.where('r.year = :year', { year })
				.andWhere('r.paygrade = :paygrade', { paygrade: dto.paygrade })
				.andWhere('(r.mhaCode = :mhaExact OR r.locationName ILIKE :loc)', {
					mhaExact: qUpper,
					loc: `%${q}%`
				})
				.limit(10)
				.getRawMany<{ mhaCode: string }>()

			mhaCodes = foundMhaCodesFromRates.map(x => String(x.mhaCode).toUpperCase().trim()).filter(Boolean)
		}

		if (mhaCodes.length === 0) {
			return {
				search: raw,
				paygrade: dto.paygrade,
				resolved: parsed,
				resolvedMhaCodes: [],
				results: []
			}
		}

		const rates = await this.bahRateRepository
			.createQueryBuilder('r')
			.where('r.year = :year', { year })
			.andWhere('r.paygrade = :paygrade', { paygrade: dto.paygrade })
			.andWhere('r.mhaCode IN (:...mhaCodes)', { mhaCodes })
			.andWhere('r.withDependents IN (:...deps)', { deps: [true, false] })
			.orderBy('r.mhaCode', 'ASC')
			.addOrderBy('r.withDependents', 'DESC')
			.getMany()

		return {
			search: raw,
			paygrade: dto.paygrade,
			resolved: parsed,
			resolvedMhaCodes: mhaCodes,
			results: rates.map(r => ({
				year: r.year,
				mhaCode: r.mhaCode,
				locationName: r.locationName,
				paygrade: r.paygrade,
				withDependents: r.withDependents,
				monthlyAmount: Number(r.monthlyAmount)
			}))
		}
	}
}
