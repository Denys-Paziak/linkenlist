import { IsEnum, IsInt, IsOptional, IsPositive, IsString, MinLength } from 'class-validator'

import { ECommentPageType } from '../../../interfaces/ECommentPageType'

export class PostCommentDto {
	@IsString()
	@MinLength(1)
	body: string

	@IsOptional()
	@IsInt()
	@IsPositive()
	parentId?: number

	@IsEnum(ECommentPageType)
	pageType: ECommentPageType

	@IsInt()
	@IsPositive()
	pageId: number
}
