import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'
import * as fs from 'node:fs'
import { join } from 'node:path'

export function getPostgresConfig(): TypeOrmModuleAsyncOptions {
	return {
		imports: [ConfigModule],
		inject: [ConfigService],
		useFactory: (cfg: ConfigService) => {
			const ca = fs.readFileSync(join(process.cwd(), 'certs', 'ca-certificate.crt'), 'utf8')
			return {
				type: 'postgres',
				url: cfg.getOrThrow<string>('DATABASE_URL'),
				autoLoadEntities: true,
				synchronize: cfg.get('DATABASE_SYNCHRONIZE') === true || cfg.get('DATABASE_SYNCHRONIZE') === 'true',
				ssl: { ca }
			}
		}
	}
}
