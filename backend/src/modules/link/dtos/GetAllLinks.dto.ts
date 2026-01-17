import { Type } from 'class-transformer'
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator'

import { ELinkBranch } from '../../../interfaces/ELinkBranch'
import { ELinkCategory } from '../../../interfaces/ELinkCategory'

export class GetAllLinksDto {
	@IsOptional()
	@IsString()
	@MinLength(2)
	search?: string

	@IsOptional()
	@IsEnum(['most_used', 'recently_verified', 'alphabetical', 'official_first', 'popularity'])
	sort?: 'most_used' | 'recently_verified' | 'alphabetical' | 'official_first' | 'popularity'

	@IsOptional()
	@IsEnum(ELinkCategory)
	category?: ELinkCategory

	@IsOptional()
	@IsEnum(ELinkBranch)
	branch?: ELinkBranch

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
	isFavorite?: boolean
}
