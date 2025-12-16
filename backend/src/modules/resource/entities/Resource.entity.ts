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

import { EOgImageMode } from '../../../interfaces/EOgImageMode'
import { EResourceCategory } from '../../../interfaces/EResourceCategory'
import { EResourceFormat } from '../../../interfaces/EResourceFormat'

import { ResourceImage } from './ResourceImage.entity'
import { ResourceRelated } from './ResourceRelated.entity'
import { ResourceSection } from './ResourceSection.entity'
import { ResourceTag } from './ResourceTag.entity'
import { EResourceStatus } from '../../../interfaces/EResourceStatus'
import { Deal } from '../../deal/entities/Deal.entity'

@Entity('resources')
@Unique(['slug'])
export class Resource {
	@PrimaryGeneratedColumn()
	id: number

	@Index()
	@Column({ type: 'text', nullable: true })
	title?: string

	@Index()
	@Column({ type: 'text', nullable: true })
	slug?: string | null

	@Column({ type: 'text', nullable: true })
	teaser?: string | null

	@OneToOne(() => ResourceImage, { cascade: true, nullable: true, onDelete: 'SET NULL' })
	@JoinColumn({ name: 'image_id' })
	image?: ResourceImage | null

	@Column({ type: 'enum', enum: EResourceFormat, nullable: true })
	format?: EResourceFormat

	@Column({ type: 'enum', enum: EResourceCategory, array: true, default: [] })
	categories: EResourceCategory[]

	@ManyToMany(() => ResourceTag, { cascade: ['insert'] })
	@JoinTable({ name: 'resource_tags_join' })
	tags: ResourceTag[]

	@Column({ type: 'text', name: 'tags_text', default: '' })
  	tagsText: string

	@Column({ type: 'boolean', default: false, name: 'is_featured' })
	isFeatured: boolean

	// Content (Markdown секції)
	@OneToMany(() => ResourceSection, s => s.resource, { cascade: true })
	sections: ResourceSection[]

	// Surfacing & related (ручний порядок)
	@Column({ type: 'boolean', default: true, name: 'related_auto_mode' })
	relatedAutoMode: boolean

	@OneToMany(() => ResourceRelated, r => r.source, { cascade: true })
	relatedManual: ResourceRelated[]

	// SEO & indexation
	@Column({ type: 'text', nullable: true, name: 'seo_meta_title' })
	seoMetaTitle?: string | null

	@Column({ type: 'text', nullable: true, name: 'seo_meta_description' })
	seoMetaDescription?: string | null

	@Column({ type: 'enum', enum: EOgImageMode, default: EOgImageMode.USE_HERO, name: 'og_image_mode' })
	ogImageMode: EOgImageMode

	@OneToOne(() => ResourceImage, { cascade: true, nullable: true, onDelete: 'SET NULL' })
	@JoinColumn({ name: 'og_image_id' })
	ogImage?: ResourceImage

	@Column({ type: 'text', nullable: true, name: 'canonical_url' })
	canonicalUrl?: string | null

	@Column({ type: 'boolean', default: true, name: 'allow_indexing' })
	allowIndexing: boolean

	// Publishing workflow
	@Index()
	@Column({ type: 'enum', enum: EResourceStatus, default: EResourceStatus.DRAFT })
	status: EResourceStatus

	@Column({ type: 'timestamptz', nullable: true, name: 'publish_at' })
	publishAt?: Date | null

	@Column({ type: 'timestamptz', nullable: true, name: 'expire_at' })
	expireAt?: Date | null

	@Column({ type: 'timestamptz', nullable: true, name: 'last_published_at' })
	lastPublishedAt?: Date | null

	// Коментарі вмикаються глобально + локально
	@Column({ type: 'boolean', default: true, name: 'comments_enabled' })
	commentsEnabled: boolean

	@OneToOne(() => Deal, { cascade: true, nullable: true, onDelete: 'SET NULL' })
	@JoinColumn({ name: 'featured_deal_id' })
	featuredDeal?: Deal | null

	@Column({ type: 'int', default: 0, name: 'total_helpful' })
	totalHelpful: number

	@Column({ type: 'int', default: 0, name: 'helpful_30d' })
	helpful30d: number

	@Column({ type: 'int', default: 0, name: 'total_views' })
	totalViews: number

	@Column({ type: 'int', default: 0, name: 'views_30d' })
	views30d: number

	@Column({ type: 'int', default: 1, name: 'popular_score' })
	popularScore: number

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	@Index()
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date

	@Column({ type: 'tsvector', select: false, nullable: true })
  	search_document: any
}
