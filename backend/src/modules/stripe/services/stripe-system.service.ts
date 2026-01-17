import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Stripe from 'stripe'

@Injectable()
export class StripeSystemService {
	private stripe: Stripe

	constructor(private readonly configService: ConfigService) {
		this.stripe = new Stripe(this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'))
	}

	async createPaymentCheckout(listingId: number) {
		const price = await this.getPricePremiumPackage()

		const session = await this.stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price: price.id,
					quantity: 1
				}
			],
			mode: 'payment',
			success_url: this.configService.getOrThrow<string>('STRIPE_SUCCESS_URL'),
			cancel_url: this.configService.getOrThrow<string>('STRIPE_CANCEL_URL'),
			metadata: {
				listingId
			}
		})

		return { url: session.url }
	}

	async getPricePremiumPackage() {
		const prices = (
			await this.stripe.prices.list({
				active: true,
				limit: 100,
				expand: ['data.product']
			})
		).data
			.map(item => {
				if (item.product && typeof item.product === 'object' && 'name' in item.product) {
					return {
						id: item.id,
						price: item.unit_amount ? item.unit_amount / 100 : 0,
						currency: item.currency,
						name: item.product.name
					}
				} else {
					return null
				}
			})
			.filter(item => item !== null)

		const price = prices.find(item => item.name === 'Premium package') || prices[0]

		if (!price) {
			throw new NotFoundException('Price not found.')
		}

		return price
	}
}
