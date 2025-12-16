import { IsString, MaxLength, MinLength } from 'class-validator'

export class ResetPasswordForUserDto {
	@IsString()
	@MinLength(8)
	@MaxLength(64)
	temporaryPassword: string
}
