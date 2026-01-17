import { Body, Controller, Get, Param, Patch, Query, Req } from '@nestjs/common'
import type { FastifyRequest } from 'fastify'

import { Authorization } from '../../../decorators/auth.decorator'
import { ParamId } from '../../../dtos/ParamId.dto'
import { ERoleName } from '../../../interfaces/ERoleName'
import { ITokenUser } from '../../../interfaces/ITokenUser'
import { BanUserDto } from '../dtos/BanUser.dto'
import { GetAllUsersDto } from '../dtos/GetAllUsers.dto'
import { ResetPasswordForUserDto } from '../dtos/ResetPasswordForUser.dto'
import { UserCommandService } from '../services/user-command.service'
import { UserQueryService } from '../services/user-query.service'

@Controller('admin/users')
export class AdminUserController {
	constructor(
		private readonly userQueryService: UserQueryService,
		private readonly userCommandService: UserCommandService
	) {}

	@Authorization(ERoleName.ADMIN)
	@Get('self')
	async getSelf(@Req() request: FastifyRequest) {
		const userFromToken = request.user as ITokenUser

		return await this.userQueryService.getSelf(userFromToken.id, ERoleName.ADMIN)
	}

	@Authorization(ERoleName.ADMIN)
	@Get()
	async getAllUsersAdmin(@Query() query: GetAllUsersDto) {
		return this.userQueryService.getAllUsersAdmin(query)
	}

	@Authorization(ERoleName.ADMIN)
	@Patch(':id/reset-password')
	async resetPasswordForUser(@Param() params: ParamId, @Body() dto: ResetPasswordForUserDto) {
		await this.userCommandService.resetPasswordForUser(params.id, dto)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Patch(':id/force-logout')
	async forceLogoutUser(@Param() params: ParamId) {
		await this.userCommandService.forceLogoutUser(params.id)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Patch(':id/ban-user')
	async banUser(@Param() params: ParamId, @Body() dto: BanUserDto) {
		await this.userCommandService.banUser(params.id, dto)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Patch(':id/unban-user')
	async unbanUser(@Param() params: ParamId) {
		await this.userCommandService.unbanUser(params.id)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Patch(':id/grant-free-listing-credit')
	async grantFreeListingCredit(@Param() params: ParamId) {
		await this.userCommandService.grantFreeListingCredit(params.id)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Patch(':id/revoke-free-listing-credit')
	async revokeFreeListingCredit(@Param() params: ParamId) {
		await this.userCommandService.revokeFreeListingCredit(params.id)

		return {
			ok: true
		}
	}
}
