import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm'

import { ELinkBranch } from '@/interfaces/ELinkBranch'
import { ELinkCategory } from '@/interfaces/ELinkCategory'

export enum LinkStatus {
	PUBLISHED = 'published',
	DRAFT = 'draft',
	ARCHIVED = 'archived'
}

@Entity('links')
@Unique(['slug'])
export class Link {
	@PrimaryGeneratedColumn()
	id: number

	@Index()
	@Column({ type: 'text' })
	title: string

	@Index()
	@Column({ type: 'text', unique: true })
	slug: string

	@Column({ type: 'text', nullable: true })
	description?: string | null

	@Column({ type: 'text' })
	url: string

	@Column({ type: 'text' })
	imageUrl: string

	@Index()
	@Column({ type: 'enum', enum: ELinkCategory })
	category: ELinkCategory

	@Column({ type: 'text', array: true, default: '{}' })
	tags: string[]

	@Column({ type: 'enum', enum: ELinkBranch, array: true })
	branches: ELinkBranch[]

	@Column({ type: 'enum', enum: LinkStatus, default: LinkStatus.PUBLISHED })
	status: LinkStatus

	@Column({ type: 'boolean', default: false })
	verified: boolean

	@Column({ type: 'timestamptz', nullable: true })
	verifiedAt?: Date | null

	@Column({ type: 'uuid', nullable: true })
	verifiedBy?: string | null // admin userId

	@Column({ type: 'timestamptz', nullable: true })
	lastCheckedAt?: Date | null

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	@Index()
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
