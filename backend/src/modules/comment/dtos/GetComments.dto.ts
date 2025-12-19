import { Type } from 'class-transformer'
import { IsInt, Min } from 'class-validator'

export class GetCommentsDto {
	@Type(() => Number)
	@IsInt()
	@Min(1)
	limit: number

	@Type(() => Number)
	@IsInt()
	@Min(1)
	page: number
}
