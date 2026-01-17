import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ImageQueueModule } from '../image-queue/image-queue.module'
import { S3StorageModule } from '../s3-storage/s3-storage.module'
import { ScheduleQueueModule } from '../schedule-queue/schedule-queue.module'
import { StripeModule } from '../stripe/stripe.module'

import { ListingController } from './controllers/listing.controller'
import { Listing } from './entities/Listing.entity'
import { ListingPhoto } from './entities/ListingPhoto.entity'
import { MilitaryBase } from './entities/MilitaryBase.entity'
import { ListingCommandService } from './services/listing-command.service'
import { ListingCronService } from './services/listing-cron.service'
import { ListingQueryService } from './services/listing-query.service'
import { ListingSystemService } from './services/listing-system.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([Listing, ListingPhoto, MilitaryBase]),
		S3StorageModule,
		ImageQueueModule,
		forwardRef(() => StripeModule),
		ScheduleQueueModule
	],
	controllers: [ListingController],
	providers: [ListingCommandService, ListingQueryService, ListingSystemService, ListingCronService],
	exports: [ListingSystemService]
})
export class ListingModule {}
