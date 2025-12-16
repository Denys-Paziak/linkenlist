import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator'

export class BanUserDto {
	@IsOptional()
	@IsInt()
	@Min(1)
	duration?: number

	@IsOptional()
	@IsBoolean()
	permanent?: boolean

	@IsString()
	reason: string
}
