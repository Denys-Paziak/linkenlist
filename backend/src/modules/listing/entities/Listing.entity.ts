import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	Unique,
	UpdateDateColumn
} from 'typeorm'

import { EListingStatus } from '../../../interfaces/EListingStatus'
import { EPackageType } from '../../../interfaces/EPackageType'
import { ContactInbox } from '../../contact-inbox/entities/ContactInbox.entity'
import { User } from '../../user/entities/User.entity'

import { ListingPhoto } from './ListingPhoto.entity'
import { MilitaryBase } from './MilitaryBase.entity'

type GeoPoint = { type: 'Point'; coordinates: [number, number] };

@Entity('listings')
@Unique(['slug'])
@Index('listings_search_document_gin_idx', { synchronize: false })
@Index('listings_title_trgm_gin_idx', { synchronize: false })
export class Listing {
	@PrimaryGeneratedColumn()
	id: number

	// Пакет
	@Column({ type: 'enum', enum: EPackageType, default: EPackageType.BASIC })
	package: EPackageType

	// Продавець
	@ManyToOne(() => User, u => u.listings, { onDelete: 'CASCADE' })
	owner: User
	@Column({ name: 'first_name', type: 'varchar', length: 150, nullable: true })
	firstName: string | null
	@Column({ name: 'last_name', type: 'varchar', length: 150, nullable: true })
	lastName: string | null
	@Column({ name: 'company', type: 'varchar', length: 255, nullable: true })
	company: string | null
	@Column({ name: 'primary_phone', type: 'varchar', length: 20, nullable: true })
	primaryPhone: string | null
	@Column({ name: 'alternative_phone', type: 'varchar', length: 20, nullable: true })
	alternativePhone: string | null
	@Column({ name: 'email', type: 'varchar', length: 255, nullable: true })
	email: string | null

	// Адреса/гео та приватність
	@Column({ type: 'text', nullable: true })
	street: string | null
	@Column({ type: 'text', nullable: true })
	unit: string | null
	@Column({ type: 'text', nullable: true })
	zip: string | null
	@Column({ type: 'text', nullable: true })
	state: string | null
	@Column({ type: 'text', nullable: true })
	city: string | null
	@Index({ spatial: true })
	@Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326, nullable: true })
	location: GeoPoint | null

	// Тип угоди та ціни
	@Column({ name: 'for_sale', type: 'boolean', default: false })
	forSale: boolean
	@Column({ name: 'for_rent', type: 'boolean', default: false })
	forRent: boolean
	@Column({ name: 'list_price', type: 'int', nullable: true })
	listPrice: number | null
	@Column({ name: 'monthly_rent', type: 'int', nullable: true })
	monthlyRent: number | null
	@Column({ name: 'security_deposit', type: 'int', nullable: true })
	securityDeposit: number | null
	@Column({ name: 'application_fee', type: 'int', nullable: true })
	applicationFee: number | null
	@Column({ name: 'date_available', type: 'date', nullable: true })
	dateAvailable: string | null
	@Column({ name: 'lease_term', type: 'text', nullable: true })
	leaseTerm: string | null
	@Column({ name: 'pet_policy', type: 'text', array: true, nullable: true })
	petPolicy: string[] | null

	// Характеристики нерухомості
	@Column({ name: 'property_type', type: 'text', nullable: true })
	propertyType: string | null
	@Column({ type: 'int', nullable: true })
	bedrooms: number | null
	@Column({ name: 'bathrooms_full', type: 'int', nullable: true })
	bathroomsFull: number | null
	@Column({ name: 'bathrooms_half', type: 'int', nullable: true })
	bathroomsHalf: number | null
	@Column({ name: 'interior_size', type: 'int', nullable: true })
	interiorSize: number | null
	@Column({ name: 'year_built', type: 'int', nullable: true })
	yearBuilt: number | null
	@Column({ type: 'int', nullable: true })
	stories: number | null
	@Column({ name: 'architectural_style', type: 'text', nullable: true })
	architecturalStyle: string | null
	// HOA
	@Column({ type: 'boolean', default: false })
	hoaPresent: boolean
	@Column({ name: 'hoa_fee', type: 'int', nullable: true })
	hoaFee: number | null
	@Column({ name: 'hoa_frequency', type: 'enum', enum: ['monthly', 'quarterly', 'annually'], nullable: true })
	hoaFrequency: 'monthly' | 'quarterly' | 'annually' | null
	@Column({ name: 'services_included', type: 'text', array: true, nullable: true })
	servicesIncluded: string[] | null

	// Загальна інформація
	@Column({ type: 'text', nullable: true })
	title: string | null
	@Column({ type: 'text', unique: true, nullable: true })
	slug: string | null
	@Column({ type: 'text', nullable: true })
	description: string | null
	@Column({ name: 'virtual_tour_url', type: 'text', nullable: true })
	virtualTourUrl: string | null
	@Column({
		type: 'tsvector',
		select: false,
		asExpression: `
			setweight(to_tsvector('english', coalesce("title", '')), 'A') ||
			setweight(to_tsvector('english', coalesce("description", '')), 'B')
		`,
		generatedType: 'STORED'
	})
	search_document: any

	// Amenities
	@Column({ name: 'subdivision_name', type: 'text', nullable: true })
	subdivisionName: string | null
	@Column({ name: 'community_features', type: 'text', array: true, nullable: true })
	communityFeatures: string[] | null

	// Outdoor Features
	@Column({ name: 'outdoor_spaces', type: 'text', array: true, nullable: true })
	outdoorSpaces: string[] | null
	@Column({ type: 'text', array: true, nullable: true })
	fencing: string[] | null
	@Column({ type: 'text', array: true, nullable: true })
	view: string[] | null
	@Column({ name: 'parking_type', type: 'text', array: true, nullable: true })
	parkingType: string[] | null
	@Column({ name: 'lot_features', type: 'text', array: true, nullable: true })
	lotFeatures: string[] | null
	@Column({ name: 'pool_type', type: 'text', nullable: true })
	poolType: string | null
	@Column({ name: 'garage_spaces', type: 'text', nullable: true })
	garageSpaces: string | null
	@Column({ name: 'driveway_spaces', type: 'text', nullable: true })
	drivewaySpaces: string | null
	@Column({ name: 'lot_size', type: 'text', nullable: true })
	lotSize: string | null

	// Indoor Features
	@Column({ type: 'text', array: true, nullable: true })
	flooring: string[]
	@Column({ type: 'text', array: true, nullable: true })
	heating: string[]
	@Column({ type: 'text', array: true, nullable: true })
	cooling: string[]
	@Column({ type: 'text', array: true, nullable: true })
	appliances: string[]
	@Column({ name: 'laundry_features', type: 'text', array: true, nullable: true })
	laundryFeatures: string[]
	@Column({ name: 'premium_features', type: 'text', nullable: true })
	premiumFeatures: string
	@Column({ name: 'special_features', type: 'text', array: true, nullable: true })
	specialFeatures: string[]

	// Construction & Legal Records
	@Column({ type: 'text', array: true, nullable: true })
	construction: string[] | null
	@Column({ name: 'new_construction', type: 'boolean', default: false })
	newConstruction: boolean
	@Column({ type: 'text', nullable: true })
	builder: string | null
	@Column({ type: 'text', nullable: true })
	zoning: string | null
	@Column({ name: 'parcel_apn', type: 'text', nullable: true })
	parcelApn: string | null
	@Column({ name: 'ownership_type', type: 'text', nullable: true })
	ownershipType: string | null
	@Column({ name: 'listing_agreement', type: 'text', nullable: true })
	listingAgreement: string | null
	@Column({ name: 'date_on_market', type: 'text', nullable: true })
	dateOnMarket: string | null

	// Utilities, Energy & Connectivity
	@Column({ type: 'text', nullable: true })
	water: string | null
	@Column({ type: 'text', nullable: true })
	sewer: string | null
	@Column({ name: 'utilities_available', type: 'text', array: true, nullable: true })
	utilitiesAvailable: string[] | null
	@Column({ name: 'energy_features', type: 'text', array: true, nullable: true })
	energyFeatures: string[] | null
	@Column({ name: 'download_speed', type: 'text', nullable: true })
	downloadSpeed: string | null
	@Column({ name: 'cellular_notes', type: 'text', nullable: true })
	cellularNotes: string | null
	@Column({ name: 'internet_options', type: 'text', array: true, nullable: true })
	internetOptions: string[] | null
	@Column({ name: 'smart_devices', type: 'text', array: true, nullable: true })
	smartDevices: string[] | null

	// Найближчі бази
	@ManyToOne(() => MilitaryBase, { nullable: true })
	nearestBase: MilitaryBase | null

	// Медіа
	@OneToMany(() => ListingPhoto, p => p.listing, { cascade: true })
	photos: ListingPhoto[]

	// Статуси/дати
	@Index()
	@Column({ type: 'enum', enum: EListingStatus, default: EListingStatus.DRAFT })
	status: EListingStatus

	@Column({ type: 'int', default: 0, name: 'total_views' })
	totalViews: number

	@OneToMany(() => ContactInbox, report => report.reportListing)
	reports: ContactInbox[]

	@Column({ name: 'published_at', type: 'timestamptz', nullable: true })
	publishedAt: Date | null

	@Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
	expiresAt: Date | null

	@Column({ name: 'is_expired', type: 'boolean', default: false })
	isExpired: boolean

	@Column({ name: 'is_potential_duplicate', type: 'boolean', default: false })
	isPotentialDuplicate: boolean

	@Column({ name: 'rejection_message', type: 'text', nullable: true })
	rejectionMessage: string | null

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	@Index()
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
