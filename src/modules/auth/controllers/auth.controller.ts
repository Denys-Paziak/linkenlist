import { Body, Controller, Get, HttpCode, Patch, Post, Query, Req, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOAuth2, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import type { FastifyReply, FastifyRequest } from 'fastify'


import { ConfirmEmailDto } from '../dtos/ConfirmEmail.dto'
import { ForgotPasswordDto } from '../dtos/ForgotPassword.dto'
import { LoginDto } from '../dtos/Login.dto'
import { RegistrationDto } from '../dtos/Registration.dto'
import { ResendConfirmationEmailDto } from '../dtos/ResendConfirmationEmail.dto'
import { ResetPasswordDto } from '../dtos/ResetPassword.dto'
import { AuthService } from '../services/auth.service'
import { ThrottleMessage } from '../../../decorators/throttle-message.decorator'

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService
	) {}

	@Post('signup')
	@ApiOperation({ summary: 'User registration' })
	@ApiResponse({ status: 201, description: 'User successfully registered' })
	@ApiResponse({ status: 409, description: 'A user with this email address is already registered.' })
	async registration(@Body() dto: RegistrationDto) {
		await this.authService.register(dto)
	}

	@Post('resend-confirmation-email')
	@ApiOperation({ summary: 'Resend email confirmation' })
	@ApiResponse({ status: 200, description: 'Confirmation email resent' })
	@ApiResponse({ status: 404, description: 'User not found' })
	@ApiResponse({ status: 400, description: 'Email is already confirmed' })
	async resendConfirmationEmail(@Body() dto: ResendConfirmationEmailDto) {
		await this.authService.resendConfirmationEmail(dto.email)
	}

	@Get('confirm-email')
	@ApiOperation({ summary: 'Email confirmation' })
	@ApiResponse({ status: 302, description: 'Email successfully confirmed' })
	@ApiResponse({ status: 400, description: 'Invalid email confirmation token' })
	async confirmEmail(@Query() query: ConfirmEmailDto, @Res({ passthrough: true }) response: FastifyReply) {
		const message = await this.authService.confirmEmail(query.token)

		return response.redirect(this.configService.getOrThrow('LOGIN_FRONT_URL') + (message ? '?message=' + message : ''), 302)
	}

	@Get('google/login')
	@ApiOperation({ summary: 'Start Google OAuth2 flow' })
	@ApiResponse({ status: 302, description: 'Redirect to Google consent screen' })
	startGoogle(@Res({ passthrough: true }) response: FastifyReply) {
		return response.redirect('/auth/google/start', 302)
	}

	@Get('google/callback')
	@ApiOperation({ summary: 'Google Authorization' })
	@ApiOAuth2(['google'])
	@ApiResponse({ status: 200, description: 'Google Authentication Successful' })
	@ApiResponse({ status: 409, description: 'User with this email is already registered' })
	async googleCallback(@Req() request: FastifyRequest, @Res({ passthrough: true }) response: FastifyReply) {
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
			maxAge: 30 * 60,
			httpOnly: true,
			secure: this.configService.getOrThrow('NODE_ENV') === 'production',
			sameSite: 'strict',
			path: '/'
		})

		return response.redirect(this.configService.getOrThrow('GOOGLE_CALLBACK_FRONT_URL'), 302)
	}

	@Throttle({ default: { limit: 10, ttl: 5 * 60 * 1000 } })
	@ThrottleMessage('Too many login attempts. Please try again later.')
	@HttpCode(200)
	@Post('login')
	@ApiOperation({ summary: 'User login' })
	@ApiResponse({ status: 200, description: 'Successful login' })
	@ApiResponse({ status: 401, description: 'Invalid password or login' })
	async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: FastifyReply) {
		const data = await this.authService.login(dto)

		response.setCookie('refresh_token', data.refreshToken, {
			maxAge: 30 * 24 * 60 * 60,
			httpOnly: true,
			secure: this.configService.getOrThrow('NODE_ENV') === 'production',
			sameSite: 'strict',
			path: '/'
		})
		response.setCookie('access_token', data.accessToken, {
			maxAge: 30 * 60,
			httpOnly: true,
			secure: this.configService.getOrThrow('NODE_ENV') === 'production',
			sameSite: 'strict',
			path: '/'
		})
	}

	@HttpCode(200)
	@Post('logout')
	@ApiOperation({ summary: 'Logout' })
	@ApiResponse({ status: 200, description: 'User logged out' })
	async logout(@Res({ passthrough: true }) response: FastifyReply) {
		response.clearCookie('refresh_token', {
			maxAge: 30 * 24 * 60 * 60,
			httpOnly: true,
			secure: this.configService.getOrThrow('NODE_ENV') === 'production',
			sameSite: 'strict',
			path: '/'
		})
		response.clearCookie('access_token', {
			maxAge: 30 * 60,
			httpOnly: true,
			secure: this.configService.getOrThrow('NODE_ENV') === 'production',
			sameSite: 'strict',
			path: '/'
		})
	}

	@HttpCode(200)
	@Post('forgot-password')
	@ApiOperation({ summary: 'Password reset request' })
	@ApiResponse({ status: 200, description: 'Password reset link sent to email' })
	async forgotPassword(@Body() dto: ForgotPasswordDto) {
		await this.authService.forgotPassword(dto)
	}

	@HttpCode(200)
	@Patch('reset-password')
	@ApiOperation({ summary: 'Reset password with token' })
	@ApiResponse({ status: 200, description: 'Password successfully changed' })
	@ApiResponse({ status: 400, description: 'Invalid token for password reset' })
	async resetPassword(@Body() dto: ResetPasswordDto) {
		await this.authService.resetPassword(dto)
	}

	async changeEmail() {}

	@Get('refresh')
	@ApiOperation({ summary: 'Update access and refresh tokens' })
	@ApiResponse({ status: 200, description: 'Tokens refreshed successfully' })
	@ApiResponse({ status: 401, description: 'Invalid refresh token' })
	async refreshToken(@Req() request: FastifyRequest, @Res({ passthrough: true }) response: FastifyReply) {
		const refresh_token = request.cookies['refresh_token']

		const data = await this.authService.refreshToken(refresh_token)
		response.cookie('refresh_token', data.refreshToken, {
			maxAge: 30 * 24 * 60 * 60,
			httpOnly: true,
			secure: this.configService.getOrThrow('NODE_ENV') === 'production',
			sameSite: 'strict',
			path: '/'
		})
		response.cookie('access_token', data.accessToken, {
			maxAge: 30 * 60,
			httpOnly: true,
			secure: this.configService.getOrThrow('NODE_ENV') === 'production',
			sameSite: 'strict',
			path: '/'
		})
	}
}
