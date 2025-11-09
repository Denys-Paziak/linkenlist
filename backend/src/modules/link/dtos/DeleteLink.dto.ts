import { IsEnum } from 'class-validator'

export class DeleteLinkDto {
	@IsEnum(['soft', 'hard'])
	method: 'soft' | 'hard'
}
