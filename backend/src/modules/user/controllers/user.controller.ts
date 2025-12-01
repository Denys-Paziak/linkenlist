import { Controller, Get, Req } from '@nestjs/common'
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import type { FastifyRequest } from 'fastify'

import { Authorization } from '../../../decorators/auth.decorator'
import { ERoleName } from '../../../interfaces/ERoleName'
import { ITokenUser } from '../../../interfaces/ITokenUser'
import { GetSelfResponse } from '../responses/GetSelf.response'
import { UserQueryService } from '../services/user-query.service'

@ApiCookieAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
	constructor(private readonly userQueryService: UserQueryService) {}

	@Authorization(ERoleName.USER)
	@Get('self')
	@ApiOperation({ summary: 'Get self information' })
	@ApiResponse({
		status: 200,
		type: GetSelfResponse,
		description: 'Get self information'
	})
	async getSelf(@Req() request: FastifyRequest): Promise<GetSelfResponse> {
		const userFromToken = request.user as ITokenUser

		return await this.userQueryService.getSelf(userFromToken.id, ERoleName.USER)
	}

	async savePublicProfile() {}

	async switchFooterDisclaimer() {}

	async deleteAccount() {}
}
