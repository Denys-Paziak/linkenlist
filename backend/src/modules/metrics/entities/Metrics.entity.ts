import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { EDailyMetricType } from '../../../interfaces/EDailyMetricType'
import { User } from '../../user/entities/User.entity'

@Entity('daily_metrics')
export class DailyMetric {
	@PrimaryGeneratedColumn()
	id: number

	@Index()
	@Column({ type: 'enum', enum: EDailyMetricType, name: 'metric_type' })
	metricType: EDailyMetricType

	@Index()
	@Column({ type: 'int', name: 'entity_id' })
	entityId: number

	@Index()
	@ManyToOne(() => User, u => u.dailyMetric, { nullable: true })
	@JoinColumn({ name: 'user_id' })
	user: User | null

	@Index()
	@Column({ type: 'date' })
	day: string

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
