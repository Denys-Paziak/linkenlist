import { Type } from 'class-transformer'
import {
	ArrayMaxSize,
	ArrayNotEmpty,
	IsArray,
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
	Length,
	Matches,
	MaxLength
} from 'class-validator'

import { ELinkBranch } from '../../../interfaces/ELinkBranch'
import { ELinkCategory } from '../../../interfaces/ELinkCategory'
import { ELinkStatus } from '../../../interfaces/ELinkStatus'

export class CreateLinkDto {
	@IsOptional()
	@IsUrl()
	imgUrl?: string

	@IsString()
	@IsNotEmpty()
	@MaxLength(40)
	title: string

	@IsString()
	@IsOptional()
	@MaxLength(200)
	description?: string

	@IsUrl()
	url: string

	@IsEnum(ELinkCategory)
	category: ELinkCategory

	@IsEnum(ELinkBranch, { each: true })
	@ArrayNotEmpty()
	@Type(() => String)
	branches: ELinkBranch[]

	@IsArray()
	@ArrayNotEmpty()
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
	tags: string[]

	@IsEnum(ELinkStatus)
	status: ELinkStatus

	@IsBoolean()
	verified: boolean
}
