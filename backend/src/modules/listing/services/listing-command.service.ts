import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { parse } from 'csv-parse/sync'
import { DataSource, In, Not, Repository } from 'typeorm'

import { EFileStatus } from '../../../interfaces/EFileStatus'
import { EListingStatus } from '../../../interfaces/EListingStatus'
import { EPackageType } from '../../../interfaces/EPackageType'
import { IMultipartFile } from '../../../interfaces/IMultipartFile'
import { IUploadedImage } from '../../../interfaces/IUploadedFile'
import { formatLocalDateYYYYMMDD } from '../../../utils/format-local-date-YYYYMMDD'
import { generateRandomSuffix } from '../../../utils/generate-random-suffix.util'
import { generateSlug } from '../../../utils/slug.util'
import { ImageQueueService } from '../../image-queue/image-queue.service'
import { S3StorageService } from '../../s3-storage/s3-storage.service'
import { ScheduleQueueService } from '../../schedule-queue/schedule-queue.service'
import { StripeSystemService } from '../../stripe/services/stripe-system.service'
import { User } from '../../user/entities/User.entity'
import { ExtendListingExpirationDto } from '../dtos/ExtendListingExpiration.dto'
import { InitListingDto } from '../dtos/InitListing.dto'
import { SaveListingDto } from '../dtos/SaveListing.dto'
import { BahRate } from '../entities/BAH.entity'
import { Listing } from '../entities/Listing.entity'
import { ListingPhoto } from '../entities/ListingPhoto.entity'
import { BahZipMapping } from '../entities/MHA.entity'
import { chunk, isObject, PAYGRADE_MAP, toMoneyString, toYear } from '../utils/import-bah'

@Injectable()
export class ListingCommandService {
	constructor(
		@InjectRepository(Listing)
		private readonly listingRepository: Repository<Listing>,
		private readonly s3StorageService: S3StorageService,
		private readonly imageQueueService: ImageQueueService,
		private readonly stripeSystemService: StripeSystemService,
		private readonly scheduleQueueService: ScheduleQueueService,
		@InjectRepository(BahRate)
		private readonly bahRateRepo: Repository<BahRate>,
		private readonly dataSource: DataSource
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

	private async generateSlugUnique(id: number, title: string) {
		let slug = generateSlug(title)
		const exists = await this.listingRepository.exists({ where: { slug, id: Not(id) } })
		if (exists) slug = `${slug}-${generateRandomSuffix()}`
		return slug
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
		if (!listing.bedrooms) errorFields.push('bedrooms')
		if (!listing.bathroomsFull) errorFields.push('bathroomsFull')
		if (!listing.interiorSize) errorFields.push('interiorSize')
		if (!listing.title) errorFields.push('title')
		if (!listing.description) errorFields.push('description')
		if (!listing.forSale && !listing.forRent) {
			errorFields.push('forSale')
			errorFields.push('forRent')
		}
		if (listing.forSale) {
			if (!listing.listPrice) errorFields.push('listPrice')
		}
		if (listing.forRent) {
			if (!listing.monthlyRent) errorFields.push('monthlyRent')
			if (!listing.leaseTerm) errorFields.push('leaseTerm')
		}

		if (!listing.photos.length) errorFields.push('photos')
		if (listing.hoaPresent) {
			if (!listing.hoaFee) errorFields.push('hoaFee')
			if (!listing.hoaFrequency) errorFields.push('hoaFrequency')
		}

		return errorFields
	}

	async initListing(userId: number, dto: InitListingDto) {
		return await this.dataSource.transaction(async manager => {
			const userRepo = manager.getRepository(User)
			const listingRepo = manager.getRepository(Listing)

			const user = await userRepo.findOne({
				where: { id: userId },
				select: { id: true, freeListingCredit: true },
				lock: { mode: 'pessimistic_write' }
			})

			if (!user || user.freeListingCredit <= 0) {
				throw new BadRequestException('No free listing credits')
			}

			const listing = await listingRepo.save({
				owner: { id: userId },
				package: dto.package,
				zip: dto.zip,
				city: dto.city,
				state: dto.state,
				firstName: user.firstName,
				lastName: user.lastName,
				company: user.company,
				primaryPhone: user.phone,
				email: user.publicEmail
			})

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

	async saveListing(userId: number, listingId: number, dto: SaveListingDto) {
		const { photos, ...data } = dto

		const deletePhoto: { id: number; originalKey?: string | null; processedKey?: string | null }[] = []

		let slug: string | undefined

		if (dto.listingDetails?.title) {
			slug = await this.generateSlugUnique(listingId, dto.listingDetails.title)
		}

		await this.dataSource.transaction(async manager => {
			const listing = await manager.getRepository(Listing).findOne({
				where: { id: listingId, owner: { id: userId } },
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

			if (listing.title === dto.listingDetails?.title) {
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

			if (listing.status === EListingStatus.ACTIVE && listing.package === EPackageType.BASIC) {
				if (
					Boolean(
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
				) {
					throw new BadRequestException('Some sections are not available for editing in an active listing.')
				}
			}

			const dateAvailable = data.pricing?.dateAvailable
			await manager.getRepository(Listing).save({
				id: listingId,
				owner: { id: userId },
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
				dateAvailable: !dateAvailable ? dateAvailable : formatLocalDateYYYYMMDD(dateAvailable)
			})

			if (listing.status === EListingStatus.ACTIVE) {
				const updatedListing = await manager.getRepository(Listing).findOne({
					where: { id: listingId, owner: { id: userId } },
					relations: ['photos']
				})
				if (!updatedListing) throw new NotFoundException('Listing not found.')

				const errorFields = this.checkRequiredFields(updatedListing)
				if (errorFields.length) {
					throw new BadRequestException('Missing fields:' + errorFields.join(','))
				}
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

	async uploadImages(userId: number, listingId: number, files: IMultipartFile[]) {
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
					where: { id: listingId, owner: { id: userId } },
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
			const listing = await manager.getRepository(Listing).findOne({
				where: { id: listingId, owner: { id: userId } },
				relations: ['photos'],
				lock: { mode: 'pessimistic_write' }
			})

			if (!listing) throw new NotFoundException('Listing not found.')

			const errorFields = this.checkRequiredFields(listing)
			if (errorFields.length) {
				throw new BadRequestException('Missing fields:' + errorFields.join(','))
			}
			if (listing.status === EListingStatus.ACTIVE || listing.status === EListingStatus.PENDING) {
				throw new BadRequestException('Listing is already active or pending approval.')
			}

			if (listing.package === EPackageType.BASIC) {
				await manager
					.getRepository(Listing)
					.update({ id: listingId, owner: { id: userId } }, { status: EListingStatus.PENDING, isExpired: false })
			}

			if (listing.package === EPackageType.PREMIUM) {
				return { action: 'CHECKOUT' as const }
			}

			throw new BadRequestException('Unsupported package.')
		})
		if (result.action === 'CHECKOUT') {
			return await this.stripeSystemService.createPaymentCheckout(listingId)
		}
	}

	async deleteListing(userId: number, listingId: number) {
		await this.listingRepository.delete({ id: listingId, status: Not(EListingStatus.ACTIVE), owner: { id: userId } })
	}

	async extendListingExpiration(userId: number, listingId: number, dto: ExtendListingExpirationDto) {
		const listing = await this.listingRepository.findOne({
			where: { id: listingId, owner: { id: userId } }
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

		switch (listing.package) {
			case EPackageType.BASIC: {
				if (dto.package === EPackageType.PREMIUM) {
					return await this.stripeSystemService.createPaymentCheckout(listingId)
				}

				await this.extendBasicWithFreeCreditOrActivate(userId, listing.id)
				return
			}

			case EPackageType.PREMIUM: {
				if (dto.package === EPackageType.BASIC) {
					throw new BadRequestException('It is not possible to switch from the Premium to the Basic package.')
				}

				return await this.stripeSystemService.createPaymentCheckout(listingId)
			}

			default:
				return this.assertNever(listing.package as never, 'Unsupported current listing package.')
		}
	}

	private async extendBasicWithFreeCreditOrActivate(userId: number, listingId: number) {
		const afterCommit: (() => Promise<void>)[] = []
		await this.dataSource.transaction(async manager => {
			const userRepo = manager.getRepository(User)
			const lockedUser = await userRepo.findOne({
				where: { id: userId },
				lock: { mode: 'pessimistic_write' }
			})

			if (!lockedUser) throw new NotFoundException('User not found.')
			if (!lockedUser.freeListingCredit || lockedUser.freeListingCredit <= 0) {
				throw new BadRequestException('Your free credits for placing ads have been used up')
			}

			const listingRepo = manager.getRepository(Listing)
			const lockedListing = await listingRepo.findOne({
				where: { id: listingId, owner: { id: userId } },
				lock: { mode: 'pessimistic_write' }
			})
			if (!lockedListing) throw new NotFoundException('Listing not found.')

			const updResLis = await listingRepo
				.createQueryBuilder()
				.update(Listing)
				.set({
					status: () => `
						CASE 
							WHEN status = '${EListingStatus.ACTIVE}' THEN status
							ELSE '${EListingStatus.PENDING}'
						END
					`,
					isExpired: false,
					expiresAt: () => `
						CASE 
							WHEN status = '${EListingStatus.ACTIVE}' THEN GREATEST(NOW(), COALESCE("expires_at", NOW())) + (:days * interval '1 day')
							ELSE "expires_at"
						END
					`
				})
				.setParameters({ days: 90 })
				.where('id = :id', { id: lockedListing.id })
				.andWhere('"owner_id" = :userId', { userId })
				.andWhere(`("status" = :active OR "is_expired" = true)`, { active: EListingStatus.ACTIVE })
				.execute()

			if (!updResLis.affected) {
				throw new BadRequestException('Listing cannot be extended in its current state.')
			}

			const wasLastCredit = lockedUser.freeListingCredit === 1
			const updResDec = await userRepo.decrement({ id: lockedUser.id }, 'freeListingCredit', 1)

			if (!updResDec.affected) {
				throw new InternalServerErrorException('Failed to reduce free credit for placing ads.')
			}

			if (wasLastCredit) {
				afterCommit.push(async () => {
					const runAt = new Date()
					runAt.setFullYear(runAt.getFullYear() + 1)

					await this.scheduleQueueService.userFreeListingCredit({
						entityId: lockedUser.id,
						runAt
					})
				})
			}
		})
		for (const fn of afterCommit) {
			await fn()
		}
	}

	private assertNever(x: never, msg: string): never {
		throw new BadRequestException(msg)
	}

	async deactivateListing(userId: number, listingId: number) {
		const res = await this.listingRepository.update(
			{ id: listingId, owner: { id: userId }, status: In([EListingStatus.ACTIVE, EListingStatus.PENDING]) },
			{ status: EListingStatus.INACTIVE }
		)

		if (!res.affected) {
			throw new BadRequestException('Only active listing or listing awaiting approval can be deactivated.')
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
}
