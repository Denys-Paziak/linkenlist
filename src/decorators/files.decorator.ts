import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import * as fastify from 'fastify'

import { IMultipartFile } from '../interfaces/IMultipartFile'

export const Files = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext): Record<string, IMultipartFile[]> | undefined => {
		const req = ctx.switchToHttp().getRequest() as fastify.FastifyRequest
		return req.storedFiles
	}
)
