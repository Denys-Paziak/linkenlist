import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { ETokenTypes } from '@/interfaces/ETokenTypes'

import { User } from '../../../modules/user/entities/User.entity'

@Entity({ name: 'tokens' })
export class Token {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'varchar', unique: true })
	tokenOrCode: string

	@Column({
		type: 'timestamptz',
		name: 'expires_in'
	})
	expiresIn: Date

	@Column({ type: 'enum', enum: ETokenTypes })
	type: ETokenTypes

	@ManyToOne(() => User, user => user.tokens, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user: User

	@CreateDateColumn({ type: 'timestamptz', select: false, name: 'created_at'  })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', select: false, name: 'updated_at'  })
	updatedAt: Date
}
