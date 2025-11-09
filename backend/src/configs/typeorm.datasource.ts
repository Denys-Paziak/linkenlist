import 'dotenv/config'
import path from 'path'
import { DataSource } from 'typeorm'

export default new DataSource({
	type: 'postgres',
	url: process.env.DATABASE_URL,
	ssl: (process.env.DB_SSL || '').toLowerCase() === 'true' ? { rejectUnauthorized: false } : false,
	migrations: [path.join(__dirname, '..', 'migrations', '*.js')],
	entities: [path.join(__dirname, '..', 'modules', '**', 'entities', '*.js')],
	synchronize: false,
	logging: false,
	migrationsTableName: 'migrations',
	schema: 'public'
})
