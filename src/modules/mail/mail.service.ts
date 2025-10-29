import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class MailService {
	constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	async sendEmailForgotPassword(to: string, token: string, expiresInMinutes = 15) {
		await this.mailerService.sendMail({
			to,
			subject: 'Password reset',
			html: `
				<!doctype html>
				<html>
				<body style="font-family:Arial,Helvetica,sans-serif;line-height:1.5">
					<a href='${this.configService.getOrThrow('FORGOT_PASSWORD_FRONT_URL')}?token=${token}'>Reset code</a>
					<p>Expiration time: ${expiresInMinutes} min.</p>
					<hr />
					<small>If you did not request a password reset, simply ignore this email.</small>
				</body>
				</html>
			`
		})
	}

	async sendEmailVerified(to: string, token: string, expiresInMinutes = 15) {
		await this.mailerService.sendMail({
			to,
			subject: 'Email verified',
			html: `
				<!doctype html>
				<html>
				<body style="font-family:Arial,Helvetica,sans-serif;line-height:1.5">
					<a href='${this.configService.getOrThrow('CONFIRM_EMAIL_URL')}?token=${token}'>Confirm email</a>
					<p>Expiration time: ${expiresInMinutes} min.</p>
					<hr />
					<small>If you did not register an account, simply ignore this email.</small>
				</body>
				</html>
			`
		})
	}
}
