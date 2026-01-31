import { BadRequestException, Controller, Get, Header, Post, Req, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { FastifyReply, FastifyRequest } from 'fastify'
import Stripe from 'stripe'

import { StripeCommandService } from '../services/stripe-command.service'
import { StripeQueryService } from '../services/stripe-query.service'

@Controller('payments')
export class StripeController {
	private stripe: Stripe

	constructor(
		private readonly stripeCommandService: StripeCommandService,
		private readonly stripeQueryService: StripeQueryService,
		private readonly configService: ConfigService
	) {
		this.stripe = new Stripe(this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'))
	}

	@Get('default-price')
	async getDefaultPrice() {
		return await this.stripeQueryService.getDefaultPrice()
	}

	@Get('prices')
	async getPrices() {
		return await this.stripeQueryService.getPrices()
	}

	@Header('Content-Type', 'application/json')
	@Post('webhook')
	async webhook(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
		const sig = req.headers['stripe-signature']
		const secret = this.configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET')
		let event: Stripe.Event

		if (!sig) {
			throw new BadRequestException('Missing Stripe signature')
		}

		try {
			event = this.stripe.webhooks.constructEvent((req as any).rawBody, sig, secret)
		} catch (err) {
			throw new BadRequestException(`Webhook Error: ${err.message}`)
		}

		await this.stripeCommandService.webhook(event)

		res.status(200).send({ received: true })
	}
}
