import { Type } from 'class-transformer'
import { IsInt, Min } from 'class-validator'

export class GetOwnerAllListingsDto {
	@Type(() => Number)
	@IsInt()
	@Min(1)
	limit: number

	@Type(() => Number)
	@IsInt()
	@Min(1)
	page: number
}
