import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator'
import { EOgImageMode } from '../../../interfaces/EOgImageMode'


export class SaveSEODto {
	@IsOptional()
	@IsString()
	@MaxLength(140)
	@IsNotEmpty()
	seoMetaTitle?: string | null

	@IsOptional()
	@IsString()
	@MaxLength(200)
	seoMetaDescription?: string | null

	@IsOptional()
	@IsUrl()
	imgUrl?: string

	@IsOptional()
	@IsEnum(EOgImageMode)
	ogImageMode?: EOgImageMode

	@IsOptional()
	@IsUrl()
	canonicalUrl?: string | null

	@IsOptional()
	@IsBoolean()
	allowIndexing?: boolean
}
