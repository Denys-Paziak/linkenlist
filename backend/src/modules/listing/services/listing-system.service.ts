import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, FindOneOptions, Repository } from 'typeorm'

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
		private readonly listingPhotoRepository: Repository<ListingPhoto>
	) {}

	async updateListingPhoto(id: number, data: DeepPartial<ListingPhoto>) {
		return await this.listingPhotoRepository.save({ id, ...data })
	}

	async isImageStatus(id: number, status: EFileStatus) {
		return await this.listingPhotoRepository.exists({ where: { id, status } })
	}

	async updateImageStatus(id: number, status: EFileStatus) {
		await this.listingPhotoRepository.update(id, { status })
	}

	async updateListingStatus(id: number, status: EListingStatus, listingPackage?: EPackageType) {
		if (status === EListingStatus.ACTIVE) {
			await this.listingRepository
				.createQueryBuilder()
				.update()
				.set({
					status,
					isExpired: false,
					expiresAt: () => `GREATEST(NOW(), COALESCE("expires_at", NOW())) + (:days * interval '1 day')`,
					publishedAt: () =>
						`CASE 
						WHEN "published_at" IS NULL THEN NOW() 
						ELSE "published_at" 
					END`
				})
				.setParameters({ days: listingPackage === EPackageType.PREMIUM ? 180 : 90 })
				.where('id = :id', { id })
				.execute()
		} else {
			await this.listingRepository.update(id, { status })
		}
	}
}
