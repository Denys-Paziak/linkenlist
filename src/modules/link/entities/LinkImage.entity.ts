import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Link } from './Link.entity'

@Entity('links_images')
export class LinkImage {
	@PrimaryGeneratedColumn()
	id: number

	@OneToOne(() => Link, link => link.image)
	link: Link

	@Column({ type: 'text' })
	url: string

	@Column({ type: 'text' })
	key: string

	@Column({ type: 'int' })
	width: number

	@Column({ type: 'int' })
	height: number

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
