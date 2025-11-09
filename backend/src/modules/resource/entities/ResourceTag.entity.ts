import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm'

@Entity('resource_tags')
@Unique(['name'])
export class ResourceTag {
	@PrimaryGeneratedColumn()
	id: number

	@Index()
	@Column({ type: 'text' })
	name: string

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	@Index()
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
