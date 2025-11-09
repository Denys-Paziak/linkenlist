import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOneOptions, Repository } from 'typeorm'

import { User } from '../entities/User.entity'

@Injectable()
export class UserSystemService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}
	async findOne(options: FindOneOptions<User>) {
		return await this.userRepository.findOne(options)
	}

	async save(data: Partial<User>) {
		await this.userRepository.save(data)

		const user = await this.userRepository.findOne({
			where: { privateEmail: data.privateEmail }
		})

		if (!user) throw new InternalServerErrorException('User creation failed')

		return user
	}

	async update(id: number, data: Partial<Omit<User, 'id'>>) {
		await this.userRepository.update(id, data)

		const user = await this.userRepository.findOne({
			where: { id }
		})

		if (!user) throw new InternalServerErrorException('User update failed')

		return user
	}
}
