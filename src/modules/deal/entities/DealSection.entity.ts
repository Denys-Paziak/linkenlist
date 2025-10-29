import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { Deal } from './Deal.entity'

@Entity('deal_sections')
export class DealSection {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => Deal, d => d.contentBlocks, { onDelete: 'CASCADE' })
	deal: Deal

	@Index()
	@Column({ type: 'int' })
	position: number

	@Column({ type: 'text' }) title: string
	@Column({ type: 'boolean', default: true }) enabled: boolean
	@Column({ type: 'text', nullable: true }) bodyMd?: string | null

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	@Index()
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
