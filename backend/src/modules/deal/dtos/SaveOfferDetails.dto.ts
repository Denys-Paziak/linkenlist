import {
	IsBoolean,
	IsDefined,
	IsEnum,
	IsISO8601,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	MaxLength,
	Min,
	Validate,
	ValidateIf,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from 'class-validator'

import { EDealCadencePrice } from '../../../interfaces/EDealCadencePrice'
import { EDealType } from '../../../interfaces/EDealType'

@ValidatorConstraint({ name: 'YourPriceNotGreaterThanOriginal', async: false })
class YourPriceNotGreaterThanOriginal implements ValidatorConstraintInterface {
	validate(_: any, args: ValidationArguments) {
		const obj = args.object as SaveOfferDetailsDto
		if (obj.yourPrice == null || obj.originalPrice == null) return true
		return obj.yourPrice <= obj.originalPrice
	}
	defaultMessage(_: ValidationArguments) {
		return 'yourPrice cannot be greater than originalPrice'
	}
}

@ValidatorConstraint({ name: 'DatesOrder', async: false })
export class DatesOrder implements ValidatorConstraintInterface {
	validate(value: any, args: ValidationArguments) {
		const obj = args.object as SaveOfferDetailsDto

		if (!obj?.validFrom || !value) return true

		const from = Date.parse(obj.validFrom)
		const until = Date.parse(value)
		if (Number.isNaN(from) || Number.isNaN(until)) return true

		return from <= until
	}

	defaultMessage(_: ValidationArguments) {
		return 'validUntil must be the same day or later than validFrom'
	}
}

export class SaveOfferDetailsDto {
	@IsOptional()
	@IsEnum(EDealType)
	dealType?: EDealType

	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	@Max(9999999999.99)
	originalPrice?: number

	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	@Max(9999999999.99)
	@Validate(YourPriceNotGreaterThanOriginal)
	yourPrice?: number

	@IsOptional()
	@IsEnum(EDealCadencePrice)
	cadencePrice?: EDealCadencePrice

	@IsOptional()
	@IsString()
	@MaxLength(120)
	promoCode?: string

	@IsOptional()
	@IsString()
	@MaxLength(200)
	whereToEnterCode?: string

	@IsOptional()
	@IsBoolean()
	ongoingOffer?: boolean

	@ValidateIf(o => o.ongoingOffer === false)
	@IsDefined({ message: 'validUntil is required when ongoingOffer is false' })
	@IsISO8601({ strict: true }, { message: 'validFrom must be a valid ISO date (YYYY-MM-DD)' })
	validFrom?: string

	@ValidateIf(o => o.ongoingOffer === false)
	@IsDefined({ message: 'validUntil is required when ongoingOffer is false' })
	@IsISO8601({ strict: true }, { message: 'validUntil must be a valid ISO date (YYYY-MM-DD)' })
	@Validate(DatesOrder)
	validUntil?: string

	@IsOptional()
	@IsString()
	@MaxLength(120)
	providerDisplayName?: string
}

export const __SaveOfferDetailsDtoValidators = {
	YourPriceNotGreaterThanOriginal,
	DatesOrder
}
