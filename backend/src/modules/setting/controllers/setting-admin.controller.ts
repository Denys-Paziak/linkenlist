import { Body, Controller, Get, Put } from '@nestjs/common'

import { Authorization } from '../../../decorators/auth.decorator'
import { ERoleName } from '../../../interfaces/ERoleName'
import { SettingQueryService } from '../services/setting-query.service'
import { SettingCommandService } from '../services/setting-command.service'
import { UpdateGeneralSettingDto } from '../dtos/UpdateGeneralSetting.dto'
import { UpdateAllHomepageTestimonialsDto } from '../dtos/UpdateAllHomepageTestimonials.dto'
import { UpdateAllEmailTemplatesDto } from '../dtos/UpdateAllEmailTemplates.dto'

@Controller('admin/setting')
export class SettingAdminController {
	constructor(
		private readonly settingQueryService: SettingQueryService,
		private readonly settingCommandService: SettingCommandService
	) {}

	@Authorization(ERoleName.ADMIN)
	@Get('email-templates')
	getGeneralSetting() {
		return this.settingQueryService.getAllEmailTemplates()
	}

	@Authorization(ERoleName.ADMIN)
	@Put('general-settings')
	async updateGeneralSetting(@Body() dto: UpdateGeneralSettingDto) {
		await this.settingCommandService.updateGeneralSettings(dto)
	
		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Put('general-settings/reset')
	async resetGeneralSetting() {
		await this.settingCommandService.resetGeneralSetting()
	
		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Put('homepage-testimonials')
	async updateAllHomepageTestimonials(@Body() dto: UpdateAllHomepageTestimonialsDto) {
		await this.settingCommandService.updateAllHomepageTestimonials(dto)
	
		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Put('email-templates')
	async updateAllEmailTemplates(@Body() dto: UpdateAllEmailTemplatesDto) {
		await this.settingCommandService.updateAllEmailTemplates(dto)
	
		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Put('email-templates/reset')
	async resetAllEmailTemplates() {
		await this.settingCommandService.resetAllEmailTemplates()
	
		return {
			ok: true
		}
	}
}
