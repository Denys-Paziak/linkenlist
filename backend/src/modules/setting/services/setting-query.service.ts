import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { EmailTemplate } from '../entities/EmailTemplate.entity'
import { GeneralSetting } from '../entities/GeneralSetting.entity'
import { HomepageTestimonial } from '../entities/HomepageTestimonial.entity'

@Injectable()
export class SettingQueryService {
	constructor(
		@InjectRepository(HomepageTestimonial)
		private readonly homepageTestimonialRepository: Repository<HomepageTestimonial>,
		@InjectRepository(GeneralSetting)
		private readonly generalSettingRepository: Repository<GeneralSetting>,
		@InjectRepository(EmailTemplate)
		private readonly emailTemplateRepository: Repository<EmailTemplate>
	) {}

	async getGeneralSettings() {
		const data = await this.generalSettingRepository.find()

		const siteName = data.find(item => item.key === 'Site Name')
		const siteDescription = data.find(item => item.key === 'Site Description')

		return {
			title: siteName?.value || siteName?.defaultValue,
			description: siteDescription?.value ?? siteDescription?.defaultValue
		}
	}

	async getAllHomepageTestimonials() {
		return await this.homepageTestimonialRepository.find()
	}

	async getAllEmailTemplates() {
		const data = await this.emailTemplateRepository.find()

		const emailVerification = data.find(item => item.key === 'Email Verification')
		const passwordReset = data.find(item => item.key === 'Password Reset')

		return {
			emailVerification: emailVerification?.emailText || emailVerification?.defaultEmailText,
			passwordReset: passwordReset?.emailText || passwordReset?.defaultEmailText
		}
	}
}
