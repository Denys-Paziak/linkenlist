import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import type { FastifyRequest } from 'fastify'

import { Authorization } from '../../../decorators/auth.decorator'
import { OptionalAuthorization } from '../../../decorators/optional-auth.decorator'
import { ParamId } from '../../../dtos/ParamId.dto'
import { ERoleName } from '../../../interfaces/ERoleName'
import { ITokenUser } from '../../../interfaces/ITokenUser'
import { EditCommentDto } from '../dtos/EditComment.dto'
import { GetCommentsDto } from '../dtos/GetComments.dto'
import { PostCommentDto } from '../dtos/PostComment.dto'
import { CommentCommandService } from '../services/comment-command.service'
import { CommentQueryService } from '../services/comment-query.service'
import { DeleteCommentsDto } from '../dtos/DeleteComments.dto'

@Controller('comments')
export class CommentController {
	constructor(
		private readonly commentQueryService: CommentQueryService,
		private readonly commentCommandService: CommentCommandService
	) {}

	@OptionalAuthorization()
	@Get('deal/:id')
	async getCommentsByDeal(@Req() request: FastifyRequest, @Param() params: ParamId, @Query() query: GetCommentsDto) {
		const userFromToken = request.user as ITokenUser | undefined

		return await this.commentQueryService.getCommentsByDeal(params.id, query, userFromToken?.id)
	}

	@OptionalAuthorization()
	@Get('resource/:id')
	async getCommentsByResource(@Req() request: FastifyRequest, @Param() params: ParamId, @Query() query: GetCommentsDto) {
		const userFromToken = request.user as ITokenUser | undefined

		return await this.commentQueryService.getCommentsByResource(params.id, query, userFromToken?.id)
	}

	@OptionalAuthorization()
	@Get(':id/replies')
	async getCommentsByParent(@Req() request: FastifyRequest, @Param() params: ParamId, @Query() query: GetCommentsDto) {
		const userFromToken = request.user as ITokenUser | undefined

		return await this.commentQueryService.getCommentsByParent(params.id, query, userFromToken?.id)
	}

	@Throttle({ default: { limit: 10, ttl: 60 * 1000 } })
	@Authorization(ERoleName.USER, ERoleName.ADMIN)
	@Post()
	async postComment(@Req() request: FastifyRequest, @Body() dto: PostCommentDto) {
		const userFromToken = request.user as ITokenUser

		return await this.commentCommandService.postComment(userFromToken, dto)
	}

	@Authorization(ERoleName.USER, ERoleName.ADMIN)
	@Patch(':id')
	async editComment(@Req() request: FastifyRequest, @Param() params: ParamId, @Body() dto: EditCommentDto) {
		const userFromToken = request.user as ITokenUser

		await this.commentCommandService.editComment(userFromToken.id, params.id, dto)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.USER, ERoleName.ADMIN)
	@Patch(':id/like')
	async likeComment(@Req() request: FastifyRequest, @Param() params: ParamId) {
		const userFromToken = request.user as ITokenUser

		await this.commentCommandService.likeComment(userFromToken.id, params.id)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.USER, ERoleName.ADMIN)
	@Patch(':id/dislike')
	async dislikeComment(@Req() request: FastifyRequest, @Param() params: ParamId) {
		const userFromToken = request.user as ITokenUser

		await this.commentCommandService.dislikeComment(userFromToken.id, params.id)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.USER, ERoleName.ADMIN)
    @Delete()
    async deleteComments(@Req() request: FastifyRequest, @Body() dto: DeleteCommentsDto) {
		const userFromToken = request.user as ITokenUser

        await this.commentCommandService.deleteComments(userFromToken, dto)

        return {
            ok: true
        }
    }
}
