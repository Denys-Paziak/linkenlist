import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { SettingSystemService } from '../setting/services/setting-system.service'

@Injectable()
export class MailService {
	constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService,
		private readonly settingSystemService: SettingSystemService
	) {}

	async sendEmailForgotPassword(to: string, token: string, expires: string = '15 min.') {
		const baseUrl = this.configService.getOrThrow('FORGOT_PASSWORD_FRONT_URL')
		const url = `${baseUrl}?token=${encodeURIComponent(token)}`

		const message = await this.settingSystemService.getEmailMessage('Password Reset')

		const PRIMARY = '#2563eb'
		const PRIMARY_SOFT_BG = '#eff6ff'
		const BORDER = '#e5e7eb'
		const TEXT = '#111827'
		const MUTED = '#6b7280'
		const BG = '#f8fafc'
		const CARD_BG = '#ffffff'

		await this.mailerService.sendMail({
			to,
			subject: 'Password Reset',
			html: `<!doctype html>
				<html lang="en">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<meta name="x-apple-disable-message-reformatting" />
					<title>Password reset</title>
				</head>

				<body style="margin:0;padding:0;background:${BG};">
					<!-- Preheader (hidden) -->
					<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
					Reset your password. This link expires in ${expires} .
					</div>

					<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BG};">
					<tr>
						<td align="center" style="padding:32px 16px;">
						<!-- Container -->
						<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:100%;">
							<!-- Header -->
							<tr>
							<td style="padding:0 0 12px 0;">
								<div style="font-family:Arial,Helvetica,sans-serif;color:${MUTED};font-size:12px;line-height:18px;text-align:left;">
								Security notification
								</div>
							</td>
							</tr>

							<!-- Card -->
							<tr>
							<td style="background:${CARD_BG};border:1px solid ${BORDER};border-radius:12px;box-shadow:0 1px 2px rgba(0,0,0,0.05);">
								<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
								<tr>
									<td style="padding:28px 28px 12px 28px;">
									<h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:28px;line-height:34px;color:${TEXT};font-weight:700;">
										Reset your password
									</h1>
									</td>
								</tr>

								<tr>
									<td style="padding:0 28px 18px 28px;">
									<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:24px;color:${MUTED};">
										${message}
									</p>
									</td>
								</tr>

								<!-- CTA -->
								<tr>
									<td style="padding:0 28px 18px 28px;">
									<table role="presentation" cellpadding="0" cellspacing="0" border="0">
										<tr>
										<td bgcolor="${PRIMARY}" style="border-radius:10px;">
											<a href="${url}" target="_blank"
											style="display:inline-block;padding:12px 18px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:20px;color:#ffffff;text-decoration:none;font-weight:700;border-radius:10px;">
											Reset password
											</a>
										</td>
										</tr>
									</table>
									</td>
								</tr>

								<!-- Expiration pill -->
								<tr>
									<td style="padding:0 28px 18px 28px;">
									<span style="display:inline-block;padding:6px 10px;background:${PRIMARY_SOFT_BG};border:1px solid rgba(37,99,235,0.18);color:${PRIMARY};border-radius:999px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:16px;font-weight:700;">
										Expires in ${expires} 
									</span>
									</td>
								</tr>

								<tr>
									<td style="padding:0 28px 20px 28px;">
										<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:${MUTED};">
											If the button doesn’t work, paste this link into your browser:
											<br />
											<a href="${url}" target="_blank" style="color:${PRIMARY};text-decoration:underline;word-break:break-all;">
												${url}
											</a>
										</p>
									</td>
								</tr>

								<tr>
									<td style="padding:0 28px 24px 28px;">
									<hr style="border:none;border-top:1px solid ${BORDER};margin:0 0 16px 0;" />
									<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:${MUTED};">
										If you did not request a password reset, you can safely ignore this email.
									</p>
									</td>
								</tr>
								</table>
							</td>
							</tr>

							<!-- Footer -->
							<tr>
							<td style="padding:14px 4px 0 4px;text-align:left;">
								<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:${MUTED};">
								This is an automated message. Please do not reply.
								</p>
							</td>
							</tr>

						</table>
						</td>
					</tr>
					</table>
				</body>
			</html>`
		})
	}

	async sendEmailVerified(to: string, token: string, confirmUrl: string, expires: string = '15 min.') {
		const url = `${confirmUrl}?token=${encodeURIComponent(token)}`

		const message = await this.settingSystemService.getEmailMessage('Email Verification')

		const PRIMARY = '#2563eb'
		const PRIMARY_SOFT_BG = '#eff6ff'
		const BORDER = '#e5e7eb'
		const TEXT = '#111827'
		const MUTED = '#6b7280'
		const BG = '#f8fafc'
		const CARD_BG = '#ffffff'

		await this.mailerService.sendMail({
			to,
			subject: 'Email Verification',
			html: `<!doctype html>
			<html lang="en">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<meta name="x-apple-disable-message-reformatting" />
					<title>Email verification</title>
				</head>

				<body style="margin:0;padding:0;background:${BG};">
					<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
					Confirm your email address. This link expires in ${expires}.
					</div>

					<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BG};">
					<tr>
						<td align="center" style="padding:32px 16px;">
						<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:100%;">
							<tr>
							<td style="padding:0 0 12px 0;">
								<div style="font-family:Arial,Helvetica,sans-serif;color:${MUTED};font-size:12px;line-height:18px;text-align:left;">
								Account setup
								</div>
							</td>
							</tr>

							<tr>
							<td style="background:${CARD_BG};border:1px solid ${BORDER};border-radius:12px;box-shadow:0 1px 2px rgba(0,0,0,0.05);">
								<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
								<tr>
									<td style="padding:28px 28px 12px 28px;">
									<h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:28px;line-height:34px;color:${TEXT};font-weight:700;">
										Confirm your email
									</h1>
									</td>
								</tr>

								<tr>
									<td style="padding:0 28px 18px 28px;">
									<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:24px;color:${MUTED};">
										${message}
									</p>
									</td>
								</tr>

								<tr>
									<td style="padding:0 28px 18px 28px;">
									<table role="presentation" cellpadding="0" cellspacing="0" border="0">
										<tr>
										<td bgcolor="${PRIMARY}" style="border-radius:10px;">
											<a href="${url}" target="_blank"
											style="display:inline-block;padding:12px 18px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:20px;color:#ffffff;text-decoration:none;font-weight:700;border-radius:10px;">
											Confirm email
											</a>
										</td>
										</tr>
									</table>
									</td>
								</tr>

								<tr>
									<td style="padding:0 28px 18px 28px;">
									<span style="display:inline-block;padding:6px 10px;background:${PRIMARY_SOFT_BG};border:1px solid rgba(37,99,235,0.18);color:${PRIMARY};border-radius:999px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:16px;font-weight:700;">
										Expires in ${expires}
									</span>
									</td>
								</tr>

								<tr>
									<td style="padding:0 28px 20px 28px;">
									<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:${MUTED};">
										If the button doesn’t work, paste this link into your browser:
										<br />
										<a href="${url}" target="_blank" style="color:${PRIMARY};text-decoration:underline;word-break:break-all;">
										${url}
										</a>
									</p>
									</td>
								</tr>

								<tr>
									<td style="padding:0 28px 24px 28px;">
									<hr style="border:none;border-top:1px solid ${BORDER};margin:0 0 16px 0;" />
									<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:${MUTED};">
										If you did not register an account, simply ignore this email.
									</p>
									</td>
								</tr>

								</table>
							</td>
							</tr>

							<tr>
							<td style="padding:14px 4px 0 4px;text-align:left;">
								<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:${MUTED};">
								This is an automated message. Please do not reply.
								</p>
							</td>
							</tr>

						</table>
						</td>
					</tr>
					</table>
				</body>
			</html>`
		})
	}
}
