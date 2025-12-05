import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator'

import { ELinkCategory } from '../../../interfaces/ELinkCategory'
import { ELinkStatus } from '../../../interfaces/ELinkStatus'

export class GetAllLinksAdminDto {
	@IsOptional()
	@IsString()
	search?: string

	@IsOptional()
	@IsEnum(ELinkCategory)
	category?: ELinkCategory

	@IsOptional()
	@IsEnum(ELinkStatus)
	status?: ELinkStatus

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
}
