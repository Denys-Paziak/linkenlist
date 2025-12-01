import { IsBoolean, IsOptional } from "class-validator";

export class SwitchRelatedMode {
    @IsOptional()
    @IsBoolean()
    relatedAutoMode?: boolean
}