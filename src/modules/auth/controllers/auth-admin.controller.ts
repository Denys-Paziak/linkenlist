import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import type { FastifyReply } from 'fastify'

import { ThrottleMessage } from '../../../decorators/throttle-message.decorator'
import { ERoleNames } from '../../../interfaces/ERoleNames'
import { LoginDto } from '../dtos/Login.dto'
import { AuthService } from '../services/auth.service'

@ApiTags('Authentication Admin')
@Controller('admin/auth')
export class AuthAdminController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService
	) {}

	@Throttle({ default: { limit: 50, ttl: 5 * 60 * 1000 } })
	@ThrottleMessage('Too many login attempts. Please try again later.')
	@HttpCode(200)
	@Post('login')
	@ApiOperation({ summary: 'Admin login' })
	@ApiResponse({ status: 200, description: 'Successful login' })
	@ApiResponse({ status: 401, description: 'Invalid password or login' })
	async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: FastifyReply) {
		const data = await this.authService.login(dto, ERoleNames.ADMIN)

		response.setCookie('refresh_token', data.refreshToken, {
			maxAge: 30 * 24 * 60 * 60,
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
}
