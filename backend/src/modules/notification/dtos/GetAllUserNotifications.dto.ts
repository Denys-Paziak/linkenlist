import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator'

import { ENotificationStatus } from '../../../interfaces/ENotificationStatus'

export class GetAllUserNotificationsDto {
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
	@IsEnum(ENotificationStatus)
	status?: ENotificationStatus
}
