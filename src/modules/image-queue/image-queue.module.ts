import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'

import { getBullmqConfig } from '../../configs/bullmq.config'

import { ImageQueueService } from './image-queue.service'

@Module({
	imports: [BullModule.forRootAsync(getBullmqConfig()), BullModule.registerQueue({ name: 'image' })],
	providers: [ImageQueueService],
	exports: [ImageQueueService]
})
export class ImageQueueModule {}
