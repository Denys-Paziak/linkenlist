import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { EDailyViewEntityType } from '../../../interfaces/EDailyViewEntityType'
import { DailyView } from '../entities/Views.entity'

@Injectable()
export class ViewsSystemService {
	constructor(
		@InjectRepository(DailyView)
		private readonly dailyViewRepository: Repository<DailyView>
	) {}

	async incrementDailyView(entityType: EDailyViewEntityType, entityId: number) {
		const dayStr = new Date().toISOString().slice(0, 10)

		await this.dailyViewRepository
			.createQueryBuilder()
			.insert()
			.into(DailyView)
			.values({
				entityType,
				entityId,
				day: dayStr,
				count: 1
			})
			.onConflict(`("entity_type","entity_id","day") DO UPDATE SET "count" = "daily_views"."count" + EXCLUDED."count"`)
			.execute()
	}

	async getAllViewsEntity(entityType: EDailyViewEntityType, entityId?: number) {
		const qb = this.dailyViewRepository
			.createQueryBuilder('dv')
			.select('dv.entityId', 'entityId')
			.addSelect('SUM(dv.count)', 'total')
			.addSelect(
				`
			SUM(
				CASE 
					WHEN dv.day >= CURRENT_DATE - INTERVAL '30 days' THEN dv.count 
					ELSE 0 
				END
			)
		`,
				'last30d'
			)
			.where('dv.entityType = :entityType', { entityType })
			.groupBy('dv.entityId')

		if (entityId) {
			qb.andWhere('dv.entityId = :entityId', { entityId })
		}

		return await qb.getRawMany<{
			entityId: string
			total: string
			last30d: string
		}>()
	}
}
