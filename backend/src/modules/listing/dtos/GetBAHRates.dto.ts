import { Transform } from 'class-transformer'
import { IsEnum, IsString } from 'class-validator'

import { EBahPaygrade } from '../../../interfaces/EBahPaygrade'

export class GetBAHRatesDto {
	@Transform(({ value }) =>
		String(value ?? '')
			.trim()
	)
	@IsString()
	search: string

	@IsEnum(EBahPaygrade)
	paygrade: EBahPaygrade
}
