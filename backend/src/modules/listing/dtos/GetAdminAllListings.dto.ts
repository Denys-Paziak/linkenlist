import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator'

export enum ListingAdminFilter {
	DRAFT = "draft",
	PENDING = "pending",
	REPORTED = "reported",
	EXPIRING = "expiring",
	DUBLICATES = "duplicates"
}

export class GetAdminAllListingsDto {
	@Type(() => Number)
	@IsInt()
	@Min(1)
	limit: number

	@Type(() => Number)
	@IsInt()
	@Min(1)
	page: number

	@IsOptional()
	@IsEnum(ListingAdminFilter)
	filter?: ListingAdminFilter
}
