import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'

import { EFileStatus } from '../../../interfaces/EFileStatus'
import { EListingStatus } from '../../../interfaces/EListingStatus'
import { EPackageType } from '../../../interfaces/EPackageType'
import { Listing } from '../entities/Listing.entity'
import { ListingPhoto } from '../entities/ListingPhoto.entity'

@Injectable()
export class ListingSystemService {
	constructor(
		@InjectRepository(Listing)
		private readonly listingRepository: Repository<Listing>,
		@InjectRepository(ListingPhoto)
		private readonly listingPhotoRepository: Repository<ListingPhoto>,
		@Inject(CACHE_MANAGER)
		private readonly cache: Cache
	) {}

	async markViewedOnce(params: { listingId: number; viewerKey: string; ttlMs: number }): Promise<boolean> {
		const { listingId, viewerKey, ttlMs } = params
		const key = `listing:view:${listingId}:${viewerKey}`

		const already = await this.cache.get<string>(key)
		if (already) return false

		await this.cache.set(key, '1', ttlMs)

		return true
	}

	async updateListingPhoto(id: number, data: DeepPartial<ListingPhoto>) {
		return await this.listingPhotoRepository.save({ id, ...data })
	}

	async isImageStatus(id: number, status: EFileStatus) {
		return await this.listingPhotoRepository.exists({ where: { id, status } })
	}

	async updateImageStatus(id: number, status: EFileStatus) {
		await this.listingPhotoRepository.update(id, { status })
	}

	async paymentSucceeded(id: number, listingPackage?: EPackageType, packagePeriod?: number) {
		await this.listingRepository
			.createQueryBuilder()
			.update()
			.set({
				status: EListingStatus.PENDING,
				isExpired: false,
				expiresAt: () => `GREATEST(NOW(), COALESCE("expires_at", NOW())) + (:days * interval '1 day')`,
				publishedAt: () =>
					`CASE 
						WHEN "published_at" IS NULL THEN NOW() 
						ELSE "published_at" 
					END`
			})
			.setParameters({ days: listingPackage === EPackageType.PREMIUM ? packagePeriod : 90 })
			.where('id = :id', { id })
			.execute()
	}
}
