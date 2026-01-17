import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { EFileStatus } from '../../../interfaces/EFileStatus'

import { Listing } from './Listing.entity'

@Entity('listing_photos')
export class ListingPhoto {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => Listing, l => l.photos, { onDelete: 'CASCADE' })
	listing: Listing

	@Column({ type: 'int' })
	position: number

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

	@Column({ type: 'text', nullable: true })
	caption?: string | null

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
