import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Stripe from 'stripe'

@Injectable()
export class StripeSystemService {
	private stripe: Stripe

	constructor(private readonly configService: ConfigService) {
		this.stripe = new Stripe(this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'))
	}

	async createPaymentCheckout(listingId: number, type: 'publish' | 'expiration', priceId?: string) {
		const price = priceId ? await this.getPrice(priceId) : await this.getDefaultPricePremiumPackage()

		if (!price || !price.period) {
			throw new InternalServerErrorException('Failed to create payment.')
		}

		try {
			const session = await this.stripe.checkout.sessions.create({
				payment_method_types: ['card'],
				line_items: [
					{
						price: price.id,
						quantity: 1
					}
				],
				mode: 'payment',
				success_url:
					type === 'publish'
						? this.configService.getOrThrow<string>('STRIPE_SUCCESS_PUBLISH_URL')
						: this.configService.getOrThrow<string>('STRIPE_SUCCESS_EXPIRATION_URL'),
				cancel_url: this.configService.getOrThrow<string>('STRIPE_CANCEL_URL'),
				metadata: {
					listingId,
					period: price.period
				}
			})

			return { url: session.url }
		} catch (error) {
			throw new BadRequestException(
				'The price shown may be inactive at the moment. Please try again later or select another option.'
			)
		}
	}

	async getAllPricesPremiumPackage() {
		const prices = (
			await this.stripe.prices.list({
				active: true,
				limit: 100
			})
		).data.map(item => ({
			id: item.id,
			price: item.unit_amount ? item.unit_amount / 100 : 0,
			currency: item.currency,
			period: Number(item.metadata.period) || null
		}))

		return prices
	}

	async getPrice(priceId: string) {
		const price = await this.stripe.prices.retrieve(priceId)

		return {
			id: price.id,
			price: price.unit_amount ? price.unit_amount / 100 : 0,
			currency: price.currency,
			period: Number(price.metadata.period) || null
		}
	}

	async getDefaultPricePremiumPackage() {
		const prices = (
			await this.stripe.prices.list({
				active: true,
				limit: 100,
				expand: ['data.product']
			})
		).data
			.map(item => {
				if (item.product && typeof item.product === 'object' && 'name' in item.product) {
					if (item.product.default_price === item.id) {
						return {
							id: item.id,
							price: item.unit_amount ? item.unit_amount / 100 : 0,
							currency: item.currency,
							period: Number(item.metadata.period) || null
						}
					}
					return null
				} else {
					return null
				}
			})
			.filter(item => item !== null)

		const price = prices?.[0]

		if (!price) {
			throw new NotFoundException('Price not found.')
		}

		return price
	}
}
