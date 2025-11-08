import { readFileSync } from 'fs'
import { join } from 'path'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitSchema1762505101190 implements MigrationInterface {
    name = 'InitSchema1762505101190'

	public async up(q: QueryRunner): Promise<void> {
		const sql = readFileSync(join(__dirname, '..', 'sql', 'schema.sql'), 'utf8')
		await q.query(sql)

		await q.query('SET LOCAL search_path TO public')
	}
	public async down(): Promise<void> {}
}
