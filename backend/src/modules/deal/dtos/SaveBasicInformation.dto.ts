import { Type } from 'class-transformer'
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
	@IsInt()
	id?: number

	@IsOptional()
	@IsString()
	@MaxLength(140)
	title?: string

	@IsString()
	@IsOptional()
	@MaxLength(140)
	slug?: string

	@IsString()
	@IsOptional()
	@MaxLength(200)
	teaser?: string

	@IsEnum(EDealCategory, { each: true })
	@ArrayNotEmpty()
	@Type(() => String)
	branches: EDealCategory[]

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
	@IsString()
    outboundURL?: string

    @IsOptional()
	@IsString()
    outboundURLButtonLabel?: string
}
