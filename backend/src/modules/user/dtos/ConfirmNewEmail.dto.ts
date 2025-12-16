import { IsUUID } from 'class-validator'

export class ConfirmNewEmailDto {
	@IsUUID(4)
	token: string
}
