import {
	ArrayMaxSize,
	ArrayNotEmpty,
	IsArray,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	Matches,
	MaxLength,
	Min
} from 'class-validator'

import { EResourceCategory } from '../../../interfaces/EResourceCategory'
import { EResourceFormat } from '../../../interfaces/EResourceFormat'

export class SaveBasicInformationDto {
	@IsOptional()
	@IsString()
	@MaxLength(140)
	@IsNotEmpty()
	title?: string

	@IsString()
	@IsOptional()
	@MaxLength(140)
	@Matches(/^[a-z0-9-_]+$/, {
		message: 'Slug can only contain lowercase letters, numbers, hyphens, and underscores.'
	})
	slug?: string

	@IsString()
	@IsOptional()
	@MaxLength(200)
	teaser?: string

	@IsOptional()
	@IsEnum(EResourceFormat)
	format?: EResourceFormat

	@IsOptional()
	@IsArray()
	@ArrayNotEmpty()
	@IsEnum(EResourceCategory, { each: true })
	categories?: EResourceCategory[]

	@IsOptional()
	@IsArray()
	@ArrayMaxSize(10)
	@IsString({ each: true })
	@Matches(/^[A-Za-z0-9 !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/, {
		each: true,
		message: 'Tags can only contain letters, numbers, spaces, and special characters'
	})
	@Length(2, 30, {
		each: true,
		message: 'Each tag must be between 2 and 30 characters long'
	})
	tags?: string[] | null

	@IsOptional()
	@IsInt()
	@Min(1)
	featuredDealId: number | null
}
