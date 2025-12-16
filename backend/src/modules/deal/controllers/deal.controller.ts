import { Controller, Get, Param, Patch, Query, Req } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import type { FastifyRequest } from 'fastify'

import { Authorization } from '../../../decorators/auth.decorator'
import { ParamId } from '../../../dtos/ParamId.dto'
import { ParamSlug } from '../../../dtos/ParamSlug.dto'
import { ERoleName } from '../../../interfaces/ERoleName'
import { ITokenUser } from '../../../interfaces/ITokenUser'
import { GetAllDealsDto } from '../dtos/GetAllDeals.dto'
import { DealCommandService } from '../services/deal-command.service'
import { DealQueryService } from '../services/deal-query.service'
import { OptionalAuthorization } from '../../../decorators/optional-auth.decorator'

@Controller('deals')
export class DealController {
	constructor(
		private readonly dealQueryService: DealQueryService,
		private readonly dealCommandService: DealCommandService
	) {}

	@Get(':slug')
	async getOneDeal(@Param() params: ParamSlug) {
		return await this.dealQueryService.getOneDeal(params.slug)
	}

	@Get(':id/helpful')
	async getDealHelpful(@Param() params: ParamId) {
		return await this.dealQueryService.getDealHelpful(params.id)
	}

	@OptionalAuthorization()
	@Get()
	async getAllDeals(@Req() request: FastifyRequest, @Query() query: GetAllDealsDto) {
		const userFromToken = request.user as ITokenUser | undefined

		return await this.dealQueryService.getAllDeals(query, userFromToken?.id)
	}

	@Throttle({ default: { limit: 1, ttl: 60 * 60 * 1000 } })
	@Patch(':id/add-view')
	async addView(@Param() params: ParamId) {
		await this.dealCommandService.addView(params.id)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.USER)
	@Patch(':id/add-helpful')
	async addHelpful(@Req() request: FastifyRequest, @Param() params: ParamId) {
		const userFromToken = request.user as ITokenUser

		await this.dealCommandService.addHelpful(params.id, userFromToken.id)

		return {
			ok: true
		}
	}
}
