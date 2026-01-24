import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, Repository } from 'typeorm'

import { GetAllUserNotificationsDto } from '../dtos/GetAllUserNotifications.dto'
import { Notification } from '../entities/Notification.entity'

@Injectable()
export class NotificationQueryService {
	constructor(
		@InjectRepository(Notification)
		private readonly notificationRepository: Repository<Notification>
	) {}

	async getAllUserNotifications(userId: number, query: GetAllUserNotificationsDto) {
		const page = Math.max(1, Number(query.page ?? 1))
		const limit = Math.max(1, Number(query.limit ?? 20))
		const offset = (page - 1) * limit

		const qb = this.notificationRepository
			.createQueryBuilder('notification')
			.leftJoin('notification.sender', 'sender')
			.addSelect(['sender.id', 'sender.firstName', 'sender.lastName', 'sender.username'])
			.leftJoin('notification.recipient', 'recipient')
			.where('recipient.id = :userId', { userId })

		if (query.status) {
			qb.andWhere('notification.status = :status', { status: query.status })
		}

		if (query.search?.trim()) {
			const search = `%${query.search.trim()}%`
			qb.andWhere(
				new Brackets(sqb => {
					sqb.where('notification.title ILIKE :search', { search })
					sqb.andWhere('notification.message ILIKE :search', { search })
				})
			)
		}

		qb.orderBy('notification.createdAt', 'DESC').skip(offset).take(limit)

		const [items, total] = await qb.getManyAndCount()
		return [items, total]
	}
}
