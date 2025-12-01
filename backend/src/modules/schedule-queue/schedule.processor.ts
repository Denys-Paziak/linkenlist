import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { Injectable, Logger } from '@nestjs/common'
import { Job } from 'bullmq'

import { EDealStatus } from '../../interfaces/EDealStatus'
import { EResourceStatus } from '../../interfaces/EResourceStatus'
import { DealSystemService } from '../deal/services/deal-system.service'
import { ResourceSystemService } from '../resource/services/resource-system.service'

import { ScheduleJobData } from './schedule-queue.service'

class DiscardedError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'DiscardedError'
	}
}

@Processor('schedule')
@Injectable()
export class ScheduleProcessor extends WorkerHost {
	private readonly logger = new Logger(ScheduleProcessor.name)

	constructor(
		private readonly dealSystemService: DealSystemService,
		private readonly resourceSystemService: ResourceSystemService
	) {
		super()
	}

	async process(job: Job<ScheduleJobData>) {
		switch (job.name) {
			case 'deal-schedule-publish':
				return this.dealSchedulePublish(job)
			case 'deal-schedule-expired':
				return this.dealScheduleExpired(job)
			case 'resource-schedule-publish':
				return this.resourceSchedulePublish(job)
			case 'resource-schedule-expired':
				return this.resourceScheduleExpired(job)
			default:
				throw new Error(`Unknown job type: ${job.name}`)
		}
	}

	private async dealSchedulePublish(job: Job<ScheduleJobData>) {
		const { entityId, runAt } = job.data

		const deal = await this.dealSystemService.findDeal({ where: { id: entityId } })
		if (!deal) {
			this.logger.warn(`deal ${entityId} not found, skip publish`)
			return
		}

		// 1) якщо статус уже НЕ SCHEDULED → юзер передумав
		if (deal.status !== EDealStatus.SCHEDULED) {
			this.logger.log(`deal ${entityId}: status is ${deal.status}, skip publish`)
			return
		}

		// 2) якщо дата в БД не збігається з тією, під яку планували цей job → юзер поміняв час
		if (deal.publishAt && runAt && deal.publishAt.getTime() !== new Date(runAt).getTime()) {
			this.logger.log(`deal ${entityId}: publishAt changed, skip old job`)
			return
		}

		// все ще актуально → публікуємо
		await this.dealSystemService.updateDealStatus(entityId, EDealStatus.PUBLISHED)
	}

	private async dealScheduleExpired(job: Job<ScheduleJobData>) {
		const { entityId, runAt } = job.data

		const deal = await this.dealSystemService.findDeal({ where: { id: entityId } })
		if (!deal) {
			this.logger.warn(`deal ${entityId} not found, skip publish`)
			return
		}

		// 1) якщо статус уже НЕ SCHEDULED → юзер передумав
		if (deal.status !== EDealStatus.EXPIRED) {
			this.logger.log(`deal ${entityId}: status is ${deal.status}, skip publish`)
			return
		}

		// 2) якщо дата в БД не збігається з тією, під яку планували цей job → юзер поміняв час
		if (deal.expireAt && runAt && deal.expireAt.getTime() !== new Date(runAt).getTime()) {
			this.logger.log(`deal ${entityId}: publishAt changed, skip old job`)
			return
		}

		// все ще актуально → публікуємо
		await this.dealSystemService.updateDealStatus(entityId, EDealStatus.EXPIRED)
	}

	private async resourceSchedulePublish(job: Job<ScheduleJobData>) {
		const { entityId, runAt } = job.data

		const resource = await this.resourceSystemService.findResource({ where: { id: entityId } })
		if (!resource) {
			this.logger.warn(`deal ${entityId} not found, skip publish`)
			return
		}

		// 1) якщо статус уже НЕ SCHEDULED → юзер передумав
		if (resource.status !== EResourceStatus.SCHEDULED) {
			this.logger.log(`resource ${entityId}: status is ${resource.status}, skip publish`)
			return
		}

		// 2) якщо дата в БД не збігається з тією, під яку планували цей job → юзер поміняв час
		if (resource.publishAt && runAt && resource.publishAt.getTime() !== new Date(runAt).getTime()) {
			this.logger.log(`resource ${entityId}: publishAt changed, skip old job`)
			return
		}

		// все ще актуально → публікуємо
		await this.resourceSystemService.updateResourceStatus(entityId, EResourceStatus.PUBLISHED)
	}

	private async resourceScheduleExpired(job: Job<ScheduleJobData>) {
		const { entityId, runAt } = job.data

		const resource = await this.resourceSystemService.findResource({ where: { id: entityId } })
		if (!resource) {
			this.logger.warn(`resource ${entityId} not found, skip publish`)
			return
		}

		// 1) якщо статус уже НЕ SCHEDULED → юзер передумав
		if (resource.status !== EResourceStatus.EXPIRED) {
			this.logger.log(`deal ${entityId}: status is ${resource.status}, skip publish`)
			return
		}

		// 2) якщо дата в БД не збігається з тією, під яку планували цей job → юзер поміняв час
		if (resource.expireAt && runAt && resource.expireAt.getTime() !== new Date(runAt).getTime()) {
			this.logger.log(`resource ${entityId}: publishAt changed, skip old job`)
			return
		}

		// все ще актуально → публікуємо
		await this.resourceSystemService.updateResourceStatus(entityId, EResourceStatus.EXPIRED)
	}

	/** Глобальний обробник падінь */
	@OnWorkerEvent('failed')
	async onFailed(job: Job<ScheduleJobData>, err: Error) {
		if (err && err.name === 'DiscardedError') {
			this.logger.warn(`[discarded] jobId=${job.id}: ${err.message}`)
			return
		}

		const id = job?.data?.entityId
		if (!id) {
			this.logger.error(`[failed] jobId=${job.id}: ${err.message}`, err.stack)
			return
		}

		try {
		} catch {
			/* сутність може не існувати */
		}

		this.logger.error(`[failed] jobId=${job.id}: ${err.message}`, err.stack)
	}
}
