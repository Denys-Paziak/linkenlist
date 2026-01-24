import { Body, Controller, Get, Param, Patch, Query, Req } from '@nestjs/common'
import type { FastifyRequest } from 'fastify'

import { Authorization } from '../../../decorators/auth.decorator'
import { ParamId } from '../../../dtos/ParamId.dto'
import { ERoleName } from '../../../interfaces/ERoleName'
import { ITokenUser } from '../../../interfaces/ITokenUser'
import { GetAllUserNotificationsDto } from '../dtos/GetAllUserNotifications.dto'
import { NotificationCommandService } from '../services/notification-command.service'
import { NotificationQueryService } from '../services/notification-query.service'
import { ChangeStatusDto } from '../dtos/ChangeStatus.dto'

@Controller('notification')
export class NotificationController {
	constructor(
		private readonly notificationQueryService: NotificationQueryService,
		private readonly notificationCommandService: NotificationCommandService
	) {}

	@Authorization(ERoleName.USER)
	@Get()
	async getAllUserNotifications(@Req() request: FastifyRequest, @Query() query: GetAllUserNotificationsDto) {
		const userFromToken = request.user as ITokenUser

		return await this.notificationQueryService.getAllUserNotifications(userFromToken.id, query)
	}

	@Authorization(ERoleName.USER)
	@Patch(':id')
	async changeStatus(@Req() request: FastifyRequest, @Param() params: ParamId, @Body() dto: ChangeStatusDto) {
		const userFromToken = request.user as ITokenUser

		await this.notificationCommandService.changeStatus(userFromToken.id, params.id, dto)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.USER)
	@Patch('read-all')
	async readAll(@Req() request: FastifyRequest) {
		const userFromToken = request.user as ITokenUser

		await this.notificationCommandService.readAll(userFromToken.id)

		return {
			ok: true
		}
	}
}
