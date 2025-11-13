import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";

export class ParamsContentSection {
    @Type(() => Number)
	@IsInt()
	@Min(1)
	id: number

    @Type(() => Number)
    @IsInt()
    @Min(1)
    sectionId: number
}