import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'

export function getPostgresConfig(): TypeOrmModuleAsyncOptions {
	return {
		imports: [ConfigModule],
		inject: [ConfigService],
		useFactory: (configService: ConfigService) => ({
			type: 'postgres',
			url: configService.getOrThrow<string>('DATABASE_URL'),
			autoLoadEntities: true,
			synchronize: configService.getOrThrow<boolean>('DATABASE_SYNCHRONIZE') === true || configService.getOrThrow<string>('DATABASE_SYNCHRONIZE') === 'true'
		})
	}
}
