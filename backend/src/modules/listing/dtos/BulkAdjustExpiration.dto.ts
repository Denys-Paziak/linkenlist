import { Type } from "class-transformer"
import { IsInt, Min, ValidateNested } from "class-validator"

class Item {
	@IsInt()
	@Min(1)
	id: number
	@IsInt()
	@Min(0)
	days: number
}

export class BulkAdjustExpirationDto {
	@ValidateNested({ each: true })
	@Type(() => Item)
	listings: Item[]
}
