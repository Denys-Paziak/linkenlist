import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { Deal } from './Deal.entity'

@Entity('deal_related')
@Index(['source'], { unique: true })
export class DealRelated {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => Deal, d => d.relatedManual, { onDelete: 'CASCADE' })
	source: Deal

	@ManyToOne(() => Deal, { onDelete: 'CASCADE' })
	target: Deal

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	@Index()
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
