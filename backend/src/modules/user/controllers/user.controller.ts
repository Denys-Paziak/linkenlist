import { Body, Controller, Delete, Get, Patch, Query, Req, Res, UseInterceptors } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { FastifyReply, FastifyRequest } from 'fastify'

import { Authorization } from '../../../decorators/auth.decorator'
import { Files } from '../../../decorators/files.decorator'
import { MultipartInterceptor } from '../../../interceptors/multipart.interceptor'
import { ERoleName } from '../../../interfaces/ERoleName'
import { IMultipartFile } from '../../../interfaces/IMultipartFile'
import { ITokenUser } from '../../../interfaces/ITokenUser'
import { MultipartOptions } from '../../../utils/file.util'
import { ChangeEmailDto } from '../dtos/ChangeEmail.dto'
import { ChangePasswordDto } from '../dtos/ChangePassword.dto'
import { ConfirmNewEmailDto } from '../dtos/ConfirmNewEmail.dto'
import { DeleteAccountDto } from '../dtos/DeleteAccount.dto'
import { SavePublicProfileDto } from '../dtos/SavePublicProfile.dto'
import { UserCommandService } from '../services/user-command.service'
import { UserQueryService } from '../services/user-query.service'

const IMAGE_MAX_MB = 2
const IMAGE_MAX_BYTES = IMAGE_MAX_MB * 1024 * 1024
const ACCEPT_IMAGES = /(image\/(jpeg|png))$/

@Controller('users')
export class UserController {
	constructor(
		private readonly userQueryService: UserQueryService,
		private readonly userCommandService: UserCommandService,
		private readonly configService: ConfigService
	) {}

	@Authorization(ERoleName.USER)
	@Get('self')
	async getSelf(@Req() request: FastifyRequest) {
		const userFromToken = request.user as ITokenUser

		return await this.userQueryService.getSelf(userFromToken.id, ERoleName.USER, request.ip)
	}

	@Authorization(ERoleName.USER)
	@Patch('self/public-profile')
	@UseInterceptors(
		MultipartInterceptor({
			globalFileSizeLimit: IMAGE_MAX_BYTES,
			maxFiles: 1,
			validators: [new MultipartOptions(IMAGE_MAX_BYTES, ACCEPT_IMAGES, true, ACCEPT_IMAGES)]
		})
	)
	async savePublicProfile(
		@Req() request: FastifyRequest,
		@Files() files: Record<string, IMultipartFile[]>,
		@Body() dto: SavePublicProfileDto
	) {
		const userFromToken = request.user as ITokenUser

		const file = Object.values(files)?.[0]?.[0]

		await this.userCommandService.savePublicProfile(userFromToken.id, dto, file)

		return { ok: true }
	}

	@Authorization(ERoleName.USER)
	@Patch('self/switch-footer-disclaimer')
	async switchFooterDisclaimer(@Req() request: FastifyRequest) {
		const userFromToken = request.user as ITokenUser

		await this.userCommandService.switchFooterDisclaimer(userFromToken.id)

		return { ok: true }
	}

	@Authorization(ERoleName.USER)
	@Patch('self/change-password')
	async changePassword(@Req() request: FastifyRequest, @Body() dto: ChangePasswordDto) {
		const userFromToken = request.user as ITokenUser

		await this.userCommandService.changePassword(userFromToken.id, dto)

		return { ok: true }
	}

	@Authorization(ERoleName.USER)
	@Patch('self/change-email')
	async changeEmail(@Req() request: FastifyRequest, @Body() dto: ChangeEmailDto) {
		const userFromToken = request.user as ITokenUser

		await this.userCommandService.changeEmail(userFromToken.id, dto)

		return { ok: true }
	}

	@Get('self/confirm-email')
	async confirmEmail(@Query() query: ConfirmNewEmailDto, @Res({ passthrough: true }) response: FastifyReply) {
		const data = await this.userCommandService.confirmNewEmail(query.token)

		if (typeof data === 'string') {
			return response.redirect(
				this.configService.getOrThrow('CONFIRM_EMAIL_FRONT_URL') + (data ? '?message=' + data : ''),
				302
			)
		} else {
			return response.redirect(this.configService.getOrThrow('CONFIRM_EMAIL_FRONT_URL'), 302)
		}
	}

	@Authorization(ERoleName.USER)
	@Delete('self')
	async deleteAccount(@Req() request: FastifyRequest, @Body() dto: DeleteAccountDto) {
		const userFromToken = request.user as ITokenUser

		await this.userCommandService.deleteAccount(userFromToken.id, dto)

		return { ok: true }
	}
}
