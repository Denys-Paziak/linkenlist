import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DailyView } from './entities/Views.entity'
import { ViewsSystemService } from './services/views-system.service'

@Module({
	imports: [TypeOrmModule.forFeature([DailyView])],
	providers: [ViewsSystemService],
	exports: [ViewsSystemService]
})
export class ViewsModule {}
