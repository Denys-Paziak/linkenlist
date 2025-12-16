import { BullModule } from '@nestjs/bullmq'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule } from '@nestjs/typeorm'

import { getBullmqConfig } from '../../configs/bullmq.config'
import { getCacheConfig } from '../../configs/cache.config'
import { getJWTConfig } from '../../configs/jwt.config'
import { getPostgresConfig } from '../../configs/postgres.config'
import { getThrottlerConfig } from '../../configs/throttler.config'
import { DealModule } from '../deal/deal.module'
import { LinkModule } from '../link/link.module'
import { ListingModule } from '../listing/listing.module'
import { MailModule } from '../mail/mail.module'
import { ResourceModule } from '../resource/resource.module'
import { S3StorageService } from '../s3-storage/s3-storage.service'
import { TokenModule } from '../token/token.module'
import { UserModule } from '../user/user.module'

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
		CacheModule.registerAsync(getCacheConfig()),
		LinkModule,
		DealModule,
		ResourceModule,
		UserModule,
		ListingModule,
		TokenModule,
		MailModule
	],
	providers: [ImageProcessor, S3StorageService]
})
export class ImageWorkerModule {}
