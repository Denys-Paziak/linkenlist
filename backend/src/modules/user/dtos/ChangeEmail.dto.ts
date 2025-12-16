import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class ChangeEmailDto {
	@IsString()
	@IsEmail()
	newEmail: string

	@IsString()
	@MinLength(8)
	@MaxLength(64)
	currentPassword: string
}
