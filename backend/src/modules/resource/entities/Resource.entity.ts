// src/entities/resources/resource.entity.ts
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

import { ResourceSection } from './ResourceSection.entity'
import { ResourceTag } from './ResourceTag.entity'

export enum ResourceFormat {
	GUIDE = 'guide',
	CHECKLIST = 'checklist',
	TOOL = 'tool',
	PDF = 'pdf'
}

@Entity('resources')
@Unique(['slug'])
export class Resource {
	@PrimaryGeneratedColumn()
	id: number

	@Index()
	@Column({ type: 'text' })
	title: string

	@Column({ type: 'text', unique: true }) slug: string

	@Column({ type: 'text', nullable: true })
	subtitle?: string | null

	@Column({ type: 'text', nullable: true }) imageUrl?: string | null

	@Column({ type: 'enum', enum: ResourceFormat })
	format: ResourceFormat

	@Column({ type: 'text', array: true, default: [] })
	categories: string[] // мультикатегорії (Housing/Travel/… )

	@ManyToMany(() => ResourceTag, { cascade: ['insert'] })
	@JoinTable({ name: 'resource_tags_join' })
	tags: ResourceTag[]

	// Статуси/бейджі
	@Column({ type: 'boolean', default: false })
	verified: boolean

	@Column({ type: 'boolean', default: false })
	featured: boolean

	// Контент
	@OneToMany(() => ResourceSection, s => s.resource, { cascade: true })
	sections: ResourceSection[]

	// Зв’язок з Featured Deal (опційно)
	@Column({ type: 'uuid', nullable: true })
	featuredDealId?: string | null

	@Column({ type: 'timestamptz', nullable: true })
	publishedAt?: Date | null

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	@Index()
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
