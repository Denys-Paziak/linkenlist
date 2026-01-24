import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator'

export class ListingReportDto {
	@IsString()
	@IsNotEmpty()
	reason: string
	@IsString()
	@IsNotEmpty()
	message: string

	@IsInt()
	@Min(0)
	listingId: number

	@IsString()
	@IsNotEmpty()
	listingAddress: string
}
