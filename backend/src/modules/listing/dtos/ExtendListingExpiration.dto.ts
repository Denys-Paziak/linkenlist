import { IsString } from 'class-validator'

export class ExtendListingExpirationDto {
	@IsString()
	priceId: string
}
