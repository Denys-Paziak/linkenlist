import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import type { FastifyRequest } from 'fastify'

import { TurnstileService } from './turnstile.service'

@Injectable()
export class TurnstileGuard implements CanActivate {
	constructor(private readonly turnstileService: TurnstileService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const httpCtx = context.switchToHttp()
		const req = httpCtx.getRequest<FastifyRequest>()

		const token = this.getTokenFromRequest(req)

		if (!token) {
			throw new BadRequestException("We couldn't verify that you're not a robot.")
		}

		const ip =
			(req.headers['cf-connecting-ip'] as string | undefined) ||
			(req.headers['x-forwarded-for'] as string | undefined) ||
			req.ip

		const ok = await this.turnstileService.verify(token, ip)

		if (!ok) {
			throw new ForbiddenException("We couldn't verify that you're not a robot.")
		}

		return true
	}

	private getTokenFromRequest(req: FastifyRequest): string | null {
		const body: any = req.body ?? {}

		if (body['cf-turnstile-response']) {
			return String(body['cf-turnstile-response'])
		}

		if (body.cfTurnstileResponse) {
			return String(body.cfTurnstileResponse)
		}

		const headerToken = req.headers['cf-turnstile-response']
		if (headerToken) {
			return Array.isArray(headerToken) ? headerToken[0] : String(headerToken)
		}

		return null
	}
}
