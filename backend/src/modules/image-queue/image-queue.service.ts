import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'

export type ImageJobData = {
	entityId: number
	entityFileId: number
	srcKey: string
}

export type AttachmentJobData = {
	entityId: number
	entityFileId: number
	srcKey: string
}

@Injectable()
export class ImageQueueService {
	constructor(@InjectQueue('image') private readonly queue: Queue<ImageJobData>) {}

	enqueueLinkHeroProcess(data: ImageJobData) {
		this.queue.add('link-hero', data, {
			attempts: 3,
			backoff: { type: 'exponential', delay: 5_000 },
			removeOnComplete: true,
			removeOnFail: false
		})
	}

	enqueueDealHeroProcess(data: ImageJobData) {
		this.queue.add('deal-hero', data, {
			attempts: 3,
			backoff: { type: 'exponential', delay: 5_000 },
			removeOnComplete: true,
			removeOnFail: false
		})
	}

	enqueueDealAttachmentProcess(data: AttachmentJobData) {
		this.queue.add('deal-attachment', data, {
			attempts: 3,
			backoff: { type: 'exponential', delay: 5_000 },
			removeOnComplete: true,
			removeOnFail: false
		})
	}
}
