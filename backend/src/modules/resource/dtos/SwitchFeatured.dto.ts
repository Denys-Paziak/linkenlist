import { IsBoolean, IsOptional } from "class-validator";

export class SwitchFeaturedDto {
    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean
}