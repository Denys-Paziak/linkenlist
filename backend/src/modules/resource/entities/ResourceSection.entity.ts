import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { Resource } from './Resource.entity'

@Entity('resource_sections')
export class ResourceSection {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => Resource, r => r.sections, { onDelete: 'CASCADE' })
	resource!: Resource

	@Index()
	@Column({ type: 'int' })
	position: number

	@Column({ type: 'text' }) title: string
	@Column({ type: 'boolean', default: true }) enabled: boolean
	@Column({ type: 'text', nullable: true }) bodyMd?: string | null

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	@Index()
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
