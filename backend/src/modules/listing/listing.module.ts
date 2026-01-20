import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ImageQueueModule } from '../image-queue/image-queue.module'
import { S3StorageModule } from '../s3-storage/s3-storage.module'
import { ScheduleQueueModule } from '../schedule-queue/schedule-queue.module'
import { StripeModule } from '../stripe/stripe.module'

import { ListingAdminController } from './controllers/listing-admin.controller'
import { ListingController } from './controllers/listing.controller'
import { BahRate } from './entities/BAH.entity'
import { Listing } from './entities/Listing.entity'
import { ListingPhoto } from './entities/ListingPhoto.entity'
import { BahZipMapping } from './entities/MHA.entity'
import { MilitaryBase } from './entities/MilitaryBase.entity'
import { ListingCommandService } from './services/listing-command.service'
import { ListingCronService } from './services/listing-cron.service'
import { ListingQueryService } from './services/listing-query.service'
import { ListingSystemService } from './services/listing-system.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([Listing, ListingPhoto, MilitaryBase, BahRate, BahZipMapping]),
		S3StorageModule,
		ImageQueueModule,
		forwardRef(() => StripeModule),
		ScheduleQueueModule
	],
	controllers: [ListingController, ListingAdminController],
	providers: [ListingCommandService, ListingQueryService, ListingSystemService, ListingCronService],
	exports: [ListingSystemService]
})
export class ListingModule {}
