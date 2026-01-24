import { IsBoolean, IsString } from 'class-validator'

export class PostReplyDto {
	@IsString()
	message: string
	@IsBoolean()
	sendEmail: boolean
}
