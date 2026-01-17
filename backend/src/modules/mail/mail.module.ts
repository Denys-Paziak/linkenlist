import { Global, Module } from '@nestjs/common'

import { SettingModule } from '../setting/setting.module'

import { MailService } from './mail.service'

@Global()
@Module({
	imports: [SettingModule],
	providers: [MailService],
	exports: [MailService]
})
export class MailModule {}
