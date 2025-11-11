import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, Min } from 'class-validator'

export class GetAllLinksDto {
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@ApiProperty({
		description: 'Number of users per page for pagination',
		example: 10,
		type: Number,
		required: false,
		minimum: 1
	})
	limit: number

	@Type(() => Number)
	@IsInt()
	@Min(1)
	@ApiProperty({
		description: 'Page number for pagination',
		example: 1,
		type: Number,
		required: false,
		minimum: 1
	})
	page: number
}
