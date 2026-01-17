import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Stripe from 'stripe'

import { EListingStatus } from '../../../interfaces/EListingStatus'
import { EPackageType } from '../../../interfaces/EPackageType'
import { ListingSystemService } from '../../listing/services/listing-system.service'

@Injectable()
export class StripeCommandService {
	private stripe: Stripe

	constructor(
		private readonly configService: ConfigService,
		private readonly listingSystemService: ListingSystemService,
	) {
		this.stripe = new Stripe(this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'))
	}

	async webhook(event: Stripe.Event) {
		switch (event.type) {
			case 'checkout.session.completed': {
				const session = event.data.object
				const sessionMetadata = session.metadata

				if (session.mode === 'payment') {
					if (session.payment_status === 'paid') {
						await this.handlePaymentSucceeded(Number(sessionMetadata?.listingId))
					}
				}
				break
			}

			case 'checkout.session.async_payment_succeeded': {
				const session = event.data.object
				const sessionMetadata = session.metadata
				await this.handlePaymentSucceeded(Number(sessionMetadata?.listingId))
				break
			}
		}
	}

	private async handlePaymentSucceeded(listingId: number) {
		await this.listingSystemService.updateListingStatus(listingId, EListingStatus.ACTIVE, EPackageType.PREMIUM)
	}
}
