import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { ERoleNames } from '@/interfaces/ERoleNames'
import { Repository } from 'typeorm'
import { User } from '../entities/User.entity'
import { GetSelfResponse } from '../responses/GetSelf.response'

@Injectable()
export class UserQueryService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async getSelf(userId: number, userRole: ERoleNames) {
		const userFromDB = await this.userRepository.findOne({ where: { id: userId, role: userRole } })
		if (!userFromDB) throw new NotFoundException('No such user found')

		await this.userRepository.update(userId, { lastActivity: new Date() })

		return plainToInstance(
			GetSelfResponse,
			userFromDB,
			{
				excludeExtraneousValues: true
			}
		)
	}
}
