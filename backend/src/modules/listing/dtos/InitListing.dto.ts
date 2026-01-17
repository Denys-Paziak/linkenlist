import { IsEnum, IsOptional, IsString } from 'class-validator'

import { EPackageType } from '../../../interfaces/EPackageType'

export class InitListingDto {
	@IsEnum(EPackageType)
	package: EPackageType

	@IsString()
	zip: string | null

	@IsOptional()
	@IsString()
	state?: string | null

	@IsOptional()
	@IsString()
	city?: string | null
}
