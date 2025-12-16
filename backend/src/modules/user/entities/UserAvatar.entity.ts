import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { EFileStatus } from '../../../interfaces/EFileStatus'
import { User } from './User.entity'

@Entity('user_avatar')
export class UserAvatar {
	@PrimaryGeneratedColumn()
	id: number

	@OneToOne(() => User, user => user.avatar)
	user: User

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

	@Column({ type: 'enum', enum: EFileStatus, default: EFileStatus.QUEUED })
	status: EFileStatus

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
