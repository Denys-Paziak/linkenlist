import { CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { Resource } from './Resource.entity'

@Entity('resource_related')
@Index(['source', 'target'], { unique: true })
export class ResourceRelated {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => Resource, r => r.relatedManual, { onDelete: 'CASCADE' })
	source: Resource

	@ManyToOne(() => Resource, { onDelete: 'CASCADE' })
	target: Resource

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	@Index()
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
