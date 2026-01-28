import { Type } from 'class-transformer'
import { IsInt, IsString, Min, ValidateNested } from 'class-validator'

class Item {
	@IsInt()
	@Min(1)
	id: number
	@IsString()
	message: string
}

export class BulkRejectDto {
	@ValidateNested({ each: true })
	@Type(() => Item)
	listings: Item[]
}
