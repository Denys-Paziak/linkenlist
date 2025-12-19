import { Type } from 'class-transformer'
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator'

import { EDealCategory } from '../../../interfaces/EDealCategory'

export class GetAllDealsDto {
	@IsOptional()
	@IsString()
	@MinLength(2)
	search?: string

	@IsOptional()
	@IsEnum(['popularity'])
	sort?: 'popularity'

	@IsOptional()
	@IsEnum(EDealCategory)
	category?: EDealCategory

	@Type(() => Number)
	@IsInt()
	@Min(1)
	limit: number

	@Type(() => Number)
	@IsInt()
	@Min(1)
	page: number

	@IsOptional()
	@Type(() => Boolean)
	@IsBoolean()
	isFeatured?: boolean

	@IsOptional()
	@Type(() => Boolean)
	@IsBoolean()
	isFavorite?: boolean
}
