import { IsEnum } from "class-validator";
import { EContactInboxStatus } from "../../../interfaces/EContactInboxStatus";

export class ChangeStatusDto {
    @IsEnum(EContactInboxStatus)
    status: EContactInboxStatus
}