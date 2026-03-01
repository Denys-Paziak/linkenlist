import { IsArray, IsInt, IsNotEmpty, Min } from 'class-validator'

export class BulkDeleteDto {
	@IsArray()
	@IsNotEmpty()
	@IsInt({ each: true })
	@Min(1, { each: true })
	listingsIds: number[]
}
