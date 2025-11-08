import { DataSource } from 'typeorm'
import dataSource from '../configs/typeorm.datasource'
import { ERoleNames } from '../interfaces/ERoleNames'

async function seedAdminRaw(ds: DataSource) {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com'
  const plain = process.env.ADMIN_PASSWORD || 'change-me-now'
  const name  = process.env.ADMIN_NAME || 'System Administrator'

  const bcrypt = await import('bcrypt')
  const hash = await bcrypt.hash(plain, Number(process.env.ADMIN_BCRYPT_ROUNDS || 10))

   await ds.query(
    `
    INSERT INTO public."users" ("private_email","password","role","first_name","last_name","username","email_verified")
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT ("private_email") DO UPDATE
      SET "role" = EXCLUDED."role",
          "password" = EXCLUDED."password",
          "first_name" = EXCLUDED."first_name",
          "last_name" = EXCLUDED."last_name",
          "username" = EXCLUDED."username",
          "email_verified" = EXCLUDED."email_verified"
    `,
    [email, hash, ERoleNames.ADMIN, name, name, name, true]
  )

  if (process.env.RESET_ADMIN_PASSWORD === 'true') {
    await ds.query(`UPDATE "users" SET "password" = $1 WHERE "private_email" = $2`, [hash, email])
  }
  console.log(`✅ Admin ensured: ${email}`)
}

async function main() {
	try {
		await dataSource.initialize()
    console.log('Loaded migrations:', dataSource.migrations.map(m => m.name))
		await dataSource.runMigrations()
        await seedAdminRaw(dataSource)
		await dataSource.destroy()
		console.log('Migrations: OK')
		process.exit(0)
	} catch (e) {
		console.error('Migrations failed:', e)
		process.exit(1)
	}
}
main()
