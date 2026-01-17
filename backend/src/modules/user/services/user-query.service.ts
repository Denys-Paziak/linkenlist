import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ERoleName } from '../../../interfaces/ERoleName'
import { GetAllUsersDto } from '../dtos/GetAllUsers.dto'
import { User } from '../entities/User.entity'

@Injectable()
export class UserQueryService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

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
				'listings'
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
