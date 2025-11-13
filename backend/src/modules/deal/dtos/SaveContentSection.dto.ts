import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from "class-validator";

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
}
