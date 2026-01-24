import { IsEnum } from 'class-validator'

import { ENotificationStatus } from '../../../interfaces/ENotificationStatus'

export class ChangeStatusDto {
	@IsEnum(ENotificationStatus)
	status: ENotificationStatus
}
