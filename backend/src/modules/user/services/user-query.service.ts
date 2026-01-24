import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { EListingStatus } from '../../../interfaces/EListingStatus'
import { ERoleName } from '../../../interfaces/ERoleName'
import { GetAllUsersDto } from '../dtos/GetAllUsers.dto'
import { User } from '../entities/User.entity'

@Injectable()
export class UserQueryService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	async getPublicProfile(userId: number) {
		const userFromDB = await this.userRepository
			.createQueryBuilder('user')
			.where('user.id = :userId', { userId })
			.andWhere('user.role = :role', { role: ERoleName.USER })
			.andWhere('user.emailVerified = true')
			.andWhere('user.isPrivate = false')
			.leftJoinAndSelect('user.avatar', 'avatar')
			.loadRelationCountAndMap('user.forSaleCount', 'user.listings', 'ol_sale', sub =>
				sub.andWhere('ol_sale.forSale = true').andWhere('ol_sale.status = :activeStatus', {
					activeStatus: EListingStatus.ACTIVE
				})
			)
			.loadRelationCountAndMap('user.forRentCount', 'user.listings', 'ol_rent', sub =>
				sub.andWhere('ol_rent.forRent = true').andWhere('ol_rent.status = :activeStatus', {
					activeStatus: EListingStatus.ACTIVE
				})
			)
			.getOne()

		if (!userFromDB) throw new NotFoundException('No such user found')

		return {
			id: userFromDB.id,
			avatar: userFromDB.avatar,
			company: userFromDB.company,
			primaryPhone: userFromDB.phone,
			createdAt: userFromDB.createdAt,
			firstName: userFromDB.firstName,
			lastName: userFromDB.lastName,
			listings: {
				forSale: (userFromDB as any).forSaleCount ?? 0,
				forRent: (userFromDB as any).forRentCount ?? 0
			},
			professionalTitle: userFromDB.professionalTitle,
			publicEmail: userFromDB.publicEmail
		}
	}

	async getSelf(userId: number, userRole: ERoleName, userIP?: string) {
		const userFromDB = await this.userRepository.findOne({
			where: { id: userId, role: userRole, emailVerified: true },
			relations: ['avatar']
		})
		if (!userFromDB) throw new NotFoundException('No such user found')

		await this.userRepository.update(userId, { lastActivity: new Date(), lastLoginIp: userIP })

		return {
			id: userFromDB.id,
			username: userFromDB.username,
			firstName: userFromDB.firstName,
			lastName: userFromDB.lastName,
			avatar: userFromDB.avatar,
			professionalTitle: userFromDB.professionalTitle,
			company: userFromDB.company,
			privateEmail: userFromDB.privateEmail,
			publicEmail: userFromDB.publicEmail,
			phone: userFromDB.phone,
			footerDisclaimer: userFromDB.footerDisclaimer,
			freeListingCredit: userFromDB.freeListingCredit,
			isPrivate: userFromDB.isPrivate,
			updatedAt: userFromDB.updatedAt,
			createdAt: userFromDB.createdAt
		}
	}

	async getAllUsersAdmin(query: GetAllUsersDto) {
		const page = Math.max(1, query.page)
		const limit = Math.max(1, query.limit)
		const offset = (page - 1) * limit

		const qb = this.userRepository
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.listings', 'listings')
			.select([
				'user.id',
				'user.firstName',
				'user.lastName',
				'user.username',
				'user.privateEmail',
				'user.phone',
				'user.company',
				'user.createdAt',
				'user.lastActivity',
				'user.banExpirationDate',
				'user.freeListingCredit',
				'listings.id',
				'listings.forSale',
				'listings.forRent',
				'listings.package',
				'listings.package',
				'listings.expiresAt',
				'listings.status',
				'listings.street',
				'listings.unit',
				'listings.zip',
				'listings.state',
				'listings.city',
				'listings.slug'
			])
			.orderBy('user.createdAt', 'DESC')
			.skip(offset)
			.take(limit)
		qb.andWhere('user.role = :role', { role: 'user' })
		qb.andWhere('user.emailVerified = :emailVerified', { emailVerified: true })

		if (query.search) {
			qb.andWhere(
				`(
				LOWER(user.firstName) LIKE LOWER(:search)
				OR LOWER(user.lastName) LIKE LOWER(:search)
				OR LOWER(user.username) LIKE LOWER(:search)
				OR LOWER(user.privateEmail) LIKE LOWER(:search)
			)`,
				{ search: `%${query.search}%` }
			)
		}

		if (query.banned !== undefined) {
			if (query.banned) {
				qb.andWhere(`user.banExpirationDate IS NOT NULL AND user.banExpirationDate > NOW()`)
			} else {
				qb.andWhere(`(user.banExpirationDate IS NULL OR user.banExpirationDate <= NOW())`)
			}
		}

		return await qb.getManyAndCount()
	}
}
