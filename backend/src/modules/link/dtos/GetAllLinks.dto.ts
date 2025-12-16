import { ApiProperty } from '@nestjs/swagger'
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
	@IsEnum(['most_used', 'recently_verified', 'alphabetical', 'official_first'])
	sort?: 'most_used' | 'recently_verified' | 'alphabetical' | 'official_first'

	@IsOptional()
	@IsEnum(ELinkCategory)
	category?: ELinkCategory

	@IsOptional()
	@IsEnum(ELinkBranch)
	branch?: ELinkBranch

	@Type(() => Number)
	@IsInt()
	@Min(1)
	@ApiProperty({
		description: 'Number of users per page for pagination',
		example: 10,
		type: Number,
		required: false,
		minimum: 1
	})
	limit: number

	@Type(() => Number)
	@IsInt()
	@Min(1)
	@ApiProperty({
		description: 'Page number for pagination',
		example: 1,
		type: Number,
		required: false,
		minimum: 1
	})
	page: number

	@IsOptional()
	@Type(() => Boolean)
	@IsBoolean()
	isFavorite?: boolean
}
