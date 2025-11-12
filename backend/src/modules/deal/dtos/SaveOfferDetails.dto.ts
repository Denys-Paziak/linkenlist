import { IsEnum, IsOptional } from "class-validator";
import { EDealType } from "../../../interfaces/EDealType";

export class SaveOfferDetailsDto {
    
    dealType?: EDealType

    originalPrice?: number

    yourPrice?: number
}