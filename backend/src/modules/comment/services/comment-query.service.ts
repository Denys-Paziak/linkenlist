import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, In, Repository, SelectQueryBuilder } from 'typeorm'

import { ECommentPageType } from '../../../interfaces/ECommentPageType'
import { ECommentStatus } from '../../../interfaces/ECommentStatus'
import { GetCommentsDto } from '../dtos/GetComments.dto'
import { GetCommentsAdminDto } from '../dtos/GetCommentsAdmin.dto'
import { Comment } from '../entities/Comment.entity'
import { CommentRating } from '../entities/CommentRating.entity'

type CommentItem = Comment & {
	likesCount: number
	dislikesCount: number
	liked?: boolean
	disliked?: boolean
}

@Injectable()
export class CommentQueryService {
	constructor(
		@InjectRepository(Comment)
		private readonly commentRepository: Repository<Comment>,

		@InjectRepository(CommentRating)
		private readonly commentRatingRepository: Repository<CommentRating>
	) {}

	async getCommentsAdmin(query: GetCommentsAdminDto) {
		const page = Math.max(1, Number(query.page ?? 1))
		const limit = Math.max(1, Number(query.limit ?? 20))
		const offset = (page - 1) * limit

		const qb = this.commentRepository
			.createQueryBuilder('comment')
			.select([
				'comment.id',
				'comment.body',
				'comment.status',
				'comment.pageType',
				'comment.createdAt',
				'comment.updatedAt'
			])
			.leftJoin('comment.user', 'user')
			.addSelect(['user.id', 'user.firstName', 'user.lastName', 'user.username', 'user.privateEmail', 'user.createdAt'])
			.leftJoin('comment.pageDeal', 'deal')
			.addSelect(['deal.id', 'deal.title', 'deal.slug'])
			.leftJoin('comment.pageResource', 'resource')
			.addSelect(['resource.id', 'resource.title', 'resource.slug'])

		if (query.status) {
			qb.andWhere('comment.status = :status', { status: query.status })
		}

		if (query.pageType) {
			qb.andWhere('comment.pageType = :pageType', { pageType: query.pageType })
		}

		if (query.search?.trim()) {
			const search = `%${query.search.trim()}%`
			qb.andWhere(
				new Brackets(sqb => {
					sqb.where('comment.body ILIKE :search', { search })
						.orWhere('user.firstName ILIKE :search', { search })
						.orWhere('user.lastName ILIKE :search', { search })
						.orWhere('user.privateEmail ILIKE :search', { search })
				})
			)
		}

		qb.orderBy('comment.createdAt', 'DESC').skip(offset).take(limit)

		const [items, total] = await qb.getManyAndCount()
		return [items, total]
	}

	async getCommentsByDeal(dealId: number, query: GetCommentsDto, userId?: number) {
		const qb = this.baseCommentsQb(query, userId)
			.andWhere('comment.pageType = :pageType', { pageType: ECommentPageType.DEAL })
			.andWhere('comment.pageDealId = :dealId', { dealId })
			.andWhere('comment.parentId IS NULL')

		const [items, total] = await qb.getManyAndCount()
		const enriched = await this.enrichWithUserReaction(items as CommentItem[], userId)

		return [enriched, total]
	}

	async getCommentsByResource(resourceId: number, query: GetCommentsDto, userId?: number) {
		const qb = this.baseCommentsQb(query, userId)
			.andWhere('comment.pageType = :pageType', { pageType: ECommentPageType.RESOURCE })
			.andWhere('comment.pageResourceId = :resourceId', { resourceId })
			.andWhere('comment.parentId IS NULL')

		const [items, total] = await qb.getManyAndCount()
		const enriched = await this.enrichWithUserReaction(items as CommentItem[], userId)

		return [enriched, total]
	}

	async getCommentsByParent(commentId: number, query: GetCommentsDto, userId?: number) {
		const qb = this.baseCommentsQb(query, userId).andWhere('comment.parentId = :commentId', { commentId })

		const [items, total] = await qb.getManyAndCount()
		const enriched = await this.enrichWithUserReaction(items as CommentItem[], userId)

		return [enriched, total]
	}

	private baseCommentsQb(query: GetCommentsDto, userId?: number) {
		const page = Math.max(1, Number(query.page ?? 1))
		const limit = Math.max(1, Number(query.limit ?? 20))
		const offset = (page - 1) * limit

		const qb = this.commentRepository
			.createQueryBuilder('comment')
			.select([
				'comment.id',
				'comment.body',
				'comment.status',
				'comment.pageType',
				'comment.createdAt',
				'comment.updatedAt'
			])
			.leftJoin('comment.user', 'user')
			.addSelect(['user.id', 'user.username', 'user.firstName', 'user.lastName'])
			.leftJoinAndSelect('user.avatar', 'avatar')
			.addSelect(['avatar.id', 'avatar.url', 'avatar.width', 'avatar.height'])
			.loadRelationCountAndMap('comment.likesCount', 'comment.ratings', 'cr_like', qb => qb.where("cr_like.type = 'like'"))
			.loadRelationCountAndMap('comment.dislikesCount', 'comment.ratings', 'cr_dislike', qb =>
				qb.where("cr_dislike.type = 'dislike'")
			)
			.loadRelationCountAndMap('comment.repliesCount', 'comment.replies', 'reply', qb => {
				if (userId) {
					return qb.where('(reply.status = :approvedStatus OR reply.userId = :userId)', {
						approvedStatus: ECommentStatus.APPROVED,
						userId
					})
				} else {
					return qb.where('reply.status = :approvedStatus', {
						approvedStatus: ECommentStatus.APPROVED
					})
				}
			})
			.orderBy('comment.createdAt', 'DESC')
			.skip(offset)
			.take(limit)

		if (userId) {
			qb.where('(comment.status = :approvedStatus OR comment.userId = :userId)', {
				approvedStatus: ECommentStatus.APPROVED,
				userId
			})
		} else {
			qb.where('comment.status = :approvedStatus', {
				approvedStatus: ECommentStatus.APPROVED
			})
		}

		return qb
	}

	private async enrichWithUserReaction(items: CommentItem[], userId?: number) {
		if (!userId) {
			return items.map(c => ({ ...c, liked: false, disliked: false }))
		}

		const ids = items.map(c => c.id).filter(Boolean)
		if (ids.length === 0) return []

		const rows = await this.commentRatingRepository
			.createQueryBuilder('cr')
			.select('cr.commentId', 'commentId')
			.addSelect('cr.type', 'type')
			.where('cr.userId = :userId', { userId })
			.andWhere('cr.commentId IN (:...ids)', { ids })
			.getRawMany<{ commentId: number; type: 'like' | 'dislike' }>()

		const byCommentId = new Map<number, 'like' | 'dislike'>()
		for (const r of rows) byCommentId.set(Number(r.commentId), r.type)

		return items.map(c => {
			const type = byCommentId.get(c.id)
			return {
				...c,
				liked: type === 'like',
				disliked: type === 'dislike'
			}
		})
	}
}
