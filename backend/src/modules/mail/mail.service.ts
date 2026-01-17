import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { SettingSystemService } from '../setting/services/setting-system.service'

@Injectable()
export class MailService {
	private PRIMARY = '#2563eb'
	private PRIMARY_SOFT_BG = '#eff6ff'
	private BORDER = '#e5e7eb'
	private TEXT = '#111827'
	private MUTED = '#6b7280'
	private BG = '#f8fafc'
	private CARD_BG = '#ffffff'

	private ses: SESClient

	constructor(
		private readonly configService: ConfigService,
		private readonly settingSystemService: SettingSystemService
	) {
		this.ses = new SESClient({
			region: this.configService.getOrThrow<string>('AWS_REGION'),
			credentials: {
				accessKeyId: this.configService.getOrThrow<string>('SES_ACCESS_KEY'),
				secretAccessKey: this.configService.getOrThrow<string>('SES_SECRET_KEY')
			}
		})
	}

	private async send(to: string, subject: string, html: string) {
		const from = this.configService.getOrThrow<string>('MAIL_FROM')
		const replyTo = this.configService.get<string>('MAIL_REPLY_TO')

		const cmd = new SendEmailCommand({
			Source: from,
			Destination: { ToAddresses: [to] },
			ReplyToAddresses: replyTo ? [replyTo] : undefined,
			Message: {
				Subject: { Data: subject, Charset: 'UTF-8' },
				Body: {
					Html: { Data: html, Charset: 'UTF-8' }
				}
			}
		})

		return this.ses.send(cmd)
	}

	async sendEmailForgotPassword(to: string, token: string, expires: string = '15 min.') {
		const baseUrl = this.configService.getOrThrow('FORGOT_PASSWORD_FRONT_URL')
		const url = `${baseUrl}?token=${encodeURIComponent(token)}`

		const message = await this.settingSystemService.getEmailMessage('Password Reset')

		await this.send(
			to,
			'Password Reset',
			`<!doctype html>
				<html lang="en">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<meta name="x-apple-disable-message-reformatting" />
					<title>Password reset</title>
				</head>

				<body style="margin:0;padding:0;background:${this.BG};">
					<!-- Preheader (hidden) -->
					<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
					Reset your password. This link expires in ${expires} .
					</div>

					<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${this.BG};">
					<tr>
						<td align="center" style="padding:32px 16px;">
						<!-- Container -->
						<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:100%;">
							<!-- Header -->
							<tr>
							<td style="padding:0 0 12px 0;">
								<div style="font-family:Arial,Helvetica,sans-serif;color:${this.MUTED};font-size:12px;line-height:18px;text-align:left;">
								Security notification
								</div>
							</td>
							</tr>

							<!-- Card -->
							<tr>
							<td style="background:${this.CARD_BG};border:1px solid ${this.BORDER};border-radius:12px;box-shadow:0 1px 2px rgba(0,0,0,0.05);">
								<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
								<tr>
									<td style="padding:28px 28px 12px 28px;">
									<h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:28px;line-height:34px;color:${this.TEXT};font-weight:700;">
										Reset your password
									</h1>
									</td>
								</tr>

								<tr>
									<td style="padding:0 28px 18px 28px;">
									<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:24px;color:${this.MUTED};">
										${message}
									</p>
									</td>
								</tr>

								<!-- CTA -->
								<tr>
									<td style="padding:0 28px 18px 28px;">
									<table role="presentation" cellpadding="0" cellspacing="0" border="0">
										<tr>
										<td bgcolor="${this.PRIMARY}" style="border-radius:10px;">
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
									<span style="display:inline-block;padding:6px 10px;background:${this.PRIMARY_SOFT_BG};border:1px solid rgba(37,99,235,0.18);color:${this.PRIMARY};border-radius:999px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:16px;font-weight:700;">
										Expires in ${expires} 
									</span>
									</td>
								</tr>

								<tr>
									<td style="padding:0 28px 20px 28px;">
										<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:${this.MUTED};">
											If the button doesn’t work, paste this link into your browser:
											<br />
											<a href="${url}" target="_blank" style="color:${this.PRIMARY};text-decoration:underline;word-break:break-all;">
												${url}
											</a>
										</p>
									</td>
								</tr>

								<tr>
									<td style="padding:0 28px 24px 28px;">
									<hr style="border:none;border-top:1px solid ${this.BORDER};margin:0 0 16px 0;" />
									<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:${this.MUTED};">
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
								<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:${this.MUTED};">
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
		)
	}

	async sendEmailVerified(to: string, token: string, confirmUrl: string, expires: string = '15 min.') {
		const url = `${confirmUrl}?token=${encodeURIComponent(token)}`

		const message = await this.settingSystemService.getEmailMessage('Email Verification')

		await this.send(
			to,
			'Email Verification',
			`<!doctype html>
			<html lang="en">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<meta name="x-apple-disable-message-reformatting" />
					<title>Email verification</title>
				</head>

				<body style="margin:0;padding:0;background:${this.BG};">
					<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
					Confirm your email address. This link expires in ${expires}.
					</div>

					<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${this.BG};">
					<tr>
						<td align="center" style="padding:32px 16px;">
						<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:100%;">
							<tr>
							<td style="padding:0 0 12px 0;">
								<div style="font-family:Arial,Helvetica,sans-serif;color:${this.MUTED};font-size:12px;line-height:18px;text-align:left;">
								Account setup
								</div>
							</td>
							</tr>

							<tr>
							<td style="background:${this.CARD_BG};border:1px solid ${this.BORDER};border-radius:12px;box-shadow:0 1px 2px rgba(0,0,0,0.05);">
								<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
								<tr>
									<td style="padding:28px 28px 12px 28px;">
									<h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:28px;line-height:34px;color:${this.TEXT};font-weight:700;">
										Confirm your email
									</h1>
									</td>
								</tr>

								<tr>
									<td style="padding:0 28px 18px 28px;">
									<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:24px;color:${this.MUTED};">
										${message}
									</p>
									</td>
								</tr>

								<tr>
									<td style="padding:0 28px 18px 28px;">
									<table role="presentation" cellpadding="0" cellspacing="0" border="0">
										<tr>
										<td bgcolor="${this.PRIMARY}" style="border-radius:10px;">
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
									<span style="display:inline-block;padding:6px 10px;background:${this.PRIMARY_SOFT_BG};border:1px solid rgba(37,99,235,0.18);color:${this.PRIMARY};border-radius:999px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:16px;font-weight:700;">
										Expires in ${expires}
									</span>
									</td>
								</tr>

								<tr>
									<td style="padding:0 28px 20px 28px;">
									<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:${this.MUTED};">
										If the button doesn’t work, paste this link into your browser:
										<br />
										<a href="${url}" target="_blank" style="color:${this.PRIMARY};text-decoration:underline;word-break:break-all;">
										${url}
										</a>
									</p>
									</td>
								</tr>

								<tr>
									<td style="padding:0 28px 24px 28px;">
									<hr style="border:none;border-top:1px solid ${this.BORDER};margin:0 0 16px 0;" />
									<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:${this.MUTED};">
										If you did not register an account, simply ignore this email.
									</p>
									</td>
								</tr>

								</table>
							</td>
							</tr>

							<tr>
							<td style="padding:14px 4px 0 4px;text-align:left;">
								<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:${this.MUTED};">
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
		)
	}

	async sendListingExpirationReminder(to: string, listingTitle: string, expires: number) {
		const message = `Your real estate listing will expire in ${expires} days. Please renew your listing to keep it active on LinkEnlist.`

		await this.send(
			to,
			'Listing Expiration',
			`<!doctype html>
				<html lang="en">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<meta name="x-apple-disable-message-reformatting" />
					<title>Listing expiration</title>
				</head>

				<body style="margin:0;padding:0;background:${this.BG};">
					<!-- Preheader (hidden) -->
					<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
					Your listing "${listingTitle}" will expire in ${expires} days.
					</div>

					<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${this.BG};">
					<tr>
						<td align="center" style="padding:32px 16px;">
						<!-- Container -->
						<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:100%;">
							<!-- Header -->
							<tr>
							<td style="padding:0 0 12px 0;">
								<div style="font-family:Arial,Helvetica,sans-serif;color:${this.MUTED};font-size:12px;line-height:18px;text-align:left;">
								Listing notification
								</div>
							</td>
							</tr>

							<!-- Card -->
							<tr>
							<td style="background:${this.CARD_BG};border:1px solid ${this.BORDER};border-radius:12px;box-shadow:0 1px 2px rgba(0,0,0,0.05);">
								<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
								<tr>
									<td style="padding:28px 28px 12px 28px;">
									<h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:28px;line-height:34px;color:${this.TEXT};font-weight:700;">
										Listing expiring soon
									</h1>
									</td>
								</tr>

								<tr>
									<td style="padding:0 28px 14px 28px;">
									<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:24px;color:${this.MUTED};">
										${message}
									</p>
									</td>
								</tr>

								<!-- Listing title -->
								<tr>
									<td style="padding:0 28px 18px 28px;">
									<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
										style="background:${this.BG};border:1px solid ${this.BORDER};border-radius:10px;">
										<tr>
										<td style="padding:12px 14px;">
											<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:16px;color:${this.MUTED};font-weight:700;letter-spacing:0.2px;text-transform:uppercase;">
											Listing
											</div>
											<div style="margin-top:4px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:${this.TEXT};font-weight:700;">
											${listingTitle}
											</div>
										</td>
										</tr>
									</table>
									</td>
								</tr>

								<!-- Expiration pill -->
								<tr>
									<td style="padding:0 28px 18px 28px;">
									<span style="display:inline-block;padding:6px 10px;background:${this.PRIMARY_SOFT_BG};border:1px solid rgba(37,99,235,0.18);color:${this.PRIMARY};border-radius:999px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:16px;font-weight:700;">
										Expires in ${expires} days
									</span>
									</td>
								</tr>

								<!-- Optional hint -->
								<tr>
									<td style="padding:0 28px 24px 28px;">
									<hr style="border:none;border-top:1px solid ${this.BORDER};margin:0 0 16px 0;" />
									<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:${this.MUTED};">
										This is an automated reminder. If you already renewed your listing, you can safely ignore this email.
									</p>
									</td>
								</tr>
								</table>
							</td>
							</tr>

							<!-- Footer -->
							<tr>
							<td style="padding:14px 4px 0 4px;text-align:left;">
								<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:${this.MUTED};">
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
		)
	}
}
