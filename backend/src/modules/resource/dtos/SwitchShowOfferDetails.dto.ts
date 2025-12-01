import { IsBoolean } from "class-validator";

export class SwitchShowOfferDetailsDto {
    @IsBoolean()
    offerEnabled: boolean
}