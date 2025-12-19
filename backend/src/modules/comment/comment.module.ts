import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CommentAdminController } from './controllers/comment-admin.controller'
import { CommentController } from './controllers/comment.controller'
import { Comment } from './entities/Comment.entity'
import { CommentRating } from './entities/CommentRating.entity'
import { CommentCommandService } from './services/comment-command.service'
import { CommentQueryService } from './services/comment-query.service'

@Module({
	imports: [TypeOrmModule.forFeature([Comment, CommentRating])],
	controllers: [CommentController, CommentAdminController],
	providers: [CommentQueryService, CommentCommandService]
})
export class CommentModule {}
