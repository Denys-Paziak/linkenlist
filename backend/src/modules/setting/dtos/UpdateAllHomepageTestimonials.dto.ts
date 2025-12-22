import { Type } from 'class-transformer'
import { IsArray, IsString, MaxLength, ValidateNested } from 'class-validator'

class Testimonial {
	@IsString()
	@MaxLength(100)
	name: string

	@IsString()
	@MaxLength(50)
	date: string

	@IsString()
	@MaxLength(100)
	location: string

	@IsString()
	@MaxLength(1000)
	comment: string
}

export class UpdateAllHomepageTestimonialsDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => Testimonial)
	testimonials: Testimonial[]
}
