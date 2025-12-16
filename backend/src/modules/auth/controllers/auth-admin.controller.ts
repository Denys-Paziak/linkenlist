import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Throttle } from '@nestjs/throttler'
import type { FastifyReply, FastifyRequest } from 'fastify'

import { ThrottleMessage } from '../../../decorators/throttle-message.decorator'
import { ERoleName } from '../../../interfaces/ERoleName'
import { LoginDto } from '../dtos/Login.dto'
import { AuthService } from '../services/auth.service'

@Controller('admin/auth')
export class AuthAdminController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService
	) {}

	@Throttle({ default: { limit: 5, ttl: 5 * 60 * 1000 } })
	@ThrottleMessage('Too many login attempts. Please try again later.')
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: FastifyReply) {
		const data = await this.authService.login(dto, ERoleName.ADMIN)

		response.setCookie('refresh_token', data.refreshToken, {
			maxAge: 30 * 24 * 60 * 1,
			httpOnly: true,
			secure: this.configService.getOrThrow('NODE_ENV') === 'production',
			sameSite: 'strict',
			path: '/'
		})
		response.setCookie('access_token', data.accessToken, {
			maxAge: 5 * 60,
			httpOnly: true,
			secure: this.configService.getOrThrow('NODE_ENV') === 'production',
			sameSite: 'strict',
			path: '/'
		})

		return { ok: true }
	}

	@HttpCode(200)
	@Post('logout')
	async logout(@Req() request: FastifyRequest, @Res({ passthrough: true }) response: FastifyReply) {
		const refresh_token = request.cookies['refresh_token']

		await this.authService.logout(refresh_token)

		response.clearCookie('refresh_token', {
			maxAge: 30 * 24 * 60 * 1,
			httpOnly: true,
			secure: this.configService.getOrThrow('NODE_ENV') === 'production',
			sameSite: 'strict',
			path: '/'
		})
		response.clearCookie('access_token', {
			maxAge: 5 * 60,
			httpOnly: true,
			secure: this.configService.getOrThrow('NODE_ENV') === 'production',
			sameSite: 'strict',
			path: '/'
		})

		return { ok: true }
	}
}
