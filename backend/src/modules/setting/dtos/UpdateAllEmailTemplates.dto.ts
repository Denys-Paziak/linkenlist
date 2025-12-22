import { IsNotEmpty, IsString, MaxLength } from "class-validator"

export class UpdateAllEmailTemplatesDto {
    @IsString()
    @MaxLength(5000)
    @IsNotEmpty()
    emailVerification: string

    @IsString()
    @MaxLength(5000)
    @IsNotEmpty()
    passwordReset: string
}