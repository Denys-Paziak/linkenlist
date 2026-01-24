import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

import { EContactInboxType } from '../../../interfaces/EContactInboxType'

export class ContactUsDto {
	@IsEnum(EContactInboxType)
	type: EContactInboxType

	@IsString()
	@MinLength(2)
	@MaxLength(80)
	name: string

	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string

	@IsString()
	@MinLength(3)
	@MaxLength(120)
	subject: string

	@IsString()
	@MinLength(10)
	@MaxLength(1000)
	message: string
}
