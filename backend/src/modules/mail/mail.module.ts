import { MailerModule } from '@nestjs-modules/mailer'
import { Global, Module } from '@nestjs/common'

import { getMailerConfig } from '../../configs/mailer.config'
import { SettingModule } from '../setting/setting.module'

import { MailService } from './mail.service'

@Global()
@Module({
	imports: [MailerModule.forRootAsync(getMailerConfig()), SettingModule],
	providers: [MailService],
	exports: [MailService]
})
export class MailModule {}
