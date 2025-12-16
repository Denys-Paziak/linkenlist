import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator'

export class GetAllResourcesAdminDto {
	@IsOptional()
	@IsString()
	@MinLength(2)
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
