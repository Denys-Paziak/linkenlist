import { Controller, Get, Param, Patch, Query, Req } from '@nestjs/common'
import type { FastifyRequest } from 'fastify'

import { Authorization } from '../../../decorators/auth.decorator'
import { OptionalAuthorization } from '../../../decorators/optional-auth.decorator'
import { ParamId } from '../../../dtos/ParamId.dto'
import { ParamSlug } from '../../../dtos/ParamSlug.dto'
import { ERoleName } from '../../../interfaces/ERoleName'
import { ITokenUser } from '../../../interfaces/ITokenUser'
import { GetAllDealsDto } from '../dtos/GetAllDeals.dto'
import { DealCommandService } from '../services/deal-command.service'
import { DealQueryService } from '../services/deal-query.service'
import { DealSystemService } from '../services/deal-system.service'

@Controller('deals')
export class DealController {
	constructor(
		private readonly dealQueryService: DealQueryService,
		private readonly dealCommandService: DealCommandService,
		private readonly dealSystemService: DealSystemService
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

	@OptionalAuthorization()
	@Patch(':id/add-view')
	async addView(@Req() request: FastifyRequest, @Param() params: ParamId) {
		const dealId = Number(params.id)

		const userId = (request as any).user?.id as number | undefined
		const viewerKey = userId ? `u:${userId}` : `ip:${request.ip}`

		const counted = await this.dealSystemService.markViewedOnce({
			dealId,
			viewerKey,
			ttlMs: 60 * 60 * 1000
		})

		if (counted) {
			await this.dealCommandService.addView(dealId)
		}

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.USER)
	@Patch(':id/toggle-helpful')
	async toggleHelpful(@Req() request: FastifyRequest, @Param() params: ParamId) {
		const userFromToken = request.user as ITokenUser

		return await this.dealCommandService.toggleHelpful(params.id, userFromToken.id)
	}
}
