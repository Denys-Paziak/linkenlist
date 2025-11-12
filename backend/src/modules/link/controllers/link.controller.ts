import { Controller, Get, Param, Patch, Query } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'

import { ParamId } from '../../../dtos/ParamId.dto'
import { GetAllLinksDto } from '../dtos/GetAllLinks.dto'
import { LinkCommandService } from '../services/link-command.service'
import { LinkQueryService } from '../services/link-query.service'

@Controller('links')
export class LinkController {
	constructor(
		private readonly linkQueryService: LinkQueryService,
		private readonly linkCommandService: LinkCommandService
	) {}

	@Get()
	async getAllLinks(@Query() query: GetAllLinksDto) {
		return await this.linkQueryService.getAllLinks(query)
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
