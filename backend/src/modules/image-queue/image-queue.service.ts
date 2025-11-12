import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bullmq'
import { Queue } from 'bullmq'

export type ImageJobData = {
  entityId: number
  entityImageId: number
  srcKey: string
}

@Injectable()
export class ImageQueueService {
  constructor(@InjectQueue('image') private readonly queue: Queue<ImageJobData>) {}

  enqueueLinkProcess(data: ImageJobData) {
    this.queue.add('link', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5_000 },
      removeOnComplete: true,
      removeOnFail: false,
    })
  }

  enqueueDealProcess(data: ImageJobData) {
    this.queue.add('deal', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5_000 },
      removeOnComplete: true,
      removeOnFail: false,
    })
  }
}
