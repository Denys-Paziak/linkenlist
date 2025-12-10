import { Controller, Get, Param, Patch, Query, Req } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import type { FastifyRequest } from 'fastify'

import { Authorization } from '../../../decorators/auth.decorator'
import { ParamId } from '../../../dtos/ParamId.dto'
import { ParamSlug } from '../../../dtos/ParamSlug.dto'
import { ERoleName } from '../../../interfaces/ERoleName'
import { ITokenUser } from '../../../interfaces/ITokenUser'
import { GetAllResourcesDto } from '../dtos/GetAllResources.dto'
import { ResourceCommandService } from '../services/resource-command.service'
import { ResourceQueryService } from '../services/resource-query.service'

@Controller('resources')
export class ResourceController {
	constructor(
		private readonly resourceQueryService: ResourceQueryService,
		private readonly resourceCommandService: ResourceCommandService
	) {}

	@Get(':slug')
	async getOneResource(@Param() params: ParamSlug) {
		return await this.resourceQueryService.getOneResource(params.slug)
	}

	@Get(':id/helpful')
	async getResourceHelpful(@Param() params: ParamId) {
		return await this.resourceQueryService.getResourceHelpful(params.id)
	}

	@Get()
	async getAllDeals(@Query() query: GetAllResourcesDto) {
		return await this.resourceQueryService.getAllResources(query)
	}

	@Throttle({ default: { limit: 1, ttl: 60 * 60 * 1000 } })
	@Patch(':id/add-view')
	async addView(@Param() params: ParamId) {
		await this.resourceCommandService.addView(params.id)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.USER)
	@Patch(':id/add-helpful')
	async addHelpful(@Req() request: FastifyRequest, @Param() params: ParamId) {
		const userFromToken = request.user as ITokenUser

		await this.resourceCommandService.addHelpful(params.id, userFromToken.id)

		return {
			ok: true
		}
	}
}
