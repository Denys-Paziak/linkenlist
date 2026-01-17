import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'

export interface ImageJobData {
	entityId: number
	entityFileId: number
	srcKey: string
}

export interface AttachmentJobData {
	entityId: number
	entityFileId: number
	srcKey: string
}

@Injectable()
export class ImageQueueService {
	constructor(@InjectQueue('image') private readonly queue: Queue<ImageJobData>) {}

	async enqueueUserAvatarProcess(data: ImageJobData) {
		return await this.queue.add('user-avatar', data, {
			attempts: 3,
			backoff: { type: 'exponential', delay: 5_000 },
			removeOnComplete: true,
			removeOnFail: false
		})
	}

	async enqueueLinkHeroProcess(data: ImageJobData) {
		return await this.queue.add('link-hero', data, {
			attempts: 3,
			backoff: { type: 'exponential', delay: 5_000 },
			removeOnComplete: true,
			removeOnFail: false
		})
	}

	async enqueueDealHeroProcess(data: ImageJobData) {
		return await this.queue.add('deal-hero', data, {
			attempts: 3,
			backoff: { type: 'exponential', delay: 5_000 },
			removeOnComplete: true,
			removeOnFail: false
		})
	}

	async enqueueDealOgImageProcess(data: ImageJobData) {
		return await this.queue.add('deal-og-image', data, {
			attempts: 3,
			backoff: { type: 'exponential', delay: 5_000 },
			removeOnComplete: true,
			removeOnFail: false
		})
	}

	async enqueueDealAttachmentProcess(data: AttachmentJobData) {
		return await this.queue.add('deal-attachment', data, {
			attempts: 3,
			backoff: { type: 'exponential', delay: 5_000 },
			removeOnComplete: true,
			removeOnFail: false
		})
	}

	async enqueueResourceHeroProcess(data: ImageJobData) {
		return await this.queue.add('resource-hero', data, {
			attempts: 3,
			backoff: { type: 'exponential', delay: 5_000 },
			removeOnComplete: true,
			removeOnFail: false
		})
	}

	async enqueueResourceOgImageProcess(data: ImageJobData) {
		return await this.queue.add('resource-og-image', data, {
			attempts: 3,
			backoff: { type: 'exponential', delay: 5_000 },
			removeOnComplete: true,
			removeOnFail: false
		})
	}

	async enqueueResourceAttachmentProcess(data: AttachmentJobData) {
		return await this.queue.add('resource-attachment', data, {
			attempts: 3,
			backoff: { type: 'exponential', delay: 5_000 },
			removeOnComplete: true,
			removeOnFail: false
		})
	}

	async enqueueListingPhotoProcess(data: ImageJobData) {
		return await this.queue.add('listing-photo', data, {
			attempts: 3,
			backoff: { type: 'exponential', delay: 5_000 },
			removeOnComplete: true,
			removeOnFail: false
		})
	}
}
