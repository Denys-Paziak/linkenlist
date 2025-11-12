import { EDealCadencePrice } from "../../../interfaces/EDealCadencePrice";
import { EDealType } from "../../../interfaces/EDealType";

export class SaveOfferDetailsDto {
    
    dealType?: EDealType

    originalPrice?: number

    yourPrice?: number

    cadencePrice?: EDealCadencePrice

    promoCode?: string

    whereToEnterCode?: string

    ongoingOffer?: boolean

    validFrom?: string

    validUntil?: string

    providerDisplayName?: string
}