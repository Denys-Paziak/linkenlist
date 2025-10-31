import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bullmq'
import { Queue } from 'bullmq'

export type ImageJobData = {
  linkId: number
  linkImageId: number
  srcKey: string
}

@Injectable()
export class ImageQueueService {
  constructor(@InjectQueue('image') private readonly queue: Queue<ImageJobData>) {}

  enqueueProcess(data: ImageJobData) {
    this.queue.add('process', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5_000 },
      removeOnComplete: true,
      removeOnFail: false,
    })
  }
}
