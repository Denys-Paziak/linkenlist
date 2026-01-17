import { IsEmail, IsString } from 'class-validator'

export class ResendConfirmationEmailDto {
	@IsString()
	@IsEmail()
	email: string
}
