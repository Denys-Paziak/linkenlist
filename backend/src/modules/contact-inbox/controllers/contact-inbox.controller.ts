import { Body, Controller, Post, Req } from '@nestjs/common'
import type { FastifyRequest } from 'fastify'

import { Authorization } from '../../../decorators/auth.decorator'
import { ERoleName } from '../../../interfaces/ERoleName'
import { ITokenUser } from '../../../interfaces/ITokenUser'
import { UseTurnstile } from '../../turnstile/turnstile.decorator'
import { ContactUsDto } from '../dtos/ContactUs.dto'
import { ListingReportDto } from '../dtos/ListingReport.dto'
import { ContactInboxCommandService } from '../service/contact-inbox-command.service'

@Controller('contact-inbox')
export class ContactInboxController {
	constructor(private readonly contactInboxCommandService: ContactInboxCommandService) {}

	@UseTurnstile()
	@Post('contact-us/captcha')
	async postContactUsCaptcha(@Body() dto: ContactUsDto) {
		await this.contactInboxCommandService.postContactUs(dto)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.USER)
	@Post('contact-us/auth')
	async postContactUsAuth(@Req() request: FastifyRequest, @Body() dto: ContactUsDto) {
		const userFromToken = request.user as ITokenUser

		await this.contactInboxCommandService.postContactUs(dto, userFromToken.id)

		return {
			ok: true
		}
	}

	@UseTurnstile()
	@Post('listing-report/captcha')
	async postListingReportCaptcha(@Req() request: FastifyRequest, @Body() dto: ListingReportDto) {
		const userId = (request as any).user?.id as number | undefined
		const cacheKey = userId ? `u:${userId}` : `ip:${request.ip}`

		await this.contactInboxCommandService.postListingReport(dto, cacheKey)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.USER)
	@Post('listing-report/auth')
	async postListingReportAuth(@Req() request: FastifyRequest, @Body() dto: ListingReportDto) {
		const userFromToken = request.user as ITokenUser

		const userId = (request as any).user?.id as number | undefined
		const cacheKey = userId ? `u:${userId}` : `ip:${request.ip}`

		await this.contactInboxCommandService.postListingReport(dto, cacheKey, userFromToken.id)

		return {
			ok: true
		}
	}
}
