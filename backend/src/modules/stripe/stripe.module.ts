import { forwardRef, Module } from '@nestjs/common'

import { ListingModule } from '../listing/listing.module'

import { StripeController } from './controllers/stripe.controller'
import { StripeCommandService } from './services/stripe-command.service'
import { StripeQueryService } from './services/stripe-query.service'
import { StripeSystemService } from './services/stripe-system.service'

@Module({
	imports: [forwardRef(() => ListingModule)],
	controllers: [StripeController],
	providers: [StripeCommandService, StripeQueryService, StripeSystemService],
	exports: [StripeSystemService]
})
export class StripeModule {}
