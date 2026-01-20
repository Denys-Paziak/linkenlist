import { Controller, Get, Param, Patch, Query, Req } from '@nestjs/common'
import type { FastifyRequest } from 'fastify'

import { OptionalAuthorization } from '../../../decorators/optional-auth.decorator'
import { ParamId } from '../../../dtos/ParamId.dto'
import { GetAllLinksDto } from '../dtos/GetAllLinks.dto'
import { LinkCommandService } from '../services/link-command.service'
import { LinkQueryService } from '../services/link-query.service'
import { ITokenUser } from '../../../interfaces/ITokenUser'
import { LinkSystemService } from '../services/link-system.service'

@Controller('links')
export class LinkController {
	constructor(
		private readonly linkQueryService: LinkQueryService,
		private readonly linkCommandService: LinkCommandService,
		private readonly linkSystemService: LinkSystemService
	) {}

	@OptionalAuthorization()
	@Get()
	async getAllLinks(@Req() request: FastifyRequest, @Query() query: GetAllLinksDto) {
		const userFromToken = request.user as ITokenUser | undefined

		return await this.linkQueryService.getAllLinks(query, userFromToken?.id)
	}

	@OptionalAuthorization()
	@Patch(':id/add-view')
	async addView(@Req() request: FastifyRequest, @Param() params: ParamId) {
		const dealId = Number(params.id)

		const userId = (request as any).user?.id as number | undefined
		const viewerKey = userId ? `u:${userId}` : `ip:${request.ip}`

		const counted = await this.linkSystemService.markViewedOnce({
			dealId,
			viewerKey,
			ttlMs: 10 * 60 * 60 * 1000
		})

		if (counted) {
			await this.linkCommandService.addView(dealId)
		}

		return {
			ok: true
		}
	}
}
