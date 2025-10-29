import { Controller } from '@nestjs/common'

import { ListingService } from '../services/listing.service'

@Controller('listing')
export class ListingController {
	constructor(private readonly listingService: ListingService) {}
}
