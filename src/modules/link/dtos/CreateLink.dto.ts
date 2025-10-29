import { Type } from 'class-transformer'
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator'

import { ELinkBranch } from '@/interfaces/ELinkBranch'
import { ELinkCategory } from '@/interfaces/ELinkCategory'

export class CreateLinkDto {
	@IsOptional()
	@IsUrl()
	imgUrl?: string

	@IsString()
	@IsNotEmpty()
	title: string

	@IsString()
	@IsOptional()
	shortDescription?: string

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
	@Type(() => String)
	tags: string[]
}
