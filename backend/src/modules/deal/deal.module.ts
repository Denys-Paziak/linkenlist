import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DealController } from './controllers/deal.controller'
import { Deal } from './entities/Deal.entity'
import { DealRelated } from './entities/DealRelated.entity'
import { DealSection } from './entities/DealSection.entity'
import { DealTag } from './entities/DealTag.entity'
import { DealService } from './services/deal.service'

@Module({
	imports: [TypeOrmModule.forFeature([Deal, DealRelated, DealSection, DealTag])],
	controllers: [DealController],
	providers: [DealService]
})
export class DealModule {}
