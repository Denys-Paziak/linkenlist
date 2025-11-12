import { Type } from 'class-transformer'
import { IsBoolean, IsDate, IsEnum, IsOptional } from 'class-validator'

import { EDealStatus } from '../../../interfaces/EDealStatus'

export class ChangeStatusDto {
	@IsEnum(EDealStatus)
	status: EDealStatus

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	schedulePublish?: Date

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	scheduleExpire?: Date

	@IsOptional()
	@IsBoolean()
	showComments?: boolean
}
