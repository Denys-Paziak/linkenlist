import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, In, Repository } from 'typeorm'

import { FORBIDDEN_WORDS_EN, FORBIDDEN_WORDS_UA_RU } from '../../../constants/FORBIDDEN_WORDS'
import { ECommentPageType } from '../../../interfaces/ECommentPageType'
import { ECommentStatus } from '../../../interfaces/ECommentStatus'
import { ERoleName } from '../../../interfaces/ERoleName'
import { ITokenUser } from '../../../interfaces/ITokenUser'
import { DeleteCommentsDto } from '../dtos/DeleteComments.dto'
import { EditCommentDto } from '../dtos/EditComment.dto'
import { PostCommentDto } from '../dtos/PostComment.dto'
import { UpdateCommentsStatusDto } from '../dtos/UpdateCommentsStatus.dto'
import { Comment } from '../entities/Comment.entity'
import { CommentRating } from '../entities/CommentRating.entity'

@Injectable()
export class CommentCommandService {
	constructor(
		@InjectRepository(Comment)
		private readonly commentRepository: Repository<Comment>,

		private readonly dataSource: DataSource
	) {}

	private readonly forbiddenWords = [...FORBIDDEN_WORDS_EN, ...FORBIDDEN_WORDS_UA_RU]

	private forbiddenRegex: RegExp | null = null

	private getForbiddenRegex(): RegExp | null {
		if (this.forbiddenRegex) return this.forbiddenRegex
		if (!this.forbiddenWords.length) return null

		const escaped = this.forbiddenWords
			.map(w => w.trim())
			.filter(Boolean)
			.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

		if (!escaped.length) return null

		this.forbiddenRegex = new RegExp(`(^|\\s|[\\p{P}\\p{S}])(${escaped.join('|')})(?=$|\\s|[\\p{P}\\p{S}])`, 'iu')
		return this.forbiddenRegex
	}

	private normalizeText(input: string): string {
		return (input ?? '')
			.normalize('NFKD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()
	}

	private containsForbiddenWords(text: string): boolean {
		const rx = this.getForbiddenRegex()
		if (!rx) return false
		const normalized = this.normalizeText(text)
		return rx.test(normalized)
	}

	async postComment(user: ITokenUser, dto: PostCommentDto) {
		const shouldHide = this.containsForbiddenWords(dto.body)

		if (shouldHide) {
			throw new BadRequestException('Comment contains forbidden words')
		}

		const comment = await this.commentRepository.save({
			user: { id: user.id },
			body: dto.body,
			pageType: dto.pageType,
			pageDeal: dto.pageType === ECommentPageType.DEAL ? { id: dto.pageId } : null,
			pageResource: dto.pageType === ECommentPageType.RESOURCE ? { id: dto.pageId } : null,
			parent: dto.parentId ? { id: dto.parentId } : null,
			status: user.role === ERoleName.ADMIN ? ECommentStatus.APPROVED : ECommentStatus.PENDING
		})

		return this.commentRepository.findOne({
			where: { id: comment.id },
			select: {
				id: true,
				body: true,
				status: true,
				pageType: true,
				createdAt: true,
				updatedAt: true,
				user: {
					id: true,
					username: true,
					firstName: true,
					lastName: true,
					avatar: {
						id: true,
						url: true,
						width: true,
						height: true
					}
				}
			},
			relations: {
				user: {
					avatar: true
				}
			}
		})
	}

	async editComment(userId: number, commentId: number, dto: EditCommentDto) {
		const shouldHide = this.containsForbiddenWords(dto.body)
		if (shouldHide) {
			throw new BadRequestException('Comment contains forbidden words')
		}
		const upd = await this.commentRepository.update({ id: commentId, user: { id: userId } }, { body: dto.body })

		if (upd.affected === 0) {
			throw new BadRequestException('Comment not found or you are not the owner')
		}
	}

	private async toggleRating(userId: number, commentId: number, target: 'like' | 'dislike') {
		await this.dataSource.transaction(async manager => {
			const repo = manager.getRepository(CommentRating)

			const del = await repo
				.createQueryBuilder()
				.delete()
				.from(CommentRating)
				.where('userId = :userId AND commentId = :commentId AND type = :target', { userId, commentId, target })
				.execute()

			if ((del.affected ?? 0) > 0) return

			await repo
				.createQueryBuilder()
				.insert()
				.into(CommentRating)
				.values({
					user: { id: userId } as any,
					comment: { id: commentId } as any,
					type: target
				})
				.onConflict(
					`
					("commentId","userId")
					DO UPDATE SET
						"type" = EXCLUDED."type",
						"updated_at" = now()
				`
				)
				.execute()
		})
	}

	async likeComment(userId: number, commentId: number) {
		return this.toggleRating(userId, commentId, 'like')
	}

	async dislikeComment(userId: number, commentId: number) {
		return this.toggleRating(userId, commentId, 'dislike')
	}

	async updateCommentsStatus(dto: UpdateCommentsStatusDto) {
		const result = await this.commentRepository.update({ id: In(dto.commentIds) }, { status: dto.status })

		return { updated: result.affected ?? 0 }
	}

	async deleteComments(user: ITokenUser, dto: DeleteCommentsDto) {
		const result = await this.commentRepository.delete({
			id: In(dto.commentIds),
			...(user.role !== ERoleName.ADMIN ? { user: { id: user.id } } : {})
		})

		return { deleted: result.affected ?? 0 }
	}
}
