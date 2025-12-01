import { Type } from 'class-transformer'
import { IsInt, Min, ValidateNested } from 'class-validator'

class Items {
	@IsInt()
	@Min(1)
	sectionId: number

	@IsInt()
	@Min(0)
	position: number
}

export class ChangePosContentSectionsDto {
	@ValidateNested({ each: true })
	@Type(() => Items)
	items: Items[]
}
