import { Controller, Get, Req } from '@nestjs/common'
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import type { FastifyRequest } from 'fastify'

import { Authorization } from '../../../decorators/auth.decorator'
import { ERoleNames } from '../../../interfaces/ERoleNames'
import { ITokenUser } from '../../../interfaces/ITokenUser'
import { GetSelfResponse } from '../responses/GetSelf.response'
import { UserQueryService } from '../services/user-query.service'

@ApiCookieAuth()
@ApiTags('Users Admin')
@Controller('admin/users')
export class AdminUserController {
	constructor(private readonly userQueryService: UserQueryService) {}

	@Authorization(ERoleNames.ADMIN)
	@Get('self')
	@ApiOperation({ summary: 'Get self information' })
	@ApiResponse({
		status: 200,
		type: GetSelfResponse,
		description: 'Get self information'
	})
	async getSelf(@Req() request: FastifyRequest): Promise<GetSelfResponse> {
		const userFromToken = request.user as ITokenUser

		return await this.userQueryService.getSelf(userFromToken.id, ERoleNames.ADMIN)
	}

	async getAllUsers() {}

	async getOneUser() {}

	async resetPasswordForUser() {}

	async forceLogoutUser() {}

	async banUser() {}

	async grantFreeListingCredit() {}

	async revokeFreeListingCredit() {}
}
