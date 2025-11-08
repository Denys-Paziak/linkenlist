import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule } from '@nestjs/typeorm'

import { getBullmqConfig } from '../../configs/bullmq.config'
import { getJWTConfig } from '../../configs/jwt.config'
import { getPostgresConfig } from '../../configs/postgres.config'
import { getThrottlerConfig } from '../../configs/throttler.config'
import { LinkModule } from '../link/link.module'
import { S3StorageService } from '../s3-storage/s3-storage.service'

import { ImageProcessor } from './image.processor'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		TypeOrmModule.forRootAsync(getPostgresConfig()),
		BullModule.forRootAsync(getBullmqConfig()),
		BullModule.registerQueue({ name: 'image' }),
		JwtModule.registerAsync(getJWTConfig()),
		ThrottlerModule.forRootAsync(getThrottlerConfig()),
		LinkModule
	],
	providers: [ImageProcessor, S3StorageService]
})
export class ImageWorkerModule {}
