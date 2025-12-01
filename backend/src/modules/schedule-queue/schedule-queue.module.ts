import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'

import { getBullmqConfig } from '../../configs/bullmq.config'

import { ScheduleQueueService } from './schedule-queue.service'

@Module({
	imports: [BullModule.forRootAsync(getBullmqConfig()), BullModule.registerQueue({ name: 'schedule' })],
	providers: [ScheduleQueueService],
	exports: [ScheduleQueueService]
})
export class ScheduleQueueModule {}
