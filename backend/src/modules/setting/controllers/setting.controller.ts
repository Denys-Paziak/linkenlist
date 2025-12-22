import { Controller, Get } from '@nestjs/common';
import { SettingQueryService } from '../services/setting-query.service';

@Controller('setting')
export class SettingController {
  constructor(
    private readonly settingQueryService: SettingQueryService
  ) {}

  @Get('general-settings')
  getGeneralSettings() {
    return this.settingQueryService.getGeneralSettings()
  }

  @Get('homepage-testimonials')
  getAllHomepageTestimonials() {
    return this.settingQueryService.getAllHomepageTestimonials()
  }
}
