import { NestFactory } from '@nestjs/core'

import { ImageWorkerModule } from './modules/image-queue/image-worker.module'

async function bootstrap() {
	await NestFactory.createApplicationContext(ImageWorkerModule, {
		logger: ['log', 'error', 'warn']
	})
}
bootstrap()
