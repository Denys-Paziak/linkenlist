import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm'

import { User } from '../../user/entities/User.entity'

import { Comment } from './Comment.entity'

@Entity('comment-rating')
@Unique(['comment', 'user'])
export class CommentRating {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => Comment, comment => comment.ratings, { nullable: false, onDelete: 'CASCADE' })
	comment: Comment

	@ManyToOne(() => User, user => user.id, { nullable: false, onDelete: 'CASCADE' })
	user: User

	@Column({ type: 'enum', enum: ['like', 'dislike'] })
	type: 'like' | 'dislike'

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
