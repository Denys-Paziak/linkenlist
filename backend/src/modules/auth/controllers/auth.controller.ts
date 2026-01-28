import { Body, Controller, Get, HttpCode, Patch, Post, Query, Req, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Throttle } from '@nestjs/throttler'
import type { FastifyReply, FastifyRequest } from 'fastify'

import { ThrottleMessage } from '../../../decorators/throttle-message.decorator'
import { ERoleName } from '../../../interfaces/ERoleName'
import { UseTurnstile } from '../../turnstile/turnstile.decorator'
import { ConfirmEmailDto } from '../dtos/ConfirmEmail.dto'
import { ForgotPasswordDto } from '../dtos/ForgotPassword.dto'
import { LoginDto } from '../dtos/Login.dto'
import { RegistrationDto } from '../dtos/Registration.dto'
import { ResendConfirmationEmailDto } from '../dtos/ResendConfirmationEmail.dto'
import { ResetPasswordDto } from '../dtos/ResetPassword.dto'
import { AuthService } from '../services/auth.service'
import { ITokenUser } from '../../../interfaces/ITokenUser'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService
	) {}

	@UseTurnstile()
	@Post('register')
	async registration(@Body() dto: RegistrationDto) {
		await this.authService.register(dto)
	}

	@Post('resend-confirmation-email')
	async resendConfirmationEmail(@Body() dto: ResendConfirmationEmailDto) {
		await this.authService.resendConfirmationEmail(dto.email)
	}

	@Get('confirm-email')
	async confirmEmail(@Query() query: ConfirmEmailDto, @Res({ passthrough: true }) response: FastifyReply) {
		try {
			const data = await this.authService.confirmEmail(query.token)

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

			return response.redirect(this.configService.getOrThrow('CONFIRM_EMAIL_FRONT_URL'), 302)
		} catch (error) {
			return response.redirect(
				this.configService.getOrThrow('CONFIRM_EMAIL_FRONT_URL') + '?message=' + (error as any).message,
				302
			)
		}
	}

	@Get('google/login')
	startGoogle(@Res({ passthrough: true }) response: FastifyReply) {
		return response.redirect(
			this.configService.getOrThrow('SERVER_URL') + this.configService.getOrThrow('GOOGLE_LOGIN_PATH'),
			302
		)
	}

	@Get('google/callback')
	async googleCallback(@Req() request: FastifyRequest, @Res({ passthrough: true }) response: FastifyReply) {
		try {
			const { token } = await (request as any).server.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)

			const data = await this.authService.googleLogin(token.id_token)

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

			return response.redirect(this.configService.getOrThrow('FRONT_ORIGIN_URL'), 302)
		} catch (error) {
			return response.redirect(
				this.configService.getOrThrow('GOOGLE_CALLBACK_ERROR') + '?error=' + (error as any).message,
				302
			)
		}
	}

	@Post('login')
	@UseTurnstile()
	@Throttle({ default: { limit: 10, ttl: 5 * 60 * 1000 } })
	@ThrottleMessage('Too many login attempts. Please try again later.')
	@HttpCode(200)
	async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: FastifyReply) {
		const data = await this.authService.login(dto, ERoleName.USER)

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

	@HttpCode(200)
	@Post('logout')
	async logout(@Req() request: FastifyRequest, @Res({ passthrough: true }) response: FastifyReply) {
		const refresh_token = request.cookies['refresh_token']

		await this.authService.logout(refresh_token)

		response.clearCookie('refresh_token', {
			maxAge: 30 * 24 * 60 * 60,
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

	@HttpCode(200)
	@Post('forgot-password')
	async forgotPassword(@Body() dto: ForgotPasswordDto) {
		await this.authService.forgotPassword(dto)

		return { ok: true }
	}

	@HttpCode(200)
	@Patch('reset-password')
	async resetPassword(@Body() dto: ResetPasswordDto) {
		await this.authService.resetPassword(dto)

		return { ok: true }
	}

	@Post('refresh')
	async refreshToken(@Req() request: FastifyRequest, @Res({ passthrough: true }) response: FastifyReply) {
		const refresh_token = request.cookies['refresh_token']

		const data = await this.authService.refreshToken(refresh_token)
		response.cookie('refresh_token', data.refreshToken, {
			maxAge: data.role === ERoleName.ADMIN ? 24 * 60 * 60 : 30 * 24 * 60 * 60,
			httpOnly: true,
			secure: this.configService.getOrThrow('NODE_ENV') === 'production',
			sameSite: 'strict',
			path: '/'
		})
		response.cookie('access_token', data.accessToken, {
			maxAge: 5 * 60,
			httpOnly: true,
			secure: this.configService.getOrThrow('NODE_ENV') === 'production',
			sameSite: 'strict',
			path: '/'
		})

		return { ok: true }
	}
}
