import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { Listing } from './Listing.entity'

@Entity('listing_photos')
@Index(['listing', 'position'], { unique: true })
export class ListingPhoto {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => Listing, l => l.photos, { onDelete: 'CASCADE' })
	listing: Listing

	@Column({ type: 'int' }) position: number

	@Column({ name: 'original_url', type: 'text' }) originalUrl: string
	@Column({ name: 'thumb_url', type: 'text', nullable: true }) thumbUrl?: string | null
	@Column({ name: 'card_url', type: 'text', nullable: true }) cardUrl?: string | null
	@Column({ name: 'hero_url', type: 'text', nullable: true }) heroUrl?: string | null

	@Column({ type: 'text', nullable: true }) caption?: string | null
	@Column({ name: 'is_cover', type: 'boolean', default: false }) isCover: boolean

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
