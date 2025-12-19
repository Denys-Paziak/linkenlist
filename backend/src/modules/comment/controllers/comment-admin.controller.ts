import { Body, Controller, Get, Patch, Post, Query, Req } from '@nestjs/common'
import type { FastifyRequest } from 'fastify'

import { Authorization } from '../../../decorators/auth.decorator'
import { ERoleName } from '../../../interfaces/ERoleName'
import { ITokenUser } from '../../../interfaces/ITokenUser'
import { GetCommentsAdminDto } from '../dtos/GetCommentsAdmin.dto'
import { PostCommentDto } from '../dtos/PostComment.dto'
import { UpdateCommentsStatusDto } from '../dtos/UpdateCommentsStatus.dto'
import { CommentCommandService } from '../services/comment-command.service'
import { CommentQueryService } from '../services/comment-query.service'

@Controller('admin/comments')
export class CommentAdminController {
	constructor(
		private readonly commentQueryService: CommentQueryService,
		private readonly commentCommandService: CommentCommandService
	) {}

	@Authorization(ERoleName.ADMIN)
	@Post()
	async postComment(@Req() request: FastifyRequest, @Body() dto: PostCommentDto) {
		const userFromToken = request.user as ITokenUser

		return await this.commentCommandService.postComment(userFromToken, dto)
	}

	@Authorization(ERoleName.ADMIN)
	@Get()
	async getCommentsAdmin(@Query() query: GetCommentsAdminDto) {
		return await this.commentQueryService.getCommentsAdmin(query)
	}

	@Authorization(ERoleName.ADMIN)
	@Patch('status')
	async updateCommentsStatus(@Body() dto: UpdateCommentsStatusDto) {
		await this.commentCommandService.updateCommentsStatus(dto)

		return {
			ok: true
		}
	}
}
