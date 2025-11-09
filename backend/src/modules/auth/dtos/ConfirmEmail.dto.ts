import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class ConfirmEmailDto {
	@ApiProperty({
		description: ' Email confirmation UUID token',
		example: 'd4f6c5e8-1df0-4a25-95b7-fd3d8d4cc9ae',
		type: String,
		format: 'uuid'
	})
	@IsUUID(4)
	token: string
}
