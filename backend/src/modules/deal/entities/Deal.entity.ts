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

import { EDealStatus } from '../../../interfaces/EDealStatus'
import { EDealType } from '../../../interfaces/EDealType'
import { LinkImage } from '../../link/entities/LinkImage.entity'

import { DealImage } from './DealImage.entity'
import { DealRelated } from './DealRelated.entity'
import { DealSection } from './DealSection.entity'
import { DealTag } from './DealTag.entity'
import { EDealCategory } from '../../../interfaces/EDealCategory'

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

	@Column({ type: 'boolean', default: false })
	isVerified: boolean

	@Column({ type: 'boolean', default: false })
	isFeatured: boolean

	@Column({ type: 'enum', enum: EDealCategory, array: true, default: [] })
	categories: EDealCategory[]

	@ManyToMany(() => DealTag, { cascade: ['insert'] })
	@JoinTable({ name: 'deal_tags_join' })
	tags: DealTag[]

	@Column({ type: 'text', name: "outbound_url", nullable: true })
	outboundURL?: string | null

	@Column({ type: 'text', name: "outbound_url_button_label", default: "Go to Deal" })
	outboundURLButtonLabel: string

	// Offer Details
	@Column({ type: 'boolean', default: true })
	offerEnabled: boolean

	@Column({ type: 'enum', enum: EDealType, nullable: true })
	dealType?: EDealType | null

	@Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
	originalPrice?: string | null

	@Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
	yourPrice?: string | null

	@Column({ type: 'text', nullable: true })
	promoCode?: string | null
	@Column({ type: 'text', nullable: true })
	whereToEnterCode?: string | null

	@Column({ type: 'boolean', default: false })
	ongoingOffer: boolean

	@Column({ type: 'date', nullable: true })
	validFrom?: string | null
	@Column({ type: 'date', nullable: true })
	validUntil?: string | null

	@Column({ type: 'text', nullable: true })
	providerDisplayName?: string | null

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

	@Column({ type: 'text', nullable: true })
	ogImageMode?: string | null // "use_hero" | "custom"
	@Column({ type: 'text', nullable: true })
	ogImageUrl?: string | null
	@Column({ type: 'text', nullable: true })
	canonicalUrl?: string | null

	@Column({ type: 'boolean', default: true })
	allowIndexing: boolean

	// Publishing workflow
	@Index()
	@Column({ type: 'enum', enum: EDealStatus, default: EDealStatus.DRAFT })
	status: EDealStatus

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
