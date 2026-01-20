import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { EFileStatus } from '../../../interfaces/EFileStatus'

import { ResourceSection } from './ResourceSection.entity'

@Entity('resource_sections_images')
export class ResourceSectionImages {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => ResourceSection, resourceSection => resourceSection.images)
	@JoinColumn({ name: 'section_id' })
	resourceSection: ResourceSection

	@Column({ type: 'text' })
	url: string

	@Column({ type: 'text', name: 'original_key', nullable: true, select: false })
	originalKey?: string | null

	@Column({ type: 'text', name: 'processed_key', nullable: true, select: false })
	processedKey?: string | null

	@Column({ type: 'int' })
	width: number

	@Column({ type: 'int' })
	height: number

	@Column({ type: 'enum', enum: EFileStatus, default: EFileStatus.QUEUED })
	status: EFileStatus

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
