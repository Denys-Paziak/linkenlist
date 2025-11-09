import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	Unique,
	UpdateDateColumn
} from 'typeorm'

import { User } from '../../user/entities/User.entity'

import { ListingAmenity } from './ListingAmenity.entity'
import { ListingPhoto } from './ListingPhoto.entity'
import { MilitaryBase } from './MilitaryBase.entity'

export enum ListingStatus {
	DRAFT = 'draft',
	PENDING = 'pending',
	ACTIVE = 'active',
	REJECTED = 'rejected',
	INACTIVE = 'inactive',
	EXPIRED = 'expired'
}
export enum ListingDealType {
	SALE = 'sale',
	RENT = 'rent',
	BOTH = 'both'
}
export enum PackageType {
	BASIC = 'basic',
	PREMIUM = 'premium'
}

@Entity('listings')
@Unique(['slug'])
export class Listing {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => User, u => u.listings, { onDelete: 'CASCADE' })
	owner: User

	@Index()
	@Column({ type: 'text' })
	title: string

	@Column({ type: 'text', unique: true }) slug: string

	// Тип угоди та пакета
	@Index()
	@Column({ type: 'enum', enum: ListingDealType, default: ListingDealType.SALE })
	dealType: ListingDealType

	@Column({ type: 'enum', enum: PackageType, default: PackageType.BASIC })
	package: PackageType

	// Ціни
	@Index()
	@Column({ type: 'int', nullable: true })
	salePrice?: number | null

	@Index()
	@Column({ type: 'int', nullable: true })
	rentMonthly?: number | null

	// Характеристики
	@Index() @Column({ type: 'int' }) bedrooms: number
	@Index()
	@Column({ type: 'numeric', precision: 4, scale: 1, default: 1 })
	bathroomsFull: string
	@Column({ type: 'numeric', precision: 4, scale: 1, default: 0 })
	bathroomsHalf: string
	@Index() @Column({ type: 'int' }) interiorSqft: number
	@Index() @Column({ type: 'int', nullable: true }) yearBuilt?: number | null
	@Column({ type: 'int', nullable: true }) stories?: number | null

	// HOA
	@Column({ type: 'boolean', default: false }) hoaPresent: boolean
	@Column({ type: 'int', nullable: true }) hoaDues?: number | null
	@Column({ type: 'text', nullable: true }) hoaPeriod?: string | null // month/quarter/year

	// Адреса/гео та приватність
	@Column({ type: 'text' }) street: string
	@Column({ type: 'boolean', default: false }) hideStreet: boolean
	@Column({ type: 'text', nullable: true }) unit?: string | null
	@Index() @Column({ type: 'text' }) city: string
	@Index() @Column({ type: 'text' }) state: string
	@Index() @Column({ type: 'text' }) zip: string

	@Index({ spatial: true })
	@Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326, nullable: true })
	location?: any | null

	@ManyToOne(() => MilitaryBase, { nullable: true })
	nearestBase?: MilitaryBase | null

	// Медіа
	@OneToMany(() => ListingPhoto, p => p.listing, { cascade: true })
	photos: ListingPhoto[]

	// Amenities/Tags (чекбокси)
	@ManyToMany(() => ListingAmenity, { cascade: ['insert'] })
	@JoinTable({ name: 'listing_amenities_join' })
	amenities: ListingAmenity[]

	// Опис
	@Column({ type: 'text' })
	description: string

	// Статуси/дати
	@Index()
	@Column({ type: 'enum', enum: ListingStatus, default: ListingStatus.DRAFT })
	status: ListingStatus

	@Column({ type: 'timestamptz', nullable: true })
	publishedAt?: Date | null

	@Column({ type: 'timestamptz', nullable: true })
	expiresAt?: Date | null

	// Позначки (3D, ComingSoon, OpenHouse)
	@Column({ type: 'text', array: true, default: [] })
	badges: string[]

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	@Index()
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
