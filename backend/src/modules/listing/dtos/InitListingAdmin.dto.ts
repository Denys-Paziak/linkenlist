import { IsEnum, IsString } from "class-validator";
import { EPackageType } from "../../../interfaces/EPackageType";

export class InitListingAdminDto {
    @IsEnum(EPackageType)
    package: EPackageType

    @IsString()
    username: string
}