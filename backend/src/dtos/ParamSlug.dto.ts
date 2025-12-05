import { MinLength } from 'class-validator'

export class ParamSlug {
    @MinLength(1)
    slug: string
}
