import { Type } from 'class-transformer'
import {
	IsArray,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
	Length,
	Matches,
	Min,
	ValidateIf
} from 'class-validator'

import { ELinkBranch } from '../../../interfaces/ELinkBranch'
import { ELinkCategory } from '../../../interfaces/ELinkCategory'
import { ELinkStatus } from '../../../interfaces/ELinkStatus'
import { Nullable } from '../../../validators/nullable.transform'

export class UpdateLinkDto {
	@IsInt()
	@Min(1)
	@Type(() => Number)
	id: number

	@Nullable()
	@ValidateIf(o => o.imgUrl !== null)
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
	@Type(() => String)
	branches?: ELinkBranch[]

	@IsOptional()
	@IsArray()
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
	tags?: string[]

	@IsOptional()
	@IsEnum(ELinkStatus)
	status?: ELinkStatus

	@IsOptional()
	@IsEnum(['true', 'false'])
	verified?: 'true' | 'false'
}
