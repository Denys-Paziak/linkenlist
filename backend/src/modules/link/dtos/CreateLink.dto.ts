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
	Matches
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
	title: string

	@IsString()
	@IsOptional()
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
	@Type(() => String)
	@IsString({ each: true })
	@Matches(/^[A-Za-z0-9-]+$/, {
		each: true,
		message: 'Tags can only contain letters, numbers, and hyphens'
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
