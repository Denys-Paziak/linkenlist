import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator'

import { EContactInboxStatus } from '../../../interfaces/EContactInboxStatus'

export class GetAllContactInboxesAdminDto {
	@Type(() => Number)
	@IsInt()
	@Min(1)
	limit: number

	@Type(() => Number)
	@IsInt()
	@Min(1)
	page: number

	@IsOptional()
	@IsString()
	@MinLength(2)
	search?: string

	@IsOptional()
	@IsEnum(EContactInboxStatus)
	status?: EContactInboxStatus
}
