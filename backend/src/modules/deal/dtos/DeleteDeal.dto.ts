import { IsEnum } from 'class-validator'

export class DeleteDealDto {
    @IsEnum(['soft', 'hard'])
    method: 'soft' | 'hard'
}
