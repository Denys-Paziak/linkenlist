import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class LoginDto {
	@ApiProperty({
		description: 'User email',
		example: 'example@gmail.com',
		type: String,
		format: 'email'
	})
	@IsString()
	@IsEmail()
	email: string

	@ApiProperty({
		description: 'Password user',
		example: 'StrongPass123',
		minLength: 8,
		maxLength: 64,
		type: String
	})
	@IsString()
	@MinLength(8)
	@MaxLength(64)
	password: string
}
