import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModuleAsyncOptions } from '@nestjs/jwt'

export function getJWTConfig(): JwtModuleAsyncOptions {
	return {
		global: true,
		imports: [ConfigModule],
		inject: [ConfigService],
		useFactory: (configService: ConfigService) => ({
			secret: configService.get<string>('JWT_ACCESS_SECRET_KEY')
		})
	}
}
