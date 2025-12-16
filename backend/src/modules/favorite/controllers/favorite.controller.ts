import { Controller, Delete, Get, Param, Post, Req } from '@nestjs/common'
import type { FastifyRequest } from 'fastify'

import { FavoriteService } from '../services/favorite.service'
import { Authorization } from '../../../decorators/auth.decorator'
import { ERoleName } from '../../../interfaces/ERoleName'
import { ParamId } from '../../../dtos/ParamId.dto'
import { ITokenUser } from '../../../interfaces/ITokenUser'

@Controller('favorite')
export class FavoriteController {
	constructor(private readonly favoriteService: FavoriteService) {}

	@Authorization(ERoleName.USER)
	@Get('deals')
	async getFavoriteDeals(@Req() request: FastifyRequest) {
		const userFromToken = request.user as ITokenUser
		
		return await this.favoriteService.getFavoriteDeals(userFromToken.id)
	}

	@Authorization(ERoleName.USER)
	@Post('deals/:id')
	async addFavoriteDeals(@Req() request: FastifyRequest, @Param() params: ParamId) {
		const userFromToken = request.user as ITokenUser
		
		await this.favoriteService.addFavoriteDeals(userFromToken.id, params.id)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.USER)
	@Delete('deals/:id')
	async deleteFavoriteDeals(@Req() request: FastifyRequest, @Param() params: ParamId) {
		const userFromToken = request.user as ITokenUser
		
		await this.favoriteService.deleteFavoriteDeals(userFromToken.id, params.id)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.USER)
	@Get('resources')
	async getFavoriteResources(@Req() request: FastifyRequest) {
		const userFromToken = request.user as ITokenUser
		
		return await this.favoriteService.getFavoriteResources(userFromToken.id)
	}

	@Authorization(ERoleName.USER)
	@Post('resources/:id')
	async addFavoriteResources(@Req() request: FastifyRequest, @Param() params: ParamId) {
		const userFromToken = request.user as ITokenUser
		
		await this.favoriteService.addFavoriteResources(userFromToken.id, params.id)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.USER)
	@Delete('resources/:id')
	async deleteFavoriteResources(@Req() request: FastifyRequest, @Param() params: ParamId) {
		const userFromToken = request.user as ITokenUser
		
		await this.favoriteService.deleteFavoriteResources(userFromToken.id, params.id)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.USER)
	@Get('listings')
	async getFavoriteListings(@Req() request: FastifyRequest) {
		const userFromToken = request.user as ITokenUser
		
		return await this.favoriteService.getFavoriteListings(userFromToken.id)
	}

	@Authorization(ERoleName.USER)
	@Post('listings/:id')
	async addFavoriteListings(@Req() request: FastifyRequest, @Param() params: ParamId) {
		const userFromToken = request.user as ITokenUser
		
		await this.favoriteService.addFavoriteListings(userFromToken.id, params.id)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.USER)
	@Delete('listings/:id')
	async deleteFavoriteListings(@Req() request: FastifyRequest, @Param() params: ParamId) {
		const userFromToken = request.user as ITokenUser
		
		await this.favoriteService.deleteFavoriteListings(userFromToken.id, params.id)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.USER)
	@Get('links')
	async getFavoriteLinks(@Req() request: FastifyRequest) {
		const userFromToken = request.user as ITokenUser
		
		return await this.favoriteService.getFavoriteLinks(userFromToken.id)
	}

	@Authorization(ERoleName.USER)
	@Post('links/:id')
	async addFavoriteLinks(@Req() request: FastifyRequest, @Param() params: ParamId) {
		const userFromToken = request.user as ITokenUser
		
		await this.favoriteService.addFavoriteLinks(userFromToken.id, params.id)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.USER)
	@Delete('links/:id')
	async deleteFavoriteLinks(@Req() request: FastifyRequest, @Param() params: ParamId) {
		const userFromToken = request.user as ITokenUser
		
		await this.favoriteService.deleteFavoriteLinks(userFromToken.id, params.id)

		return {
			ok: true
		}
	}
}
