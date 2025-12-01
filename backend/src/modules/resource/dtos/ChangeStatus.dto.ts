import { Type } from 'class-transformer'
import {
	IsBoolean,
	IsDate,
	IsEnum,
	IsOptional,
	Validate,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from 'class-validator'

import { EResourceStatus } from '../../../interfaces/EResourceStatus'

@ValidatorConstraint({ name: 'DatesOrder', async: false })
export class DatesOrder implements ValidatorConstraintInterface {
	validate(value: any, args: ValidationArguments) {
		const obj = args.object as ChangeStatusDto

		const from = obj.schedulePublish
		const until = value as Date

		if (!from || !until) return true

		if (isNaN(from.getTime()) || isNaN(until.getTime())) return true

		return from <= until
	}

	defaultMessage(_: ValidationArguments) {
		return 'scheduleExpire must be the same day or later than schedulePublish'
	}
}

export class ChangeStatusDto {
	@IsEnum(EResourceStatus)
	status: EResourceStatus

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	schedulePublish?: Date

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	@Validate(DatesOrder)
	scheduleExpire?: Date

	@IsOptional()
	@IsBoolean()
	commentsEnabled?: boolean
}
