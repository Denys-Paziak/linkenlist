import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { FavoriteController } from './controllers/favorite.controller'
import { UserFavoriteDeal, UserFavoriteLink, UserFavoriteListing, UserFavoriteResource } from './entities/UserFavorite.entity'
import { FavoriteService } from './services/favorite.service'

@Module({
	imports: [TypeOrmModule.forFeature([UserFavoriteDeal, UserFavoriteResource, UserFavoriteListing, UserFavoriteLink])],
	controllers: [FavoriteController],
	providers: [FavoriteService]
})
export class FavoriteModule {}
