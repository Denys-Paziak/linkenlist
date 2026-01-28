import { Type } from 'class-transformer'
import { IsInt, Min, ValidateNested } from 'class-validator'

class Item {
	@IsInt()
	@Min(1)
	sectionId: number

	@IsInt()
	@Min(0)
	position: number
}

export class ChangePosContentSectionsDto {
	@ValidateNested({ each: true })
	@Type(() => Item)
	items: Item[]
}
