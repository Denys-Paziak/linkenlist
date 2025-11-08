import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { ScheduleModule } from '@nestjs/schedule'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule } from '@nestjs/typeorm'

import { getJWTConfig } from '../configs/jwt.config'
import { getPostgresConfig } from '../configs/postgres.config'
import { getThrottlerConfig } from '../configs/throttler.config'

import { AppController } from './app.controller'
import { AuditModule } from './audit/audit.module'
import { AuthModule } from './auth/auth.module'
import { DealModule } from './deal/deal.module'
import { FavoriteModule } from './favorite/favorite.module'
import { ImageQueueModule } from './image-queue/image-queue.module'
import { LinkModule } from './link/link.module'
import { ListingModule } from './listing/listing.module'
import { MailModule } from './mail/mail.module'
import { ResourceModule } from './resource/resource.module'
import { S3StorageModule } from './s3-storage/s3-storage.module'
import { TokenModule } from './token/token.module'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		ScheduleModule.forRoot(),
		ConfigModule.forRoot({
			isGlobal: true
		}),
		TypeOrmModule.forRootAsync(getPostgresConfig()),
		JwtModule.registerAsync(getJWTConfig()),
		ThrottlerModule.forRootAsync(getThrottlerConfig()),
		UserModule,
		AuthModule,
		TokenModule,
		MailModule,
		AuditModule,
		ListingModule,
		FavoriteModule,
		ResourceModule,
		DealModule,
		LinkModule,
		S3StorageModule,
		ImageQueueModule
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		}
	]
})
export class AppModule {}
