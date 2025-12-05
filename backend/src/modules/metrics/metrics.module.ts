import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DailyMetric } from './entities/Metrics.entity'
import { MetricsSystemService } from './services/metrics-system.service'

@Module({
	imports: [TypeOrmModule.forFeature([DailyMetric])],
	providers: [MetricsSystemService],
	exports: [MetricsSystemService]
})
export class MetricsModule {}
