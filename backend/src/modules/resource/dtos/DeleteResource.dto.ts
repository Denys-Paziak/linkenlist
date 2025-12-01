import { IsEnum } from 'class-validator'

export class DeleteResourceDto {
    @IsEnum(['soft', 'hard'])
    method: 'soft' | 'hard'
}
