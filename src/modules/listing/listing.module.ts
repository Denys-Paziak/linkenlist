import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ListingController } from './controllers/listing.controller'
import { Listing } from './entities/Listing.entity'
import { ListingAmenity } from './entities/ListingAmenity.entity'
import { ListingPhoto } from './entities/ListingPhoto.entity'
import { MilitaryBase } from './entities/MilitaryBase.entity'
import { ListingService } from './services/listing.service'

@Module({
	imports: [TypeOrmModule.forFeature([Listing, ListingPhoto, ListingAmenity, MilitaryBase])],
	controllers: [ListingController],
	providers: [ListingService]
})
export class ListingModule {}
