import { IsOptional, IsString, MaxLength } from "class-validator"

export class UpdateGeneralSettingDto {
    @IsString()
    @MaxLength(100)
    siteName: string

    @IsOptional()
    @IsString()
    @MaxLength(500)
    siteDescription: string
}