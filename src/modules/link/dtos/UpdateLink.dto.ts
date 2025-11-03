import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, Length, Matches } from 'class-validator'

import { ELinkBranch } from '../../../interfaces/ELinkBranch'
import { ELinkCategory } from '../../../interfaces/ELinkCategory'
import { ELinkStatus } from '../../../interfaces/ELinkStatus'

export class UpdateLinkDto {
	@IsOptional()
	@IsUrl()
	imgUrl?: string | null

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	title?: string

	@IsString()
	@IsOptional()
	description?: string

	@IsOptional()
	@IsUrl()
	url?: string

	@IsOptional()
	@IsEnum(ELinkCategory)
	category?: ELinkCategory

	@IsOptional()
	@IsEnum(ELinkBranch, { each: true })
	branches?: ELinkBranch[]

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@Matches(/^[A-Za-z0-9-]+$/, {
		each: true,
		message: 'Tags can only contain letters, numbers, and hyphens'
	})
	@Length(2, 30, {
		each: true,
		message: 'Each tag must be between 2 and 30 characters long'
	})
	tags?: string[] | null

	@IsOptional()
	@IsEnum(ELinkStatus)
	status?: ELinkStatus

	@IsOptional()
	@IsBoolean()
	verified?: boolean
}
