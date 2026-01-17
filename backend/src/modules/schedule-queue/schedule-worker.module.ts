import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'

import { getBullmqConfig } from '../../configs/bullmq.config'
import { DealModule } from '../deal/deal.module'
import { ResourceModule } from '../resource/resource.module'
import { S3StorageService } from '../s3-storage/s3-storage.service'
import { UserModule } from '../user/user.module'

import { ScheduleProcessor } from './schedule.processor'

@Module({
	imports: [
		BullModule.forRootAsync(getBullmqConfig()),
		BullModule.registerQueue({ name: 'schedule' }),
		DealModule,
		ResourceModule,
		UserModule
	],
	providers: [ScheduleProcessor, S3StorageService]
})
export class ScheduleWorkerModule {}
