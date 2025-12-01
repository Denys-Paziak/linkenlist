import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class SaveContentSectionDto {
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@MaxLength(140)
	title?: string

	@IsOptional()
	@IsBoolean()
	enabled?: boolean

	@IsOptional()
	@MaxLength(10_000)
	bodyMd?: string | null

	@IsOptional()
	@IsArray()
	@IsInt({ each: true })
	remainedAttachments?: number[]
}
