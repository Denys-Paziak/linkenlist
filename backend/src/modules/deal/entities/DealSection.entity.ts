import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

import { Deal } from './Deal.entity'
import { DealSectionAttachment } from './DealSectionAttachment.entity'

@Entity('deal_sections')
export class DealSection {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => Deal, d => d.contentBlocks, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'deal_id' })
	deal: Deal

	@OneToOne(() => DealSectionAttachment, { cascade: true, eager: true, nullable: true, onDelete: 'SET NULL' })
	@JoinColumn({ name: 'attachment_id' })
	attachment?: DealSectionAttachment

	@Index()
	@Column({ type: 'int' })
	position: number

	@Column({ type: 'text', default: 'Section' })
	title: string
	@Column({ type: 'boolean', default: true })
	enabled: boolean
	@Column({ type: 'text', nullable: true, name: 'body_md' })
	bodyMd?: string | null

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	@Index()
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
