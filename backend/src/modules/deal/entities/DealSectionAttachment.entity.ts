import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { EFileStatus } from '../../../interfaces/EFileStatus'

import { DealSection } from './DealSection.entity'

@Entity('deal_sections_attachments')
export class DealSectionAttachment {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => DealSection, dealSection => dealSection.attachments)
	@JoinColumn({ name: 'section_id' })
	dealSection: DealSection

	@Column({ type: 'text' })
	url: string

	@Column({ type: 'text', name: 'original_key', nullable: true, select: false })
	originalKey?: string | null

	@Column({ type: 'text', name: 'processed_key', nullable: true, select: false })
	processedKey?: string | null

	@Column({ type: 'text' })
	name: string

	@Column({ type: 'text' })
	ext: string

	@Column({ type: 'int', name: "size_bytes" })
	sizeBytes: number

	@Column({ type: 'enum', enum: EFileStatus, default: EFileStatus.QUEUED })
	status: EFileStatus

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
