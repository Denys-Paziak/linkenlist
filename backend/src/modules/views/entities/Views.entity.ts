import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm'

import { EDailyViewEntityType } from '../../../interfaces/EDailyViewEntityType'

@Entity('daily_views')
@Unique('uq_daily_views_entity_day', ['entityType', 'entityId', 'day'])
@Index('ix_daily_views_entity', ['entityType', 'entityId'])
@Index('ix_daily_views_day', ['day'])
export class DailyView {
	@PrimaryGeneratedColumn()
	id: string

	@Column({ type: 'enum', enum: EDailyViewEntityType, name: 'entity_type' })
	entityType: EDailyViewEntityType

	@Column({ type: 'int', name: 'entity_id' })
	entityId: number

	@Column({ type: 'date' })
	day: string

	@Column({ type: 'integer', default: 0 })
	count: number

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
