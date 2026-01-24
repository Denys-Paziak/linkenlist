import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { GetOwnerAllListingsDto } from '../../listing/dtos/GetOwnerAllListings.dto'
import { UserFavoriteDeal, UserFavoriteLink, UserFavoriteListing, UserFavoriteResource } from '../entities/UserFavorite.entity'

@Injectable()
export class FavoriteService {
	constructor(
		@InjectRepository(UserFavoriteDeal)
		private readonly favoriteDealRepository: Repository<UserFavoriteDeal>,
		@InjectRepository(UserFavoriteResource)
		private readonly favoriteResourceRepository: Repository<UserFavoriteResource>,
		@InjectRepository(UserFavoriteListing)
		private readonly favoriteListingRepository: Repository<UserFavoriteListing>,
		@InjectRepository(UserFavoriteLink)
		private readonly favoriteLinkRepository: Repository<UserFavoriteLink>
	) {}

	async getFavoriteDeals(userId: number) {
		const data = await this.favoriteDealRepository.find({
			where: { user: { id: userId } },
			relations: ['deal']
		})

		return data.map(item => item.deal.id)
	}

	async addFavoriteDeals(userId: number, dealId: number) {
		await this.favoriteDealRepository.insert({
			deal: { id: dealId },
			user: { id: userId }
		})
	}

	async deleteFavoriteDeals(userId: number, dealId: number) {
		await this.favoriteDealRepository.delete({
			deal: { id: dealId },
			user: { id: userId }
		})
	}

	async getFavoriteResources(userId: number) {
		const data = await this.favoriteResourceRepository.find({
			where: { user: { id: userId } },
			relations: ['resource']
		})

		return data.map(item => item.resource.id)
	}

	async addFavoriteResources(userId: number, resourceId: number) {
		await this.favoriteResourceRepository.insert({
			resource: { id: resourceId },
			user: { id: userId }
		})
	}

	async deleteFavoriteResources(userId: number, resourceId: number) {
		await this.favoriteResourceRepository.delete({
			resource: { id: resourceId },
			user: { id: userId }
		})
	}

	async getFavoriteListings(userId: number) {
		const data = await this.favoriteListingRepository.find({
			where: { user: { id: userId } },
			relations: ['listing']
		})

		return data.map(item => item.listing.id)
	}

	async getFavoriteListingsObjects(userId: number, query: GetOwnerAllListingsDto) {
		const page = Math.max(1, Number(query.page ?? 1))
		const limit = Math.max(1, Number(query.limit ?? 16))
		const offset = (page - 1) * limit

		const [rows, total] = await this.favoriteListingRepository.findAndCount({
			where: { user: { id: userId } },
			relations: ['listing', 'listing.photos'],
			select: {
				listing: {
					id: true,
					status: true,
					forSale: true,
					forRent: true,
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
				}
			},
			skip: offset,
			take: limit,
			order: {
				createdAt: 'DESC'
			}
		})

		const forSaleCount = await this.favoriteListingRepository.count({
			where: {
				user: { id: userId },
				listing: { forSale: true }
			}
		})

		const forRentCount = await this.favoriteListingRepository.count({
			where: {
				user: { id: userId },
				listing: { forRent: true }
			}
		})

		return {
			items: rows.map(item => item.listing),
			meta: {
				total,
				forSaleCount,
				forRentCount
			}
		}
	}

	async addFavoriteListings(userId: number, listingId: number) {
		await this.favoriteListingRepository.insert({
			listing: { id: listingId },
			user: { id: userId }
		})
	}

	async countFavoriteListings(listingId: number) {
		return await this.favoriteListingRepository.count({ where: { listing: { id: listingId } } })
	}

	async deleteFavoriteListings(userId: number, listingId: number) {
		await this.favoriteListingRepository.delete({
			listing: { id: listingId },
			user: { id: userId }
		})
	}

	async getFavoriteLinks(userId: number) {
		const data = await this.favoriteLinkRepository.find({
			where: { user: { id: userId } },
			relations: ['link']
		})

		return data.map(item => item.link.id)
	}

	async addFavoriteLinks(userId: number, linkId: number) {
		await this.favoriteLinkRepository.insert({
			link: { id: linkId },
			user: { id: userId }
		})
	}

	async deleteFavoriteLinks(userId: number, linkId: number) {
		await this.favoriteLinkRepository.delete({
			link: { id: linkId },
			user: { id: userId }
		})
	}
}
