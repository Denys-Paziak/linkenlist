import { SharedBullAsyncConfiguration } from '@nestjs/bullmq'
import { ConfigModule, ConfigService } from '@nestjs/config'

export function getBullmqConfig(): SharedBullAsyncConfiguration {
	return {
		imports: [ConfigModule],
		inject: [ConfigService],
		useFactory: (configService: ConfigService) => ({
			connection: {
				host: configService.getOrThrow<string>('REDIS_HOST'),
				port: configService.getOrThrow<number>('REDIS_PORT')
			}
		})
	}
}
