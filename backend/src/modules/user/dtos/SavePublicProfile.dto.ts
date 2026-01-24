import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator'

export class SavePublicProfileDto {
	@IsOptional()
	@IsString()
	avatar?: string | null 

	@IsOptional()
	@IsString()
	@MaxLength(150)
	firstName?: string

	@IsOptional()
	@IsString()
	@MaxLength(150)
	lastName?: string

	@IsOptional()
	@IsString()
	@MaxLength(255)
	professionalTitle?: string

	@IsOptional()
	@IsString()
	@MaxLength(255)
	company?: string

	@IsOptional()
	@IsString()
	@MaxLength(20)
	@Matches(/^[0-9+\-()\s]*$/, {
		message: 'phone must contain only digits, spaces, parentheses, plus or hyphen'
	})
	phone?: string

	@IsOptional()
	@IsString()
	@MaxLength(255)
	@IsEmail()
	publicEmail?: string

	@IsBoolean()
	isPrivate: boolean
}
