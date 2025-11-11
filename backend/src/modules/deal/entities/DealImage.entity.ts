import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { EImageStatus } from '../../../interfaces/EImageStatus'

import { Deal } from './Deal.entity'

@Entity('deals_images')
export class DealImage {
	@PrimaryGeneratedColumn()
	id: number

	@OneToOne(() => Deal, deal => deal.image)
	deal: Deal

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

	@Column({ type: 'enum', enum: EImageStatus, default: EImageStatus.QUEUED })
	status: EImageStatus

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
