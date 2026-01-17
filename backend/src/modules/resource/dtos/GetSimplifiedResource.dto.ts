import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class GetSimplifiedResourceDto {
	@IsOptional()
	@IsString()
	search?: string

	@Type(() => Number)
	@IsInt()
	@Min(1)
	limit: number

	@Type(() => Number)
	@IsInt()
	@Min(1)
	page: number
}
