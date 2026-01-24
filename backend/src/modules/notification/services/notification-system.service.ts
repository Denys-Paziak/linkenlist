import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Notification } from '../entities/Notification.entity'

@Injectable()
export class NotificationSystemService {
	constructor(
		@InjectRepository(Notification)
		private readonly notificationRepository: Repository<Notification>
	) {}

	async createNotifications(data: { title: string; message: string; senderId: number | null; recipientId: number }[]) {
		const insertData = data.map(item => ({
			title: item.title,
			message: item.message,
			sender: item.senderId
				? {
						id: item.senderId
					}
				: null,
			recipient: {
				id: item.recipientId
			}
		}))

		await this.notificationRepository.insert(insertData)
	}
}
