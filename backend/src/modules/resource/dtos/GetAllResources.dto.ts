import { Type } from 'class-transformer'
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator'

import { EResourceCategory } from '../../../interfaces/EResourceCategory'
import { EResourceFormat } from '../../../interfaces/EResourceFormat'

export class GetAllResourcesDto {
	@IsOptional()
	@IsString()
	@MinLength(2)
	search?: string

	@IsOptional()
	@IsEnum(['popularity'])
	sort?: 'popularity'

	@IsOptional()
	@IsEnum(EResourceCategory)
	category?: EResourceCategory

	@IsOptional()
	@IsEnum(EResourceFormat)
	format?: EResourceFormat

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
