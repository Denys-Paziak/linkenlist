import { Controller } from '@nestjs/common'

import { FavoriteService } from '../services/favorite.service'

@Controller('favorite')
export class FavoriteController {
	constructor(private readonly favoriteService: FavoriteService) {}
}
