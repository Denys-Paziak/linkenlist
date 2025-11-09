import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MaxLength, MinLength, Validate } from 'class-validator'

import { IsPasswordsEqual } from '../../../decorators/is-passwords-equal.decorator'

export class RegistrationDto {
	@ApiProperty({
		description: 'New user first name',
		example: 'Steve',
		type: String
	})
	@IsString()
	firstName: string

	@ApiProperty({
		description: 'New user last name',
		example: 'Johnson',
		type: String
	})
	@IsString()
	lastName: string

	@ApiProperty({
		description: 'New user email',
		example: 'example@gmail.com',
		type: String,
		format: 'email'
	})
	@IsString()
	@IsEmail()
	email: string

	@ApiProperty({
		description: 'New user password',
		example: 'StrongPass123',
		minLength: 8,
		maxLength: 64,
		type: String
	})
	@IsString()
	@MinLength(8)
	@MaxLength(64)
	password: string

	@ApiProperty({
		description: 'Confirm the new password (must match the "password" field)',
		example: 'StrongPass123',
		minLength: 8,
		maxLength: 64,
		type: String
	})
	@IsString()
	@MinLength(8)
	@MaxLength(64)
	@Validate(IsPasswordsEqual)
	confirmPassword: string
}
