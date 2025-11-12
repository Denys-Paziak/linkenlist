import { IsInt, Min } from "class-validator";

export class DeleteContentSectionDto {
    @IsInt()
    @Min(1)
    sectionId: number
}