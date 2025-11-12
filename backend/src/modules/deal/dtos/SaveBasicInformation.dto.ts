import {
	ArrayMaxSize,
	ArrayNotEmpty,
	IsArray,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
	Length,
	Matches,
	MaxLength
} from 'class-validator'

import { EDealCategory } from '../../../interfaces/EDealCategory'

export class SaveBasicInformationDto {
	@IsOptional()
	@IsString()
	@MaxLength(140)
	@IsNotEmpty()
	title?: string

	@IsString()
	@IsOptional()
	@MaxLength(140)
	@Matches(/^[a-z0-9-]+$/, {
		message: 'Slug can only contain letters, numbers, and special characters'
	})
	slug?: string

	@IsString()
	@IsOptional()
	@MaxLength(200)
	teaser?: string

	@IsOptional()
	@IsArray()
	@ArrayNotEmpty()
	@IsEnum(EDealCategory, { each: true })
	categories?: EDealCategory[]

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
	@IsUrl()
	imgUrl?: string

	@IsOptional()
	@IsUrl()
	outboundUrl?: string

	@IsOptional()
	@IsString()
	outboundUrlButtonLabel?: string
}
