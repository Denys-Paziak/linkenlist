import { IsArray, IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator'

import { ECommentStatus } from '../../../interfaces/ECommentStatus'

export class UpdateCommentsStatusDto {
	@IsArray()
	@IsNotEmpty()
	@IsInt({ each: true })
	@Min(1, { each: true })
	commentIds: number[]

	@IsEnum(ECommentStatus)
	status: ECommentStatus
}
