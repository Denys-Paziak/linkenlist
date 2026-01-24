import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ChangeStatusDto } from '../dtos/ChangeStatus.dto'
import { Notification } from '../entities/Notification.entity'
import { ENotificationStatus } from '../../../interfaces/ENotificationStatus'

@Injectable()
export class NotificationCommandService {
	constructor(
		@InjectRepository(Notification)
		private readonly notificationRepository: Repository<Notification>
	) {}

	async changeStatus(userId: number, notificationId: number, dto: ChangeStatusDto) {
		await this.notificationRepository.update({ id: notificationId, recipient: { id: userId } }, { status: dto.status })
	}

	async readAll(userId: number) {
		await this.notificationRepository.update({ recipient: { id: userId } }, { status: ENotificationStatus.READ })
	}
}
