import { IsArray, IsInt, Min } from 'class-validator'

export class SetSelectRelatedDto {
	@IsInt({ each: true })
	@Min(1, { each: true })
	@IsArray()
	dealIds: number[]
}
