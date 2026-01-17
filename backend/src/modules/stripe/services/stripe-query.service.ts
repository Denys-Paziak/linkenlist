import { Injectable } from '@nestjs/common'

import { StripeSystemService } from './stripe-system.service'

@Injectable()
export class StripeQueryService {
	constructor(private readonly stripeSystemService: StripeSystemService) {}

	async getPrices() {
		return await this.stripeSystemService.getPricePremiumPackage()
	}
}
