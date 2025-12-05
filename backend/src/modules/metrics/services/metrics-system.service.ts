import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { EDailyMetricType } from '../../../interfaces/EDailyMetricType'
import { DailyMetric } from '../entities/Metrics.entity'

@Injectable()
export class MetricsSystemService {
	constructor(
		@InjectRepository(DailyMetric)
		private readonly dailyMetricRepository: Repository<DailyMetric>
	) {}

	async addView(metricType: EDailyMetricType, entityId: number) {
		const dayStr = new Date().toISOString().slice(0, 10)

		await this.dailyMetricRepository
			.createQueryBuilder()
			.insert()
			.into(DailyMetric)
			.values({
				metricType,
				entityId,
				day: dayStr,
			})
			.execute()
	}

	async addHelpful(metricType: EDailyMetricType, entityId: number, userId: number) {
		const dayStr = new Date().toISOString().slice(0, 10)

		await this.dailyMetricRepository
			.createQueryBuilder()
			.insert()
			.into(DailyMetric)
			.values({
				metricType,
				entityId,
				day: dayStr,
				user: { id: userId }
			})
			.execute()
	}
}
