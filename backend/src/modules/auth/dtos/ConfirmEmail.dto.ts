import { IsUUID } from 'class-validator'

export class ConfirmEmailDto {
	@IsUUID(4)
	token: string
}
