import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	JoinTable,
	ManyToMany,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	Unique,
	UpdateDateColumn
} from 'typeorm'

import { EDealCadencePrice } from '../../../interfaces/EDealCadencePrice'
import { EDealCategory } from '../../../interfaces/EDealCategory'
import { EDealStatus } from '../../../interfaces/EDealStatus'
import { EDealType } from '../../../interfaces/EDealType'
import { EOgImageMode } from '../../../interfaces/EOgImageMode'
import { LinkImage } from '../../link/entities/LinkImage.entity'

import { DealImage } from './DealImage.entity'
import { DealRelated } from './DealRelated.entity'
import { DealSection } from './DealSection.entity'
import { DealTag } from './DealTag.entity'

@Entity('deals')
@Unique(['slug'])
export class Deal {
	@PrimaryGeneratedColumn()
	id: number

	@Index()
	@Column({ type: 'text', nullable: true })
	title?: string | null

	@Index()
	@Column({ type: 'text', nullable: true })
	slug?: string | null

	@Column({ type: 'text', nullable: true })
	teaser?: string | null

	@OneToOne(() => DealImage, { cascade: true, eager: true, nullable: true, onDelete: 'SET NULL' })
	@JoinColumn({ name: 'image_id' })
	image?: LinkImage

	@Column({ type: 'boolean', default: false, name: 'is_verified' })
	isVerified: boolean

	@Column({ type: 'boolean', default: false, name: 'is_featured' })
	isFeatured: boolean

	@Column({ type: 'enum', enum: EDealCategory, array: true, default: [] })
	categories: EDealCategory[]

	@ManyToMany(() => DealTag, { cascade: ['insert'] })
	@JoinTable({ name: 'deal_tags_join' })
	tags: DealTag[]

	@Column({ type: 'text', name: 'outbound_url', nullable: true })
	outboundUrl?: string | null

	@Column({ type: 'text', name: 'outbound_url_button_label', default: 'Go to Deal' })
	outboundUrlButtonLabel: string

	// Offer Details
	@Column({ type: 'boolean', default: true, name: 'offer_enabled' })
	offerEnabled: boolean

	@Column({ type: 'enum', enum: EDealType, nullable: true, name: 'deal_type' })
	dealType?: EDealType | null

	@Column({
		type: 'numeric',
		precision: 12,
		scale: 2,
		nullable: true,
		name: 'original_price',
		transformer: {
			to: (value: number | null) => value,
			from: (value: string | null) => (value !== null ? parseFloat(value) : null)
		}
	})
	originalPrice?: number | null

	@Column({
		type: 'numeric',
		precision: 12,
		scale: 2,
		nullable: true,
		name: 'your_price',
		transformer: {
			to: (value: number | null) => value,
			from: (value: string | null) => (value !== null ? parseFloat(value) : null)
		}
	})
	yourPrice?: number | null

	@Column({ type: 'enum', enum: EDealCadencePrice, default: EDealCadencePrice.ONE_TIME, name: 'cadence_price' })
	cadencePrice: EDealCadencePrice

	@Column({ type: 'text', nullable: true, name: 'promo_code' })
	promoCode?: string | null
	@Column({ type: 'text', nullable: true, name: 'where_to_enter_code' })
	whereToEnterCode?: string | null

	@Column({ type: 'boolean', default: false, name: 'ongoing_offer' })
	ongoingOffer: boolean

	@Column({ type: 'date', nullable: true, name: 'valid_from' })
	validFrom?: string | null
	@Column({ type: 'date', nullable: true, name: 'valid_until' })
	validUntil?: string | null

	@Column({ type: 'text', nullable: true, name: 'provider_display_name' })
	providerDisplayName?: string | null

	// Content (Markdown секції)
	@OneToMany(() => DealSection, b => b.deal, { cascade: true })
	contentBlocks: DealSection[]

	// Surfacing & related (ручний порядок)
	@OneToMany(() => DealRelated, r => r.source, { cascade: true })
	relatedManual: DealRelated[]

	// SEO & indexation
	@Column({ type: 'text', nullable: true, name: 'seo_meta_title' })
	seoMetaTitle?: string | null

	@Column({ type: 'text', nullable: true, name: 'seo_meta_description' })
	seoMetaDescription?: string | null

	@Column({ type: 'enum', enum: EOgImageMode, default: EOgImageMode.USE_HERO, name: 'og_image_mode' })
	ogImageMode: EOgImageMode
	@Column({ type: 'text', nullable: true, name: 'og_image_url' })
	ogImageUrl?: string | null
	@Column({ type: 'text', nullable: true, name: 'canonical_url' })
	canonicalUrl?: string | null

	@Column({ type: 'boolean', default: true, name: 'allow_indexing' })
	allowIndexing: boolean

	// Publishing workflow
	@Index()
	@Column({ type: 'enum', enum: EDealStatus, default: EDealStatus.DRAFT })
	status: EDealStatus

	@Column({ type: 'timestamptz', nullable: true, name: 'publish_at' })
	publishAt?: Date | null

	@Column({ type: 'timestamptz', nullable: true, name: 'expire_at' })
	expireAt?: Date | null

	@Column({ type: 'timestamptz', nullable: true, name: 'last_published_at' })
	lastPublishedAt?: Date | null

	// Коментарі вмикаються глобально + локально
	@Column({ type: 'boolean', default: true, name: 'comments_enabled' })
	commentsEnabled: boolean

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	@Index()
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
