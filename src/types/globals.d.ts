import { FastifyRequest } from 'fastify'

import { IMultipartFile } from '@/interfaces/IMultipartFile'

declare module 'fastify' {
	interface FastifyRequest {
		user?: any
		storedFiles: Record<string, IMultipartFile[]>
		body: unknown
	}
}
