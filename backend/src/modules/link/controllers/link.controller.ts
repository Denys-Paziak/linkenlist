import { Controller, Get, Param, Patch, Query, Req } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import type { FastifyRequest } from 'fastify'

import { OptionalAuthorization } from '../../../decorators/optional-auth.decorator'
import { ParamId } from '../../../dtos/ParamId.dto'
import { GetAllLinksDto } from '../dtos/GetAllLinks.dto'
import { LinkCommandService } from '../services/link-command.service'
import { LinkQueryService } from '../services/link-query.service'
import { ITokenUser } from '../../../interfaces/ITokenUser'

@Controller('links')
export class LinkController {
	constructor(
		private readonly linkQueryService: LinkQueryService,
		private readonly linkCommandService: LinkCommandService
	) {}

	@OptionalAuthorization()
	@Get()
	async getAllLinks(@Req() request: FastifyRequest, @Query() query: GetAllLinksDto) {
		const userFromToken = request.user as ITokenUser | undefined

		return await this.linkQueryService.getAllLinks(query, userFromToken?.id)
	}

	@Throttle({ default: { limit: 1, ttl: 60 * 60 * 1000 } })
	@Patch(':id/add-view')
	async addView(@Param() param: ParamId) {
		await this.linkCommandService.addView(param.id)

		return {
			ok: true
		}
	}
}
