import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

import { Resource } from './Resource.entity'
import { ResourceSectionAttachment } from './ResourceSectionAttachment.entity'
import { ResourceSectionImages } from './ResourceSectionImages.entity'

@Entity('resource_sections')
export class ResourceSection {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => Resource, r => r.sections, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'resource_id' })
	resource: Resource

	@OneToMany(() => ResourceSectionAttachment, s => s.resourceSection, {
		cascade: true,
		eager: true,
		nullable: true,
		onDelete: 'SET NULL'
	})
	attachments?: ResourceSectionAttachment[]

	@OneToMany(() => ResourceSectionImages, s => s.resourceSection, {
		cascade: true,
		eager: true,
		nullable: true,
		onDelete: 'SET NULL'
	})
	images?: ResourceSectionImages[]

	@Index()
	@Column({ type: 'int' })
	position: number

	@Column({ type: 'text', default: 'Section' })
	title: string
	@Column({ type: 'boolean', default: true })
	enabled: boolean
	@Column({ type: 'text', nullable: true, name: 'body_md' })
	bodyMd?: string | null

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	@Index()
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
