import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { ImageWorkerModule } from './modules/image-queue/image-worker.module'

async function bootstrap() {
	const app = await NestFactory.createApplicationContext(ImageWorkerModule, {
		logger: ['log', 'error', 'warn']
	})

	const logger = new Logger('ImageWorker')

	app.enableShutdownHooks()

	process.on('SIGINT', async () => {
		logger.log('SIGINT received, shutting down...')
		await app.close()
		process.exit(0)
	})

	process.on('SIGTERM', async () => {
		logger.log('SIGTERM received, shutting down...')
		await app.close()
		process.exit(0)
	})

	logger.log('Image worker started ✅')
}
bootstrap()
