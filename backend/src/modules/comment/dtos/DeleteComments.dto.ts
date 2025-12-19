import { IsArray, IsInt, IsNotEmpty, Min } from 'class-validator'

export class DeleteCommentsDto {
	@IsArray()
	@IsNotEmpty()
	@IsInt({ each: true })
	@Min(1, { each: true })
	commentIds: number[]
}
