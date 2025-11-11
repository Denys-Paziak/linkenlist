import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	JoinTable,
	ManyToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	Unique,
	UpdateDateColumn
} from 'typeorm'

import { ELinkBranch } from '../../../interfaces/ELinkBranch'
import { ELinkCategory } from '../../../interfaces/ELinkCategory'
import { ELinkStatus } from '../../../interfaces/ELinkStatus'

import { LinkImage } from './LinkImage.entity'
import { LinkTag } from './LinkTag.entity'

@Entity('links')
export class Link {
	@PrimaryGeneratedColumn()
	id: number

	@Index()
	@Column({ type: 'text' })
	title: string

	@Column({ type: 'text', nullable: true })
	description?: string | null

	@Column({ type: 'text' })
	url: string

	@OneToOne(() => LinkImage, { cascade: true, eager: true, nullable: true, onDelete: 'SET NULL' })
	@JoinColumn({ name: 'image_id' })
	image?: LinkImage

	@Index()
	@Column({ type: 'enum', enum: ELinkCategory })
	category: ELinkCategory

	@ManyToMany(() => LinkTag)
	@JoinTable({ name: 'link_tags_join' })
	tags: LinkTag[]

	@Column({ type: 'enum', enum: ELinkBranch, array: true })
	branches: ELinkBranch[]

	@Column({ type: 'enum', enum: ELinkStatus, default: ELinkStatus.PUBLISHED })
	status: ELinkStatus

	@Column({ type: 'boolean', default: false })
	verified: boolean

	@Column({ type: 'timestamptz', nullable: true })
	verifiedAt?: Date | null

	@Column({ type: 'enum', enum: ['system', 'admin'], nullable: true })
	verifiedBy?: 'system' | 'admin' | null

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	@Index()
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
