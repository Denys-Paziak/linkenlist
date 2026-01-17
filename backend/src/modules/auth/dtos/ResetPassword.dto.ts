import { IsString, IsUUID, MaxLength, MinLength, Validate } from 'class-validator'
import { IsPasswordsEqual } from '../../../decorators/is-passwords-equal.decorator'

export class ResetPasswordDto {
	@IsUUID(4)
	token: string

	@IsString()
	@MinLength(8)
	@MaxLength(64)
	password: string

	@IsString()
	@MinLength(8)
	@MaxLength(64)
	@Validate(IsPasswordsEqual)
	confirmPassword: string
}
