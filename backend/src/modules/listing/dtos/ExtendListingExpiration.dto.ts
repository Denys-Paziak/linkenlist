import { IsEnum } from 'class-validator'

import { EPackageType } from '../../../interfaces/EPackageType'

export class ExtendListingExpirationDto {
	@IsEnum(EPackageType)
	package: EPackageType
}
