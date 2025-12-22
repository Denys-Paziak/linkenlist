import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SettingAdminController } from './controllers/setting-admin.controller'
import { SettingController } from './controllers/setting.controller'
import { EmailTemplate } from './entities/EmailTemplate.entity'
import { GeneralSetting } from './entities/GeneralSetting.entity'
import { HomepageTestimonial } from './entities/HomepageTestimonial.entity'
import { SettingCommandService } from './services/setting-command.service'
import { SettingQueryService } from './services/setting-query.service'
import { SettingSystemService } from './services/setting-system.service'

@Module({
	imports: [TypeOrmModule.forFeature([GeneralSetting, HomepageTestimonial, EmailTemplate])],
	controllers: [SettingController, SettingAdminController],
	providers: [SettingSystemService, SettingQueryService, SettingCommandService],
	exports: [SettingSystemService]
})
export class SettingModule {}
