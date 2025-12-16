import { Type } from "class-transformer"
import { IsOptional, IsString, MinLength, IsInt, Min, IsBoolean } from "class-validator"

export class GetAllUsersDto {
	@IsOptional()
	@IsString()
	@MinLength(2)
	search?: string

	@IsOptional()
	@Type(() => Boolean)
	@IsBoolean()
	banned?: boolean

	@Type(() => Number)
	@IsInt()
	@Min(1)
	limit: number

	@Type(() => Number)
	@IsInt()
	@Min(1)
	page: number
}
