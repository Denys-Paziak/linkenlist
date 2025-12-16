import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class TurnstileService {
	private readonly logger = new Logger(TurnstileService.name)
	private readonly verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

	constructor(private readonly configService: ConfigService) {}

	async verify(token: string, remoteIp?: string): Promise<boolean> {
		const body = new URLSearchParams({
			secret: this.configService.getOrThrow('TURNSTILE_SECRET_KEY'),
			response: token
		})

		if (remoteIp) {
			body.append('remoteip', remoteIp)
		}

		const res = await fetch(this.verifyUrl, {
			method: 'POST',
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			body
		})

		if (!res.ok) {
			this.logger.error(`Turnstile verify HTTP error: ${res.status}`)
			throw new InternalServerErrorException('Turnstile verification failed')
		}

		const data = (await res.json()) as {
			success: boolean
			['error-codes']?: string[]
			challenge_ts?: string
			hostname?: string
			action?: string
			cdata?: string
		}

		if (!data.success) {
			this.logger.warn(`Turnstile verification failed: ${(data['error-codes'] || []).join(', ')}`)
		}

		return data.success
	}
}
