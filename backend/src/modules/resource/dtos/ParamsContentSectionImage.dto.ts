import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";

export class ParamsContentSectionImage {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    id: number

    @Type(() => Number)
    @IsInt()
    @Min(1)
    sectionId: number

    @Type(() => Number)
    @IsInt()
    @Min(1)
    imageId: number
}