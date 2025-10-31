import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { getBullmqConfig } from '../../configs/bullmq.config'
import { getPostgresConfig } from '../../configs/postgres.config'
import { S3StorageService } from '../s3-storage/s3-storage.service'

import { ImageProcessor } from './image.processor'
import { LinkModule } from '../link/link.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env.development.local'
		}),
		TypeOrmModule.forRootAsync(getPostgresConfig()),
		BullModule.forRootAsync(getBullmqConfig()),
		BullModule.registerQueue({ name: 'image' }),
		LinkModule
	],
	providers: [ImageProcessor, S3StorageService]
})
export class ImageWorkerModule {}
