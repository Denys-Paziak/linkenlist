import KeyvRedis from '@keyv/redis'
import { CacheModuleAsyncOptions } from '@nestjs/cache-manager'
import { ConfigModule, ConfigService } from '@nestjs/config'

export function getCacheConfig(): CacheModuleAsyncOptions {
	return {
		imports: [ConfigModule],
		inject: [ConfigService],
		useFactory: async (configService: ConfigService) => {
			return {
				stores: new KeyvRedis(
					"redis://" + configService.getOrThrow<string>('REDIS_HOST') + ':' + configService.getOrThrow<number>('REDIS_PORT')
				)
			}
		},
		isGlobal: true
	}
}
