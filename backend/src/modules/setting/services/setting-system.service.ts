import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { EmailTemplate } from '../entities/EmailTemplate.entity'

@Injectable()
export class SettingSystemService {
	constructor(
		@InjectRepository(EmailTemplate)
		private readonly emailTemplateRepository: Repository<EmailTemplate>
	) {}

	async getEmailMessage(key: string) {
        const data = await this.emailTemplateRepository.findOne({where: {key}})

		return data?.emailText || data?.defaultEmailText
    }
}
