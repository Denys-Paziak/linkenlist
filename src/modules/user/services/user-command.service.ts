import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, Repository } from 'typeorm'

import { User } from '../entities/User.entity'

@Injectable()
export class UserCommandService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}
	async updatePassword(user: FindOptionsWhere<User>, password: string) {
		return await this.userRepository.update(user, { password })
	}

	async verifyEmail(userId: number) {
		return await this.userRepository.update(userId, { emailVerified: true })
	}
}
