import { HttpService } from '@nestjs/axios'
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { parse } from 'csv-parse/sync'
import { firstValueFrom } from 'rxjs'
import { DataSource, In, IsNull, Not, Repository } from 'typeorm'

import { EFileStatus } from '../../../interfaces/EFileStatus'
import { EListingStatus } from '../../../interfaces/EListingStatus'
import { EPackageType } from '../../../interfaces/EPackageType'
import { ERoleName } from '../../../interfaces/ERoleName'
import { IMultipartFile } from '../../../interfaces/IMultipartFile'
import { ITokenUser } from '../../../interfaces/ITokenUser'
import { IUploadedImage } from '../../../interfaces/IUploadedFile'
import { formatLocalDateYYYYMMDD } from '../../../utils/format-local-date-YYYYMMDD'
import { generateRandomSuffix } from '../../../utils/generate-random-suffix.util'
import { generateSlug } from '../../../utils/slug.util'
import { ImageQueueService } from '../../image-queue/image-queue.service'
import { MailService } from '../../mail/mail.service'
import { NotificationSystemService } from '../../notification/services/notification-system.service'
import { S3StorageService } from '../../s3-storage/s3-storage.service'
import { ScheduleQueueService } from '../../schedule-queue/schedule-queue.service'
import { StripeSystemService } from '../../stripe/services/stripe-system.service'
import { User } from '../../user/entities/User.entity'
import { BulkAdjustExpirationDto } from '../dtos/BulkAdjustExpiration.dto'
import { BulkApproveDto } from '../dtos/BulkApprove.dto'
import { BulkRejectDto } from '../dtos/BulkReject.dto'
import { ExtendListingExpirationDto } from '../dtos/ExtendListingExpiration.dto'
import { InitListingDto } from '../dtos/InitListing.dto'
import { InitListingAdminDto } from '../dtos/InitListingAdmin.dto'
import { SaveListingDto } from '../dtos/SaveListing.dto'
import { BahRate } from '../entities/BAH.entity'
import { Listing } from '../entities/Listing.entity'
import { ListingPhoto } from '../entities/ListingPhoto.entity'
import { BahZipMapping } from '../entities/MHA.entity'
import { chunk, isObject, PAYGRADE_MAP, toMoneyString, toYear } from '../utils/import-bah'

type GoogleGeocodeResponse = {
	status: string
	results: Array<{
		formatted_address: string
		place_id: string
		geometry: {
			location: { lat: number; lng: number }
			location_type: string
		}
	}>
}

@Injectable()
export class ListingCommandService {
	constructor(
		@InjectRepository(Listing)
		private readonly listingRepository: Repository<Listing>,
		private readonly s3StorageService: S3StorageService,
		private readonly imageQueueService: ImageQueueService,
		private readonly stripeSystemService: StripeSystemService,
		private readonly scheduleQueueService: ScheduleQueueService,
		private readonly dataSource: DataSource,
		private readonly notificationSystemService: NotificationSystemService,
		private readonly configService: ConfigService,
		private readonly http: HttpService,
		private readonly mailService: MailService
	) {}

	private async saveImage(file: IMultipartFile, listingId: number): Promise<IUploadedImage> {
		const { url, key } = await this.s3StorageService.uploadPublic(file.buffer, file.mimetype, false, {
			filename: file.filename,
			path: 'listing/photos/' + listingId
		})
		return { key, url, width: file.width, height: file.height }
	}

	private async bulkUpdateListingPhotos(repo: Repository<ListingPhoto>, updates: SaveListingDto['photos'], listingId: number) {
		if (!updates || !updates.length) return

		const ids = updates.map(u => u.id)

		const positionCase = `
			CASE id
			${updates.map((u, i) => `WHEN :id_pos_${i} THEN :pos_${i}`).join('\n')}
			ELSE position
			END
		`

		const captionCase = `
			CASE id
			${updates.map((u, i) => `WHEN :id_cap_${i} THEN :cap_${i}`).join('\n')}
			ELSE caption
			END
		`

		const params: Record<string, any> = { ids }

		updates.forEach((u, i) => {
			if (typeof u.position === 'number') {
				params[`id_pos_${i}`] = u.id
				params[`pos_${i}`] = u.position
			}
			if (u.caption !== undefined) {
				params[`id_cap_${i}`] = u.id
				params[`cap_${i}`] = u.caption
			}
		})

		await repo
			.createQueryBuilder()
			.update(ListingPhoto)
			.set({
				position: () => positionCase,
				caption: () => captionCase
			})
			.where('id IN (:...ids)', { ids })
			.andWhere('listingId = :listingId', { listingId })
			.setParameters(params)
			.execute()
	}

	private async generateSlugUnique(id: number, address: string) {
		let slug = generateSlug(address)
		const exists = await this.listingRepository.exists({ where: { slug, id: Not(id) } })
		if (exists) slug = `${slug}-${generateRandomSuffix()}`
		return slug
	}

	private renderAddress(data: { unit?: string; street: string; city: string; state: string; zip: string }) {
		if (data.unit) {
			return data.unit + ' ' + data.street + ', ' + data.city + ', ' + data.state + ' ' + data.zip
		}

		return data.street + ', ' + data.city + ', ' + data.state + ' ' + data.zip
	}

	private checkRequiredFields(listing: Listing) {
		const errorFields: string[] = []

		if (!listing.firstName) errorFields.push('firstName')
		if (!listing.lastName) errorFields.push('lastName')
		if (!listing.email) errorFields.push('email')
		if (!listing.street) errorFields.push('street')
		if (!listing.zip) errorFields.push('zip')
		if (!listing.state) errorFields.push('state')
		if (!listing.city) errorFields.push('city')
		if (!listing.propertyType) errorFields.push('propertyType')
		if (!listing.bedrooms === null) errorFields.push('bedrooms')
		if (!listing.bathroomsFull === null) errorFields.push('bathroomsFull')
		if (listing.bathroomsHalf === null) errorFields.push('bathroomsHalf')
		if (!listing.interiorSize === null) errorFields.push('interiorSize')
		if (!listing.forSale && !listing.forRent) {
			errorFields.push('forSale')
			errorFields.push('forRent')
		}
		if (listing.forSale) {
			if (!listing.listPrice === null) errorFields.push('listPrice')
		}
		if (listing.forRent) {
			if (!listing.monthlyRent === null) errorFields.push('monthlyRent')
			if (!listing.leaseTerm) errorFields.push('leaseTerm')
		}

		if (listing.hoaPresent) {
			if (!listing.hoaFee === null) errorFields.push('hoaFee')
			if (!listing.hoaFrequency) errorFields.push('hoaFrequency')
		}

		return errorFields
	}

	private async geocoding({
		unit,
		street,
		city,
		state,
		zip
	}: {
		unit?: string
		street?: string
		city?: string
		state?: string
		zip?: string
	}) {
		const address = `${unit || ''} ${street || ''}, ${city || ''}, ${state || ''} ${zip || ''}, USA`
		const key = this.configService.getOrThrow('GOOGLE_GEOCODING_API_KEY')

		const url = 'https://maps.googleapis.com/maps/api/geocode/json'

		const res = await firstValueFrom(
			this.http.get<GoogleGeocodeResponse>(url, {
				params: {
					address,
					key,
					region: 'us',
					components: 'country:US'
				},
				timeout: 8000
			})
		)

		const data = res.data

		if (data.status !== 'OK' || !data.results?.length) {
			throw new BadRequestException({
				message: 'Unable to find the address.',
				status: data.status,
				address
			})
		}

		const best = data.results[0]
		const { lat, lng } = best.geometry.location
		// const locationType = best.geometry.location_type

		// if (locationType !== 'ROOFTOP') {
		// 	throw new BadRequestException({ message: 'Address is not precise enough', locationType })
		// }

		return { lat, lng }
	}

	private async checkDublicate(lat: number, lng: number) {
		const exists = await this.listingRepository
			.createQueryBuilder('e')
			.select('1')
			.where(
				`e.location IS NOT NULL AND ST_DWithin(
					e.location,
					ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
					:eps
				)`,
				{ lng, lat, eps: 3 }
			)
			.limit(1)
			.getRawOne()

		return !!exists
	}

	async initListing(userId: number, dto: InitListingDto) {
		let slug: string | undefined
		let title: string | undefined

		if (dto.location) {
			title = this.renderAddress({
				city: dto.location.city,
				state: dto.location.state,
				street: dto.location.street,
				unit: dto.location.unit,
				zip: dto.location.zip
			})
		}

		if (title) {
			slug = await this.generateSlugUnique(-1, title)
		}

		let location: { lat: number; lng: number } | undefined = undefined
		let isPotentialDuplicate: boolean | undefined = undefined
		if (dto.location) {
			location = await this.geocoding({
				city: dto.location.city || undefined,
				state: dto.location.state || undefined,
				street: dto.location.street || undefined,
				unit: dto.location.unit || undefined,
				zip: dto.location.zip || undefined
			})

			isPotentialDuplicate = await this.checkDublicate(location?.lat, location?.lng)
		}

		return await this.dataSource.transaction(async manager => {
			const userRepo = manager.getRepository(User)
			const listingRepo = manager.getRepository(Listing)

			const user = await userRepo.findOne({
				where: { id: userId },
				select: ['id', 'freeListingCredit', 'firstName', 'lastName', 'company', 'phone', 'publicEmail'],
				lock: { mode: 'pessimistic_write' }
			})

			if (!user) {
				throw new NotFoundException('No such user found')
			}

			if (user.freeListingCredit <= 0 && dto.package === EPackageType.BASIC) {
				throw new BadRequestException('No free listing credits')
			}

			const dateAvailable = dto.pricing?.dateAvailable
			const listing = await listingRepo.save({
				owner: { id: userId },
				package: dto.package,
				slug,
				...dto.amenities,
				...dto.listingDetails,
				...dto.location,
				...dto.pricing,
				...dto.property,
				...dto.seller,
				title,
				dateAvailable: !dateAvailable ? dateAvailable : formatLocalDateYYYYMMDD(dateAvailable),
				location: location
					? {
							type: 'Point',
							coordinates: [location.lng, location.lat]
						}
					: undefined,
				isPotentialDuplicate
			})

			const errorFields = this.checkRequiredFields(listing)
			if (errorFields.length) {
				throw new BadRequestException('Missing fields:' + errorFields.join(','))
			}

			if (dto.package === EPackageType.BASIC) {
				await userRepo.decrement({ id: userId }, 'freeListingCredit', 1)

				if (user.freeListingCredit === 1) {
					const runAt = new Date()
					runAt.setFullYear(runAt.getFullYear() + 1)

					await this.scheduleQueueService.userFreeListingCredit({
						entityId: user.id,
						runAt
					})
				}
			}

			return listing.id
		})
	}

	async initListingAdmin(dto: InitListingAdminDto) {
		let slug: string | undefined
		let title: string | undefined

		if (dto.location) {
			title = this.renderAddress({
				city: dto.location.city,
				state: dto.location.state,
				street: dto.location.street,
				unit: dto.location.unit,
				zip: dto.location.zip
			})
		}

		if (title) {
			slug = await this.generateSlugUnique(-1, title)
		}

		let location: { lat: number; lng: number } | undefined = undefined
		let isPotentialDuplicate: boolean | undefined = undefined
		if (dto.location) {
			location = await this.geocoding({
				city: dto.location.city || undefined,
				state: dto.location.state || undefined,
				street: dto.location.street || undefined,
				unit: dto.location.unit || undefined,
				zip: dto.location.zip || undefined
			})

			isPotentialDuplicate = await this.checkDublicate(location?.lat, location?.lng)
		}

		return await this.dataSource.transaction(async manager => {
			const userRepo = manager.getRepository(User)
			const listingRepo = manager.getRepository(Listing)

			const user = await userRepo.findOne({
				where: { username: dto.username },
				select: { id: true }
			})

			if (!user) {
				throw new NotFoundException('This user does not exist.')
			}

			const dateAvailable = dto.pricing?.dateAvailable
			const listing = await listingRepo.save({
				owner: { id: user.id },
				package: dto.package,
				slug,
				...dto.amenities,
				...dto.listingDetails,
				...dto.location,
				...dto.pricing,
				...dto.property,
				...dto.seller,
				title,
				dateAvailable: !dateAvailable ? dateAvailable : formatLocalDateYYYYMMDD(dateAvailable),
				location: location
					? {
							type: 'Point',
							coordinates: [location.lng, location.lat]
						}
					: undefined,
				isPotentialDuplicate
			})

			const errorFields = this.checkRequiredFields(listing)
			if (errorFields.length) {
				throw new BadRequestException('Missing fields:' + errorFields.join(','))
			}

			return listing.id
		})
	}

	async saveListing(user: ITokenUser, listingId: number, dto: SaveListingDto) {
		const { photos, ...data } = dto

		const deletePhoto: { id: number; originalKey?: string | null; processedKey?: string | null }[] = []

		let slug: string | undefined
		let title: string | undefined

		if (dto.location) {
			title = this.renderAddress({
				city: dto.location.city,
				state: dto.location.state,
				street: dto.location.street,
				unit: dto.location.unit,
				zip: dto.location.zip
			})
		}

		if (title) {
			slug = await this.generateSlugUnique(listingId, title)
		}

		let location: { lat: number; lng: number } | undefined = undefined
		let isPotentialDuplicate: boolean | undefined = undefined
		if (dto.location) {
			location = await this.geocoding({
				city: dto.location.city || undefined,
				state: dto.location.state || undefined,
				street: dto.location.street || undefined,
				unit: dto.location.unit || undefined,
				zip: dto.location.zip || undefined
			})

			isPotentialDuplicate = await this.checkDublicate(location?.lat, location?.lng)
		}

		await this.dataSource.transaction(async manager => {
			const listing = await manager.getRepository(Listing).findOne({
				where: user.role === ERoleName.ADMIN ? { id: listingId } : { id: listingId, owner: { id: user.id } },
				relations: ['photos'],
				select: {
					id: true,
					status: true,
					package: true,
					title: true,
					photos: {
						id: true,
						originalKey: true,
						processedKey: true
					}
				}
			})

			if (!listing) throw new NotFoundException('Listing not found.')

			if (listing.title === title) {
				slug = undefined
			}

			if (photos !== undefined) {
				const remainedIds = photos.map(item => item.id)
				listing.photos.forEach(photo => {
					if (!remainedIds.includes(photo.id)) {
						deletePhoto.push({
							id: photo.id,
							originalKey: photo.originalKey,
							processedKey: photo.processedKey
						})
					}
				})

				if (deletePhoto.length) {
					await manager
						.getRepository(ListingPhoto)
						.createQueryBuilder()
						.delete()
						.from(ListingPhoto)
						.where('id IN (:...ids)', { ids: deletePhoto.map(x => x.id) })
						.andWhere('listingId = :listingId', { listingId })
						.execute()
				}
				await this.bulkUpdateListingPhotos(manager.getRepository(ListingPhoto), photos, listingId)
			}

			let toPending = false
			if (listing.status === EListingStatus.ACTIVE) {
				toPending = Boolean(
					dto.location ||
						dto.property ||
						dto.listingDetails ||
						dto.amenities ||
						dto.outdoorFeatures ||
						dto.indoorFeatures ||
						dto.constructionAndLegalRecords ||
						dto.utilitiesEnergyConnectivity ||
						photos
				)
			}

			const dateAvailable = data.pricing?.dateAvailable
			await manager.getRepository(Listing).save({
				id: listingId,
				slug,
				...data.amenities,
				...data.constructionAndLegalRecords,
				...data.indoorFeatures,
				...data.listingDetails,
				...data.location,
				...data.outdoorFeatures,
				...data.pricing,
				...data.property,
				...data.seller,
				...data.utilitiesEnergyConnectivity,
				status: toPending ? EListingStatus.PENDING : undefined,
				title,
				dateAvailable: !dateAvailable ? dateAvailable : formatLocalDateYYYYMMDD(dateAvailable),
				location: location
					? {
							type: 'Point',
							coordinates: [location.lng, location.lat]
						}
					: undefined,
				isPotentialDuplicate
			})

			const updatedListing = await manager.getRepository(Listing).findOne({
				where: { id: listingId, owner: user.role === ERoleName.ADMIN ? undefined : { id: user.id } },
				relations: ['photos']
			})
			if (!updatedListing) throw new NotFoundException('Listing not found.')

			const errorFields = this.checkRequiredFields(updatedListing)
			if (errorFields.length) {
				throw new BadRequestException('Missing fields:' + errorFields.join(','))
			}
		})

		for (const keys of deletePhoto) {
			try {
				if (keys.originalKey) {
					await this.s3StorageService.delete(keys.originalKey)
				}
				if (keys.processedKey) {
					await this.s3StorageService.delete(keys.processedKey)
				}
			} catch {}
		}
	}

	async uploadImages(user: ITokenUser, listingId: number, files: IMultipartFile[]) {
		if (!files?.length) return []

		const uploadedKeys: string[] = []
		let newAttachments: IUploadedImage[] = []

		try {
			newAttachments = await Promise.all(
				files.map(async file => {
					const a = await this.saveImage(file, listingId)
					if (a?.key) uploadedKeys.push(a.key)
					return a
				})
			)

			const inserted = await this.dataSource.transaction(async manager => {
				const listing = await manager.getRepository(Listing).findOne({
					where: { id: listingId, owner: user.role === ERoleName.ADMIN ? {} : { id: user.id } },
					lock: { mode: 'pessimistic_write' }
				})

				if (!listing) throw new NotFoundException('Listing not found.')
				if (listing.status === EListingStatus.ACTIVE && listing.package === EPackageType.BASIC) {
					throw new BadRequestException('You cannot edit photos in an active listing.')
				}

				const photoRepo = manager.getRepository(ListingPhoto)

				const count = await photoRepo
					.createQueryBuilder('p')
					.select('COUNT(p.id)', 'count')
					.where('p.listingId = :listingId', { listingId })
					.getRawOne<{ count: string }>()

				const existingCount = Number(count?.count || 0)

				const limit = listing.package === EPackageType.PREMIUM ? 40 : 5
				if (existingCount + newAttachments.length > limit) {
					throw new BadRequestException(
						listing.package === EPackageType.PREMIUM
							? 'You can upload no more than 40 photos in the premium package.'
							: 'You can upload no more than 5 photos in the basic package.'
					)
				}

				const maxPos = await photoRepo
					.createQueryBuilder('p')
					.select('COALESCE(MAX(p.position), 0)', 'maxPos')
					.where('p.listingId = :listingId', { listingId })
					.getRawOne<{ maxPos: string }>()

				const basePos = Number(maxPos?.maxPos || 0)

				const insertRes = await photoRepo.insert(
					newAttachments.map((a, i) => ({
						listing: { id: listingId },
						originalKey: a.key,
						width: a.width,
						height: a.height,
						url: a.url,
						position: basePos + i + 1
					}))
				)

				const ids = insertRes.identifiers.map(x => x.id)

				return await photoRepo.find({
					where: { id: In(ids) },
					select: {
						id: true,
						caption: true,
						originalKey: true,
						width: true,
						height: true,
						url: true,
						position: true,
						status: true
					},
					order: { position: 'ASC' }
				})
			})

			if (inserted?.length) {
				await Promise.allSettled(
					inserted
						.filter(i => i.status === EFileStatus.QUEUED)
						.map(i =>
							this.imageQueueService.enqueueListingPhotoProcess({
								entityId: listingId,
								entityFileId: i.id,
								srcKey: i.originalKey || ''
							})
						)
				)
			}

			return inserted.map(item => ({
				id: item.id,
				caption: item.caption,
				width: item.width,
				height: item.height,
				url: item.url,
				position: item.position
			}))
		} catch (err) {
			if (uploadedKeys.length) {
				await Promise.allSettled(uploadedKeys.map(key => this.s3StorageService.delete(key)))
			}

			throw err
		}
	}

	async publish(userId: number, listingId: number) {
		const result = await this.dataSource.transaction(async manager => {
			const listing = await manager
				.getRepository(Listing)
				.createQueryBuilder('listing')
				.leftJoinAndSelect('listing.photos', 'photos')
				.leftJoin('listing.owner', 'owner')
				.where('listing.id = :id', { id: listingId })
				.andWhere('owner.id = :userId', { userId })
				.setLock('pessimistic_write', undefined, ['listing'])
				.getOne()

			if (!listing) throw new NotFoundException('Listing not found.')

			const errorFields = this.checkRequiredFields(listing)
			if (errorFields.length) {
				throw new BadRequestException('Missing fields:' + errorFields.join(','))
			}
			if (listing.status === EListingStatus.ACTIVE || listing.status === EListingStatus.PENDING || listing.isExpired) {
				throw new BadRequestException('Listing is already active or pending approval.')
			}

			if (listing.package === EPackageType.BASIC) {
				await manager
					.getRepository(Listing)
					.update({ id: listingId, owner: { id: userId } }, { status: EListingStatus.PENDING, isExpired: false })
				return { action: 'PENDING' as const }
			}

			if (listing.package === EPackageType.PREMIUM && listing.expiresAt && !listing.isExpired) {
				await manager
					.getRepository(Listing)
					.update({ id: listingId, owner: { id: userId } }, { status: EListingStatus.PENDING, isExpired: false })
				return { action: 'PENDING' as const }
			} else {
				if (listing.package === EPackageType.PREMIUM) {
					return { action: 'CHECKOUT' as const }
				}
			}

			throw new BadRequestException('Unsupported package.')
		})
		if (result.action === 'CHECKOUT') {
			return await this.stripeSystemService.createPaymentCheckout(listingId, 'publish')
		}
	}

	async deleteListing(userId: number, listingId: number) {
		await this.listingRepository.delete({ id: listingId, status: Not(EListingStatus.ACTIVE), owner: { id: userId } })
	}

	async extendListingExpiration(userId: number, listingId: number, dto: ExtendListingExpirationDto) {
		const listing = await this.listingRepository.findOne({
			where: { id: listingId, owner: { id: userId } },
			relations: ['photos']
		})

		if (!listing) throw new NotFoundException('Listing not found.')
		if (listing.status !== EListingStatus.ACTIVE && !listing.isExpired) {
			throw new BadRequestException('Listing cannot be extended in its current state.')
		}

		if (listing.isExpired) {
			const errorFields = this.checkRequiredFields(listing)
			if (errorFields.length) {
				throw new BadRequestException('Missing fields: ' + errorFields.join(','))
			}
		}

		return await this.stripeSystemService.createPaymentCheckout(listingId, 'expiration', dto.priceId)
	}

	async deactivateListing(userId: number, listingId: number) {
		const res = await this.listingRepository.update(
			{ id: listingId, owner: { id: userId }, status: EListingStatus.ACTIVE },
			{ status: EListingStatus.INACTIVE }
		)

		if (!res.affected) {
			throw new BadRequestException('Only active listing can be deactivated.')
		}
	}

	async importBahRatesFromJson(
		file: IMultipartFile,
		opts?: { dryRun?: boolean }
	): Promise<{
		dryRun: boolean
		totalRecordsPrepared: number
		uniqueKey: string
		sample: Array<Pick<BahRate, 'year' | 'mhaCode' | 'locationName' | 'paygrade' | 'withDependents' | 'monthlyAmount'>>
	}> {
		// 1) parse
		let payload: unknown
		try {
			payload = JSON.parse(file.buffer.toString('utf-8'))
		} catch {
			throw new BadRequestException('Uploaded file is not valid JSON')
		}

		if (!isObject(payload)) {
			throw new BadRequestException('JSON payload must be an object with "with" and "without" arrays')
		}

		const withArr = (payload as any).with
		const withoutArr = (payload as any).without

		if (!Array.isArray(withArr) || !Array.isArray(withoutArr)) {
			throw new BadRequestException('JSON payload must contain arrays: "with" and "without"')
		}

		// 2) transform -> flat rows for upsert
		const records: Array<
			Pick<BahRate, 'year' | 'mhaCode' | 'locationName' | 'paygrade' | 'withDependents' | 'monthlyAmount'>
		> = []

		const processRow = (row: unknown, withDependents: boolean, rowIndex: number) => {
			if (!isObject(row)) {
				throw new BadRequestException(`Row #${rowIndex} is not an object`)
			}

			const year = toYear(row.year)
			const mhaCode = String(row.mha ?? '').trim()
			const locationName = String(row.name ?? '').trim()

			if (!mhaCode) throw new BadRequestException(`Row #${rowIndex}: missing "mha"`)
			if (!locationName) throw new BadRequestException(`Row #${rowIndex}: missing "name"`)

			// для кожного paygrade ключа -> створюємо запис
			for (const [key, pg] of Object.entries(PAYGRADE_MAP)) {
				if (!(key in row)) continue // деякі JSON можуть бути “часткові”
				const monthlyAmount = toMoneyString((row as any)[key], `row#${rowIndex} ${mhaCode} ${key}`)

				records.push({
					year,
					mhaCode,
					locationName,
					paygrade: pg,
					withDependents,
					monthlyAmount
				})
			}
		}

		withArr.forEach((r, idx) => processRow(r, true, idx))
		withoutArr.forEach((r, idx) => processRow(r, false, idx))

		if (records.length === 0) {
			throw new BadRequestException('No BAH records found (no recognized paygrade keys)')
		}

		// 3) dry-run
		if (opts?.dryRun) {
			return {
				dryRun: true,
				totalRecordsPrepared: records.length,
				uniqueKey: '(year, mhaCode, paygrade, withDependents)',
				sample: records.slice(0, 10)
			}
		}

		// 4) upsert in transaction (chunked)
		const chunks = chunk(records, 1000)
		await this.dataSource.transaction(async manager => {
			const repo = manager.getRepository(BahRate)

			for (const part of chunks) {
				await repo.upsert(part as any, {
					conflictPaths: ['year', 'mhaCode', 'paygrade', 'withDependents'],
					skipUpdateIfNoValuesChanged: true
				})
			}
		})

		return {
			dryRun: false,
			totalRecordsPrepared: records.length,
			uniqueKey: '(year, mhaCode, paygrade, withDependents)',
			sample: records.slice(0, 10)
		}
	}

	async importBahZipMappingsFromCsv(file: IMultipartFile, opts?: { dryRun?: boolean }) {
		// 1) parse CSV
		let records: any[]
		try {
			records = parse(file.buffer.toString('utf-8'), {
				columns: true,
				skip_empty_lines: true,
				trim: true
			})
		} catch {
			throw new BadRequestException('Invalid CSV file')
		}

		if (!records.length) {
			throw new BadRequestException('CSV file is empty')
		}

		// 2) normalize + validate
		const rows: Array<Partial<BahZipMapping>> = records.map((r, index) => {
			if (!r.zip || !r.mha_code || !r.state || !r.city) {
				throw new BadRequestException(`Invalid row at index ${index}`)
			}

			return {
				zip: String(r.zip).padStart(5, '0'),
				mhaCode: String(r.mha_code).toUpperCase().trim(),
				mhaName: String(r.mha_name ?? r.mha_code).trim(),
				state: String(r.state).toUpperCase().trim(),
				city: String(r.city).trim()
			}
		})

		if (opts?.dryRun) {
			return {
				dryRun: true,
				totalRows: rows.length,
				sample: rows.slice(0, 10)
			}
		}

		// 3) upsert (transaction + chunking)
		const CHUNK_SIZE = 1000

		await this.dataSource.transaction(async manager => {
			const repo = manager.getRepository(BahZipMapping)

			for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
				const chunk = rows.slice(i, i + CHUNK_SIZE)

				await repo.upsert(chunk as any, {
					conflictPaths: ['zip', 'mhaCode'],
					skipUpdateIfNoValuesChanged: true
				})
			}
		})

		return {
			dryRun: false,
			totalRows: rows.length
		}
	}

	async addView(dealId: number) {
		await this.listingRepository.increment({ id: dealId }, 'totalViews', 1)
	}

	async bulkApprove(dto: BulkApproveDto) {
		const data = await this.listingRepository.find({
			where: { id: In(dto.listingsIds), status: EListingStatus.PENDING },
			select: {
				id: true,
				title: true,
				owner: {
					id: true
				}
			},
			relations: ['owner']
		})

		if (data.length !== dto.listingsIds.length) {
			throw new BadRequestException('Only listings with the status “Pending” are approved.')
		}

		await this.listingRepository
			.createQueryBuilder()
			.update()
			.set({
				status: EListingStatus.ACTIVE,
				isExpired: false,
				rejectionMessage: null,
				expiresAt: () => `
					CASE
						WHEN "expires_at" IS NULL
							THEN NOW() + (:days * interval '1 day')
							ELSE "expires_at"
					END
				`,
				publishedAt: () =>
					`CASE 
						WHEN "published_at" IS NULL 
							THEN NOW() 
							ELSE "published_at" 
					END`
			})
			.setParameters({ days: 90 })
			.whereInIds(dto.listingsIds)
			.execute()

		await this.notificationSystemService.createNotifications(
			data?.map(item => ({
				title: 'Your listing has been approved',
				message: `Your listing "${item.title || 'your listing'}" has been approved and is now active on the platform.`,
				senderId: null,
				recipientId: item.owner.id
			}))
		)
	}

	async bulkReject(dto: BulkRejectDto) {
		const listingsIds = dto.listings.map(item => item.id)

		if (listingsIds.length === 0) {
			return
		}

		const messageById = new Map<number, string>(dto.listings.map(x => [x.id, x.message]))

		const data = await this.listingRepository.find({
			where: {
				id: In(listingsIds),
				status: In([EListingStatus.PENDING, EListingStatus.ACTIVE])
			},
			select: {
				id: true,
				title: true,
				firstName: true,
				lastName: true,
				email: true,
				owner: { id: true }
			},
			relations: ['owner']
		})

		if (data.length !== dto.listings.length) {
			throw new BadRequestException('Only listings with the status “Pending” or “Active” are rejected.')
		}

		const cases: string[] = []
		const params: Record<string, any> = {}

		dto.listings.forEach((item, i) => {
			const idKey = `id${i}`
			const msgKey = `msg${i}`

			cases.push(`WHEN "id" = :${idKey} THEN :${msgKey}`)

			params[idKey] = item.id
			params[msgKey] = item.message
		})

		const rejectionMessageSql = `
			CASE
				${cases.join('\n      ')}
				ELSE "rejection_message"
			END
		`

		await this.listingRepository
			.createQueryBuilder()
			.update()
			.set({
				status: EListingStatus.REJECTED,
				rejectionMessage: () => rejectionMessageSql
			})
			.where('id IN (:...ids)', { ids: listingsIds })
			.setParameters(params)
			.execute()

		await this.notificationSystemService.createNotifications(
			data.map(item => {
				const reason = messageById.get(item.id) || 'No additional details provided.'

				return {
					title: 'Your listing was rejected',
					message: `Your listing "${item.title || 'your listing'}" was rejected.\nReason: ${reason}`,
					senderId: null,
					recipientId: item.owner.id
				}
			})
		)

		await Promise.allSettled(
			data.map(async item => {
				const reason = messageById.get(item.id) || 'No additional details provided.'
				if (!item.email) return

				try {
					await this.mailService.sendListingReject(
						item.email,
						item.firstName + ' ' + item.lastName,
						`Your listing "${item.title || 'your listing'}" was rejected.\nReason: ${reason}`
					)
				} catch {}
			})
		)
	}

	async bulkAdjustExpiration(dto: BulkAdjustExpirationDto) {
		const listingsIds = dto.listings.map(item => item.id)

		if (listingsIds.length === 0) {
			return
		}

		const daysById = new Map<number, number>(dto.listings.map(x => [x.id, x.days]))

		const data = await this.listingRepository.find({
			where: {
				id: In(listingsIds),
				expiresAt: Not(IsNull())
			},
			select: {
				id: true,
				title: true,
				owner: { id: true }
			},
			relations: ['owner']
		})

		if (data.length !== dto.listings.length) {
			throw new BadRequestException('Expiration can be adjusted only for listings that already have an expiration date.')
		}

		const cases: string[] = []
		const params: Record<string, any> = {}

		dto.listings.forEach((item, i) => {
			const idKey = `id${i}`
			const daysKey = `days${i}`

			cases.push(`WHEN "id" = :${idKey} THEN (NOW() + (:${daysKey}::int * INTERVAL '1 day'))`)

			params[idKey] = item.id
			params[daysKey] = item.days
		})

		const expiresAtSql = `
			CASE
				${cases.join('\n      ')}
				ELSE "expires_at"
			END
		`

		await this.listingRepository
			.createQueryBuilder()
			.update()
			.set({
				expiresAt: () => expiresAtSql,
				isExpired: false
			})
			.where('id IN (:...ids)', { ids: listingsIds })
			.setParameters(params)
			.execute()

		await this.notificationSystemService.createNotifications(
			data.map(item => {
				const days = daysById.get(item.id) ?? 0

				return {
					title: 'Listing expiration updated',
					message: `Your listing "${item.title || 'your listing'}" has a new expiration term: ${days} day(s) from now.`,
					senderId: null,
					recipientId: item.owner.id
				}
			})
		)
	}
}
