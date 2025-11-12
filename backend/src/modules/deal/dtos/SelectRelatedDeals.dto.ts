import { IsArray, IsInt, Min } from 'class-validator'

export class SelectRelatedDealsDto {
	@IsInt({ each: true })
	@Min(1)
	@IsArray()
	dealId: number[]
}
