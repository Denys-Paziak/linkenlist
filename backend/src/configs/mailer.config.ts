import type { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface'
import { ConfigModule, ConfigService } from '@nestjs/config'

export function getMailerConfig(): MailerAsyncOptions {
	return {
		imports: [ConfigModule],
		inject: [ConfigService],
		useFactory: (configService: ConfigService) => ({
			transport: {
				host: configService.getOrThrow<string>('MAIL_HOST'),
				port: configService.getOrThrow<number>('MAIL_PORT'),
				secure: configService.getOrThrow<boolean>('MAIL_SECURE') === true || configService.getOrThrow<string>('MAIL_SECURE') === 'true',
				auth: {
					user: configService.getOrThrow<string>('MAIL_USER'),
					pass: configService.getOrThrow<string>('MAIL_PASSWORD')
				},
				connectionTimeout: 5000,
				greetingTimeout: 5000,
				socketTimeout: 10000 
			},
			defaults: {
				from: `"Команда Sommeri" ${configService.getOrThrow<string>('MAIL_USER')}`
			}
		})
	}
}
