import { Injectable } from '@nestjs/common'

import { StripeSystemService } from './stripe-system.service'

@Injectable()
export class StripeQueryService {
	constructor(private readonly stripeSystemService: StripeSystemService) {}

	async getDefaultPrice() {
		return await this.stripeSystemService.getDefaultPricePremiumPackage()
	}

	async getPrices() {
		return await this.stripeSystemService.getAllPricesPremiumPackage()
	}
}
