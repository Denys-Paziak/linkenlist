import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('settings_general')
export class GeneralSetting {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'text' })
	key: string

	@Column({ type: 'text', nullable: true })
	value: string | null

	@Column({ type: 'text', name: 'default_value' })
	defaultValue: string

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
