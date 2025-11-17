import { IsBoolean, IsOptional } from "class-validator";

export class SwitchRelatedDealsMode {
    @IsOptional()
    @IsBoolean()
    relatedAutoMode?: boolean
}