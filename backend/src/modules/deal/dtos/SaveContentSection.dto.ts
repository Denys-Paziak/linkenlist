import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class SaveContentSectionDto {
	@IsInt()
	@Min(1)
	sectionId: number

    @IsString()
    @IsNotEmpty()
    @MaxLength(140)
	title: string

    @IsBoolean()
	enabled: boolean

    @IsOptional()
    @MaxLength(50_000)
	bodyMd?: string | null
}
