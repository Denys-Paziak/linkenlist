import { IsString, MaxLength, MinLength, Validate } from 'class-validator'
import { IsPasswordsEqual } from '../../../decorators/is-passwords-equal.decorator'

export class ChangePasswordDto {
    @IsString()
    @MinLength(8)
    @MaxLength(64)
    currentPassword: string

    @IsString()
    @MinLength(8)
    @MaxLength(64)
    newPassword: string

    @IsString()
    @MinLength(8)
    @MaxLength(64)
    @Validate(IsPasswordsEqual)
    confirmNewPassword: string
}
