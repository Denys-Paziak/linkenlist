import { Type } from 'class-transformer'
import {
	IsArray,
	IsBoolean,
	IsDate,
	IsEmail,
	IsEnum,
	IsInt,
	IsNumber,
	IsOptional,
	IsString,
	IsUrl,
	Max,
	MaxLength,
	Min,
	MinDate,
	registerDecorator,
	ValidateNested,
	ValidationArguments,
	ValidationOptions
} from 'class-validator'

import { EPackageType } from '../../../interfaces/EPackageType'

class Seller {
	@IsOptional()
	@IsString()
	@MaxLength(150)
	firstName?: string | null

	@IsOptional()
	@IsString()
	@MaxLength(150)
	lastName?: string | null

	@IsOptional()
	@IsString()
	@MaxLength(255)
	company?: string | null

	@IsOptional()
	@IsString()
	@MaxLength(20)
	primaryPhone?: string | null

	@IsOptional()
	@IsBoolean()
	hidePrimaryPhone?: boolean

	@IsOptional()
	@IsString()
	@MaxLength(20)
	alternativePhone?: string | null

	@IsOptional()
	@IsBoolean()
	hideAlternativePhone?: boolean

	@IsOptional()
	@IsEmail()
	@MaxLength(255)
	email?: string | null

	@IsOptional()
	@IsBoolean()
	hideEmail?: boolean
}

class Location {
	@IsOptional()
	@IsString()
	street?: string | null

	@IsOptional()
	@IsString()
	unit?: string | null

	@IsOptional()
	@IsString()
	zip?: string | null

	@IsOptional()
	@IsString()
	state?: string | null

	@IsOptional()
	@IsString()
	city?: string | null
}

class Pricing {
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	listPrice?: number | null

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	monthlyRent?: number | null

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	securityDeposit?: number | null

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	applicationFee?: number | null

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	@MinDate(new Date())
	dateAvailable?: Date | null

	@IsOptional()
	@IsString()
	leaseTerm?: string | null

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	petPolicy?: string[] | null
}

class Property {
	@IsOptional()
	@IsString()
	propertyType?: string | null

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	bedrooms?: number | null

	@IsOptional()
	@Type(() => Number)
	@IsNumber({ maxDecimalPlaces: 1 }, { message: 'bathroomsFull must have at most 1 decimal place' })
	@Min(0)
	@Max(999.9)
	bathroomsFull?: number | null

	@IsOptional()
	@Type(() => Number)
	@IsNumber({ maxDecimalPlaces: 1 }, { message: 'bathroomsHalf must have at most 1 decimal place' })
	@Min(0)
	@Max(999.9)
	bathroomsHalf?: number | null

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	interiorSize?: number | null

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1600)
	@Max(3000)
	yearBuilt?: number | null

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	stories?: number | null

	@IsOptional()
	@IsString()
	architecturalStyle?: string | null

	// HOA
	@IsOptional()
	@IsBoolean()
	hoaPresent: boolean

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	hoaFee?: number | null

	@IsOptional()
	@IsEnum(['monthly', 'quarterly', 'annually'])
	hoaFrequency?: 'monthly' | 'quarterly' | 'annually' | null

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	servicesIncluded?: string[] | null
}

class ListingDetails {
	@IsOptional()
	@IsString()
	@MaxLength(100)
	title?: string | null

	@IsOptional()
	@IsString()
	@DescriptionLengthByPackage()
	description?: string | null

	@IsOptional()
	@IsString()
	@IsUrl({ require_protocol: true })
	@IsAllowedVirtualTourUrl({
		message: 'Virtual tour URL: only YouTube, Matterport, Vimeo links are allowed'
	})
	virtualTourUrl?: string | null
}

class Amenities {
	@IsOptional()
	@IsString()
	subdivisionName?: string | null

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	communityFeatures?: string[] | null
}

export class InitListingAdminDto {
	@IsEnum(EPackageType)
	package: EPackageType

	@IsString()
	username: string

	@IsOptional()
	@ValidateNested()
	@Type(() => Seller)
	seller?: Seller

	@IsOptional()
	@ValidateNested()
	@Type(() => Location)
	location?: Location

	@IsOptional()
	@ValidateNested()
	@Type(() => Pricing)
	pricing?: Pricing

	@IsOptional()
	@ValidateNested()
	@Type(() => Property)
	property?: Property

	@IsOptional()
	@ValidateNested()
	@Type(() => ListingDetails)
	listingDetails?: ListingDetails

	@IsOptional()
	@ValidateNested()
	@Type(() => Amenities)
	amenities?: Amenities
}

function DescriptionLengthByPackage(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'DescriptionLengthByPackage',
			target: object.constructor,
			propertyName,
			options: validationOptions,
			validator: {
				validate(value: unknown, args: ValidationArguments) {
					if (value === null || value === undefined) return true
					if (typeof value !== 'string') return false

					const dto = args.object as { package?: EPackageType }

					if (!dto.package) return true

					const limits: Record<EPackageType, number> = {
						[EPackageType.BASIC]: 4000,
						[EPackageType.PREMIUM]: 8000
					}

					const limit = limits[dto.package] ?? 4000

					return value.length <= limit
				},

				defaultMessage(args: ValidationArguments) {
					const dto = args.object as { package?: EPackageType }

					if (dto.package === EPackageType.PREMIUM) {
						return 'description must not exceed 8000 characters for premium package'
					}

					return 'description must not exceed 4000 characters for basic package'
				}
			}
		})
	}
}

const ALLOWED_VIRTUAL_TOUR_DOMAINS = ['youtube.com', 'youtu.be', 'matterport.com', 'vimeo.com']

function IsAllowedVirtualTourUrl(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isAllowedVirtualTourUrl',
			target: object.constructor,
			propertyName,
			options: validationOptions,
			validator: {
				validate(value: unknown) {
					if (value === null || value === undefined || value === '') {
						return true // optional
					}

					if (typeof value !== 'string') return false

					try {
						const url = new URL(value)

						if (!['http:', 'https:'].includes(url.protocol)) {
							return false
						}

						const hostname = url.hostname.toLowerCase()

						return ALLOWED_VIRTUAL_TOUR_DOMAINS.some(domain => hostname === domain || hostname.endsWith(`.${domain}`))
					} catch {
						return false
					}
				}
			}
		})
	}
}
