import { Transform, Type } from 'class-transformer'
import {
	IsBoolean,
	IsEnum,
	IsInt,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	MaxLength,
	Min,
	registerDecorator,
	ValidationArguments,
	ValidationOptions
} from 'class-validator'

function IsMinLessThanOrEqual(property: string, validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isMinLessThanOrEqual',
			target: object.constructor,
			propertyName,
			options: validationOptions,
			constraints: [property],
			validator: {
				validate(value: any, args: ValidationArguments) {
					const [relatedPropertyName] = args.constraints
					const relatedValue = (args.object as any)[relatedPropertyName]

					if (value == null || relatedValue == null) return true
					if (typeof value !== 'number' || typeof relatedValue !== 'number') return true

					return relatedValue <= value
				}
			}
		})
	}
}

export enum EDealType {
	SALE = 'sale',
	RENT = 'rent',
	INACTIVE = 'inactive'
}

export enum ESortBy {
	RECOMMENDED = 'recommended',
	PRICE_ASC = 'price_asc',
	PRICE_DESC = 'price_desc',
	NEWEST = 'newest',
	OLDEST = 'oldest',
	MOST_RELEVANT = 'most_relevant'
}

export class GetAllListingsDto {
	@IsOptional()
	@IsEnum(EDealType)
	dealType?: EDealType

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(0)
	minPrice?: number

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(0)
	@IsMinLessThanOrEqual('minPrice', {
		message: 'maxPrice must be greater than or equal to minPrice'
	})
	maxPrice?: number

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	beds?: number

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(0)
	baths?: number

	@IsOptional()
	@Type(() => Boolean)
	@IsBoolean()
	bedsExact?: boolean

	@IsOptional()
	@Type(() => Boolean)
	@IsBoolean()
	bathsExact?: boolean

	@IsOptional()
	@IsString()
	propertyTypes?: string

	@IsOptional()
	@IsString()
	@MaxLength(200)
	keywords?: string

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	minSqft?: number

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	@IsMinLessThanOrEqual('minSqft', {
		message: 'maxSqft must be greater than or equal to minSqft'
	})
	maxSqft?: number

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1700)
	minYearBuilt?: number

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1700)
	@IsMinLessThanOrEqual('minYearBuilt', {
		message: 'maxYearBuilt must be greater than or equal to minYearBuilt'
	})
	maxYearBuilt?: number

	@IsOptional()
	@Type(() => Boolean)
	@IsBoolean()
	noHoa?: boolean

	@IsOptional()
	@Type(() => Boolean)
	@IsBoolean()
	petFriendly?: boolean

	@IsOptional()
	@Type(() => Boolean)
	@IsBoolean()
	garage?: boolean

	@IsOptional()
	@IsEnum(ESortBy)
	sortBy?: ESortBy

	@Type(() => Number)
	@IsInt()
	@Min(1)
	limit: number

	@Type(() => Number)
	@IsInt()
	@Min(1)
	page: number

	@IsOptional()
	@Transform(({ value }) => Number(value))
	@IsNumber()
	@Min(-90)
	@Max(90)
	swLat: number

	@IsOptional()
	@Transform(({ value }) => Number(value))
	@IsNumber()
	@Min(-180)
	@Max(180)
	swLng: number

	@IsOptional()
	@Transform(({ value }) => Number(value))
	@IsNumber()
	@Min(-90)
	@Max(90)
	neLat: number

	@IsOptional()
	@Transform(({ value }) => Number(value))
	@IsNumber()
	@Min(-180)
	@Max(180)
	neLng: number
}
