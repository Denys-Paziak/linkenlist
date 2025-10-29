import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class ResendConfirmationEmailDto {
	@ApiProperty({
		description: 'User email',
		example: 'example@gmail.com',
		type: String,
		format: 'email'
	})
	@IsString()
	@IsEmail()
	email: string
}
