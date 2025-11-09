import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm'

@Entity('listing_amenities')
@Unique(['name'])
export class ListingAmenity {
	@PrimaryGeneratedColumn()
	id: number

	@Index()
	@Column({ type: 'varchar', length: 150 })
	name: string

	@Column({ type: 'text', nullable: true })
	group?: string | null

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
