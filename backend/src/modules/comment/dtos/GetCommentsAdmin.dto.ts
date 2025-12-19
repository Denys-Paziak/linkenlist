import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator'

import { ECommentPageType } from '../../../interfaces/ECommentPageType'
import { ECommentStatus } from '../../../interfaces/ECommentStatus'

export class GetCommentsAdminDto {
	@Type(() => Number)
	@IsInt()
	@Min(1)
	limit: number

	@Type(() => Number)
	@IsInt()
	@Min(1)
	page: number

	@IsOptional()
	@IsString()
	@MinLength(2)
	search?: string

	@IsOptional()
	@IsEnum(ECommentStatus)
	status?: ECommentStatus

	@IsOptional()
	@IsEnum(ECommentPageType)
	pageType?: ECommentPageType
}
