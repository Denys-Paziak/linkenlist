// src/entities/deals/deal.entity.ts
import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
	Unique,
	UpdateDateColumn
} from 'typeorm'

import { DealRelated } from './DealRelated.entity'
import { DealSection } from './DealSection.entity'
import { DealTag } from './DealTag.entity'

export enum DealStatus {
	DRAFT = 'draft',
	SCHEDULED = 'scheduled',
	PUBLISHED = 'published',
	EXPIRED = 'expired',
	ARCHIVED = 'archived'
}
export enum DealType {
	PERCENTAGE = 'percentage',
	FIXED = 'fixed',
	FREE = 'free',
	SUBSCRIPTION = 'subscription'
}

@Entity('deals')
@Unique(['slug'])
export class Deal {
	@PrimaryGeneratedColumn()
	id: number

	@Index()
	@Column({ type: 'text' })
	title: string

	@Index()
	@Column({ type: 'text' })
	slug: string

	@Column({ type: 'text', nullable: true })
	teaser?: string | null

	@Column({ type: 'text', nullable: true })
	heroImageUrl?: string | null

	@Column({ type: 'boolean', default: false })
	isVerified: boolean

	@Column({ type: 'boolean', default: false })
	isFeatured: boolean

	// Основна категорія + додаткові
	@Index()
	@Column({ type: 'text', nullable: true })
	primaryCategory?: string | null

	@Column({ type: 'text', array: true, default: [] })
	categories: string[]

	@ManyToMany(() => DealTag, { cascade: ['insert'] })
	@JoinTable({ name: 'deal_tags_join' })
	tags: DealTag[]

	// Offer Details
	@Column({ type: 'boolean', default: true })
	offerEnabled: boolean

	@Column({ type: 'enum', enum: DealType, nullable: true })
	dealType?: DealType | null

	@Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
	originalPrice?: string | null

	@Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
	yourPrice?: string | null

	@Column({ type: 'text', nullable: true }) promoCode?: string | null
	@Column({ type: 'text', nullable: true }) whereToEnterCode?: string | null

	@Column({ type: 'boolean', default: false })
	ongoingOffer: boolean

	@Column({ type: 'date', nullable: true }) validFrom?: string | null
	@Column({ type: 'date', nullable: true }) validUntil?: string | null

	@Column({ type: 'text', nullable: true }) providerDisplayName?: string | null

	// Content (Markdown секції)
	@OneToMany(() => DealSection, b => b.deal, { cascade: true })
	contentBlocks: DealSection[]

	// Surfacing & related (ручний порядок)
	@OneToMany(() => DealRelated, r => r.source, { cascade: true })
	relatedManual: DealRelated[]

	// SEO & indexation
	@Column({ type: 'text', nullable: true })
	seoMetaTitle?: string | null

	@Column({ type: 'text', nullable: true })
	seoMetaDescription?: string | null

	@Column({ type: 'text', nullable: true }) ogImageMode?: string | null // "use_hero" | "custom"
	@Column({ type: 'text', nullable: true }) ogImageUrl?: string | null
	@Column({ type: 'text', nullable: true }) canonicalUrl?: string | null

	@Column({ type: 'boolean', default: true })
	allowIndexing: boolean

	// Publishing workflow
	@Index()
	@Column({ type: 'enum', enum: DealStatus, default: DealStatus.DRAFT })
	status: DealStatus

	@Column({ type: 'timestamptz', nullable: true })
	publishAt?: Date | null

	@Column({ type: 'timestamptz', nullable: true })
	expireAt?: Date | null

	@Column({ type: 'timestamptz', nullable: true })
	lastPublishedAt?: Date | null

	// Коментарі вмикаються глобально + локально
	@Column({ type: 'boolean', default: true })
	commentsEnabled: boolean

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	@Index()
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
