import { Controller, Get, Param, Patch, Query, Req } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import type { FastifyRequest } from 'fastify'

import { Authorization } from '../../../decorators/auth.decorator'
import { OptionalAuthorization } from '../../../decorators/optional-auth.decorator'
import { ParamId } from '../../../dtos/ParamId.dto'
import { ParamSlug } from '../../../dtos/ParamSlug.dto'
import { ERoleName } from '../../../interfaces/ERoleName'
import { ITokenUser } from '../../../interfaces/ITokenUser'
import { GetAllResourcesDto } from '../dtos/GetAllResources.dto'
import { ResourceCommandService } from '../services/resource-command.service'
import { ResourceQueryService } from '../services/resource-query.service'
import { ResourceSystemService } from '../services/resource-system.service'

@Controller('resources')
export class ResourceController {
	constructor(
		private readonly resourceQueryService: ResourceQueryService,
		private readonly resourceCommandService: ResourceCommandService,
		private readonly resourceSystemService: ResourceSystemService
	) {}

	@Get(':slug')
	async getOneResource(@Param() params: ParamSlug) {
		return await this.resourceQueryService.getOneResource(params.slug)
	}

	@Get(':id/helpful')
	async getResourceHelpful(@Param() params: ParamId) {
		return await this.resourceQueryService.getResourceHelpful(params.id)
	}

	@OptionalAuthorization()
	@Get()
	async getAllDeals(@Req() request: FastifyRequest, @Query() query: GetAllResourcesDto) {
		const userFromToken = request.user as ITokenUser | undefined

		return await this.resourceQueryService.getAllResources(query, userFromToken?.id)
	}

	@OptionalAuthorization()
	@Patch(':id/add-view')
	async addView(@Req() request: FastifyRequest, @Param() params: ParamId) {
		const dealId = Number(params.id)

		const userId = (request as any).user?.id as number | undefined
		const viewerKey = userId ? `u:${userId}` : `ip:${request.ip}`

		const counted = await this.resourceSystemService.markViewedOnce({
			dealId,
			viewerKey,
			ttlMs: 10 * 60 * 60 * 1000
		})

		if (counted) {
			await this.resourceCommandService.addView(dealId)
		}

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.USER)
	@Patch(':id/toggle-helpful')
	async toggleHelpful(@Req() request: FastifyRequest, @Param() params: ParamId) {
		const userFromToken = request.user as ITokenUser

		return await this.resourceCommandService.toggleHelpful(params.id, userFromToken.id)
	}
}
