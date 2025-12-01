import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'

export interface ScheduleJobData {
	entityId: number,
	runAt: Date
}

@Injectable()
export class ScheduleQueueService {
	constructor(@InjectQueue('schedule') private readonly queue: Queue<ScheduleJobData>) {}

	async dealSchedulePublish(data: ScheduleJobData) {
		const executeAt = new Date(data.runAt)
		const delay = executeAt.getTime() - Date.now()

		return await this.queue.add('deal-schedule-publish', data, {
			attempts: 3,
			delay: delay,
			backoff: { type: 'exponential', delay: 5_000 },
			removeOnComplete: true,
			removeOnFail: false
		})
	}

	async dealScheduleExpired(data: ScheduleJobData) {
		const executeAt = new Date(data.runAt)
		const delay = executeAt.getTime() - Date.now()

		return await this.queue.add('deal-schedule-expired', data, {
			attempts: 3,
			delay: delay,
			backoff: { type: 'exponential', delay: 5_000 },
			removeOnComplete: true,
			removeOnFail: false
		})
	}

	async resourceSchedulePublish(data: ScheduleJobData) {
		const executeAt = new Date(data.runAt)
		const delay = executeAt.getTime() - Date.now()

		return await this.queue.add('resource-schedule-publish', data, {
			attempts: 3,
			delay: delay,
			backoff: { type: 'exponential', delay: 5_000 },
			removeOnComplete: true,
			removeOnFail: false
		})
	}

	async resourceScheduleExpired(data: ScheduleJobData) {
		const executeAt = new Date(data.runAt)
		const delay = executeAt.getTime() - Date.now()

		return await this.queue.add('resource-schedule-expired', data, {
			attempts: 3,
			delay: delay,
			backoff: { type: 'exponential', delay: 5_000 },
			removeOnComplete: true,
			removeOnFail: false
		})
	}
}
