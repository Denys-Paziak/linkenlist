import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm'

import { User } from '../entities/User.entity'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js'

@Injectable()
export class UserSystemService {
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

	async findOne(options: FindOneOptions<User>) {
		return await this.userRepository.findOne(options)
	}

	async save(data: DeepPartial<User>) {
		await this.userRepository.save(data)

		const user = await this.userRepository.findOne({
			where: { privateEmail: data.privateEmail }
		})

		if (!user) throw new InternalServerErrorException('User creation failed')

		return user
	}

	async update(id: number, data: QueryDeepPartialEntity<Omit<User, 'id'>>) {
		return await this.userRepository.update(id, data)
	}

	async increment(conditions: FindOptionsWhere<User>, propertyPath: string, value: number | string) {
		return await this.userRepository.increment(conditions, propertyPath, value)
	}
}
