import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { ENotificationStatus } from '../../../interfaces/ENotificationStatus'
import { User } from '../../user/entities/User.entity'

@Entity('notifications')
export class Notification {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'text' })
	title: string

	@Column({ type: 'text' })
	message: string

	@Column({ type: 'enum', enum: ENotificationStatus, default: ENotificationStatus.NEW })
	status: ENotificationStatus

	@ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
	sender: User | null

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	recipient: User

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
