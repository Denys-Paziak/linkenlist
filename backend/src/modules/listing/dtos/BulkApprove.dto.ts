import { IsArray, IsInt, IsNotEmpty, Min } from 'class-validator'

export class BulkApproveDto {
	@IsArray()
	@IsNotEmpty()
	@IsInt({ each: true })
	@Min(1, { each: true })
	listingsIds: number[]
}
