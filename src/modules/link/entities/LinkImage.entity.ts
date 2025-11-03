import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { ELinkImageStatus } from '../../../interfaces/ELinkImage'

import { Link } from './Link.entity'

@Entity('links_images')
export class LinkImage {
	@PrimaryGeneratedColumn()
	id: number

	@OneToOne(() => Link, link => link.image)
	link: Link

	@Column({ type: 'text' })
	url: string

	@Column({ type: 'text', name: 'original_key', nullable: true, select: false })
	originalKey?: string | null

	@Column({ type: 'text', name: 'processed_key', nullable: true, select: false })
	processedKey?: string | null

	@Column({ type: 'int' })
	width: number

	@Column({ type: 'int' })
	height: number

	@Column({ type: 'enum', enum: ELinkImageStatus, default: ELinkImageStatus.QUEUED })
	status: ELinkImageStatus

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
