import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { ECommentPageType } from '../../../interfaces/ECommentPageType'
import { ECommentStatus } from '../../../interfaces/ECommentStatus'
import { Deal } from '../../deal/entities/Deal.entity'
import { Resource } from '../../resource/entities/Resource.entity'
import { User } from '../../user/entities/User.entity'

import { CommentRating } from './CommentRating.entity'

@Entity('comments')
export class Comment {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'text' })
	body: string

	@Column({ type: 'enum', enum: ECommentStatus, default: ECommentStatus.PENDING })
	status: ECommentStatus

	@OneToMany(() => CommentRating, cr => cr.comment)
	ratings: CommentRating[]

	@Column({ type: 'enum', enum: ECommentPageType, name: 'page_type' })
	pageType: ECommentPageType

	@ManyToOne(() => Deal, deal => deal.id, { nullable: true, onDelete: 'CASCADE' })
	pageDeal: Deal | null

	@ManyToOne(() => Resource, resource => resource.id, { nullable: true, onDelete: 'CASCADE' })
	pageResource: Resource | null

	@ManyToOne(() => User, user => user.id, { nullable: false, onDelete: 'CASCADE' })
	user: User

	@ManyToOne(() => Comment, comment => comment.id, { nullable: true, onDelete: 'CASCADE' })
	parent: Comment | null

	@OneToMany(() => Comment, comment => comment.parent)
	replies: Comment[]

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	@Index()
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
