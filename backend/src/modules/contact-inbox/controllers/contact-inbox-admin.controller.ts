import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common'
import type { FastifyRequest } from 'fastify'

import { Authorization } from '../../../decorators/auth.decorator'
import { ParamId } from '../../../dtos/ParamId.dto'
import { ERoleName } from '../../../interfaces/ERoleName'
import { ITokenUser } from '../../../interfaces/ITokenUser'
import { ChangeStatusDto } from '../dtos/ChangeStatus.dto'
import { GetAllContactInboxesAdminDto } from '../dtos/GetAllContactInboxesAdmin.dto'
import { PostReplyDto } from '../dtos/PostReply.dto'
import { ContactInboxCommandService } from '../service/contact-inbox-command.service'
import { ContactInboxQueryService } from '../service/contact-inbox-query.service'

@Controller('admin/contact-inbox')
export class ContactInboxAdminController {
	constructor(
		private readonly contactInboxCommandService: ContactInboxCommandService,
		private readonly contactInboxQueryService: ContactInboxQueryService
	) {}

	@Authorization(ERoleName.ADMIN)
	@Post(':id/reply')
	async postReply(@Req() request: FastifyRequest, @Param() params: ParamId, @Body() dto: PostReplyDto) {
		const userFromToken = request.user as ITokenUser

		await this.contactInboxCommandService.postReply(userFromToken.id, params.id, dto)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Get()
	async getAllContactInboxesAdmin(@Query() query: GetAllContactInboxesAdminDto) {
		return await this.contactInboxQueryService.getAllContactInboxesAdmin(query)
	}

	@Authorization(ERoleName.ADMIN)
	@Patch(':id/change-status')
	async changeStatus(@Param() params: ParamId, @Body() dto: ChangeStatusDto) {
		await this.contactInboxCommandService.changeStatus(params.id, dto)

		return {
			ok: true
		}
	}
}
