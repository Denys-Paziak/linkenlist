import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UpdateAllEmailTemplatesDto } from '../dtos/UpdateAllEmailTemplates.dto'
import { UpdateAllHomepageTestimonialsDto } from '../dtos/UpdateAllHomepageTestimonials.dto'
import { UpdateGeneralSettingDto } from '../dtos/UpdateGeneralSetting.dto'
import { EmailTemplate } from '../entities/EmailTemplate.entity'
import { GeneralSetting } from '../entities/GeneralSetting.entity'
import { HomepageTestimonial } from '../entities/HomepageTestimonial.entity'

@Injectable()
export class SettingCommandService {
	constructor(
		@InjectRepository(HomepageTestimonial)
		private readonly homepageTestimonialRepository: Repository<HomepageTestimonial>,
		@InjectRepository(GeneralSetting)
		private readonly generalSettingRepository: Repository<GeneralSetting>,
		@InjectRepository(EmailTemplate)
		private readonly emailTemplateRepository: Repository<EmailTemplate>
	) {}

	async updateGeneralSettings(dto: UpdateGeneralSettingDto) {
		await this.generalSettingRepository
			.createQueryBuilder()
			.update()
			.set({
				value: () => `
                CASE
                    WHEN key = 'Site Name' THEN :siteName
                    WHEN key = 'Site Description' THEN :siteDescription
                END
            `
			})
			.where('key IN (:...keys)', {
				keys: ['Site Name', 'Site Description']
			})
			.setParameters({
				siteName: dto.siteName,
				siteDescription: dto.siteDescription
			})
			.execute()
	}

	async resetGeneralSetting() {
		await this.generalSettingRepository.updateAll({
			value: null
		})
	}

	async updateAllHomepageTestimonials(dto: UpdateAllHomepageTestimonialsDto) {
		await this.homepageTestimonialRepository.clear()

		await this.homepageTestimonialRepository.insert(dto.testimonials)
	}

	async updateAllEmailTemplates(dto: UpdateAllEmailTemplatesDto) {
		await this.emailTemplateRepository
			.createQueryBuilder()
			.update()
			.set({
				emailText: () => `
                CASE
                    WHEN key = 'Email Verification' THEN :emailVerification
                    WHEN key = 'Password Reset' THEN :passwordReset
                END
            `
			})
			.where('key IN (:...keys)', {
				keys: ['Email Verification', 'Password Reset']
			})
			.setParameters({
				emailVerification: dto.emailVerification,
				passwordReset: dto.passwordReset
			})
			.execute()
	}

	async resetAllEmailTemplates() {
		await this.emailTemplateRepository.updateAll({
			emailText: null
		})
	}
}
