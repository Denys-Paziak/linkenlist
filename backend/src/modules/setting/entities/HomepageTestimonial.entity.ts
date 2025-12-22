import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('settings_homepage_testimonial')
export class HomepageTestimonial {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'text', nullable: true })
	name: string | null

	@Column({ type: 'text', nullable: true })
	date: string | null

	@Column({ type: 'text', nullable: true })
	location: string | null

	@Column({ type: 'text', nullable: true })
	comment: string | null

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
