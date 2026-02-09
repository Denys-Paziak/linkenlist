import cookie from '@fastify/cookie'
import helmet from '@fastify/helmet'
import multipart from '@fastify/multipart'
import fastifyOauth2 from '@fastify/oauth2'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

import { AppModule } from './modules/app.module'

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter({
			trustProxy: true,
			bodyLimit: 1_048_576
		}),
		{
			rawBody: true
		}
	)

	const config = app.get(ConfigService)

	app.useGlobalPipes(new ValidationPipe({ transform: true }))
	app.enableCors({
		credentials: true,
		origin: config.getOrThrow('FRONT_ORIGIN_URL'),
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
	})

	await app.register(multipart)
	const fastify = app.getHttpAdapter().getInstance()
	await fastify.register(cookie)

	await fastify.register(helmet, {
		contentSecurityPolicy: false,
		crossOriginEmbedderPolicy: false
	})

	await fastify.register(fastifyOauth2, {
		name: 'googleOAuth2',
		scope: ['openid', 'email', 'profile'],
		credentials: {
			client: {
				id: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
				secret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET')
			},
			auth: fastifyOauth2.GOOGLE_CONFIGURATION
		},
		startRedirectPath: config.getOrThrow<string>('GOOGLE_LOGIN_PATH'),

		callbackUri: config.getOrThrow<string>('GOOGLE_CALLBACK_URL')
	})

	await app.listen({ port: config.getOrThrow<number>('SERVER_PORT'), host: '0.0.0.0' })
}
bootstrap()
