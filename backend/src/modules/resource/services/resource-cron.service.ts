import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { EDailyMetricType } from '../../../interfaces/EDailyMetricType'
import { Resource } from '../entities/Resource.entity'
import { EResourceStatus } from '../../../interfaces/EResourceStatus'

@Injectable()
export class ResourceCronService {
	private readonly logger = new Logger(ResourceCronService.name)

	constructor(
		@InjectRepository(Resource)
		private readonly resourceRepository: Repository<Resource>
	) {}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async updateResourcesStatistics() {
		this.logger.log('🔄 Recomputing resource stats (views + helpful + freshness)...')

		const sql = `
            WITH views_agg AS (
                SELECT
                    dv.entity_id AS resource_id,
                    COUNT(*) AS total_views,
                    COUNT(*) FILTER (
                        WHERE dv.day >= CURRENT_DATE - INTERVAL '30 days'
                    ) AS views_30d
                FROM daily_metrics dv
                WHERE dv.metric_type = $1
                GROUP BY dv.entity_id
            ),
            helpful_agg AS (
                SELECT
                    dh.entity_id AS resource_id,
                    COUNT(*) AS total_helpful,
                    COUNT(*) FILTER (
                        WHERE dh.day >= CURRENT_DATE - INTERVAL '30 days'
                    ) AS helpful_30d
                FROM daily_metrics dh
                WHERE dh.metric_type = $2
                GROUP BY dh.entity_id
            ),
            pub AS (
                SELECT id, last_published_at
                FROM resources
                WHERE status = $3
            ),
            joined AS (
                SELECT
                    p.id,
                    COALESCE(v.total_views,    0) AS total_views,
                    COALESCE(v.views_30d,      0) AS views_30d,
                    COALESCE(h.total_helpful,  0) AS total_helpful,
                    COALESCE(h.helpful_30d,    0) AS helpful_30d,
                    p.last_published_at
                FROM pub p
                LEFT JOIN views_agg   v ON v.resource_id = p.id
                LEFT JOIN helpful_agg h ON h.resource_id = p.id
            ),
            mx AS (
                SELECT
                    GREATEST(MAX(views_30d),   1) AS max_views_30d,
                    GREATEST(MAX(helpful_30d), 1) AS max_helpful_30d
                FROM joined
            ),
            scored AS (
                SELECT
                    j.id,
                    j.total_views,
                    j.views_30d,
                    j.total_helpful,
                    j.helpful_30d,
                    -- нормалізовані метрики [0..1]
                    (j.views_30d::numeric   / mx.max_views_30d)   AS views_norm,
                    (j.helpful_30d::numeric / mx.max_helpful_30d) AS helpful_norm,
                    GREATEST(
                        0.0,
                        LEAST(
                            1.0,
                            1.0 - (COALESCE((CURRENT_DATE - j.last_published_at::date), 9999)) / 30.0
                        )
                    ) AS freshness   -- [0..1]
                FROM joined j
                CROSS JOIN mx
            )
            UPDATE resources AS d
            SET
                total_views   = s.total_views,
                views_30d     = s.views_30d,
                total_helpful = s.total_helpful,
                helpful_30d   = s.helpful_30d,
                -- 30% views_30d (norm) + 30% helpful_30d (norm) + 20% freshness
                popular_score = ROUND(
                    (s.views_norm * 0.3 + s.helpful_norm * 0.3 + s.freshness * 0.2) * 100
                )::int,
                updated_at    = NOW()
            FROM scored s
            WHERE s.id = d.id;
        `

		await this.resourceRepository.query(sql, [
			EDailyMetricType.RESOURCE_VIEW,
			EDailyMetricType.RESOURCE_HELPFUL,
			EResourceStatus.PUBLISHED
		])

		this.logger.log('✅ Resource stats updated.')
	}
}
