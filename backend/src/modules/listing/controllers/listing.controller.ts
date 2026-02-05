import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseInterceptors } from '@nestjs/common'
import type { FastifyRequest } from 'fastify'

import { Authorization } from '../../../decorators/auth.decorator'
import { Files } from '../../../decorators/files.decorator'
import { OptionalAuthorization } from '../../../decorators/optional-auth.decorator'
import { ParamId } from '../../../dtos/ParamId.dto'
import { ParamSlug } from '../../../dtos/ParamSlug.dto'
import { MultipartInterceptor } from '../../../interceptors/multipart.interceptor'
import { ERoleName } from '../../../interfaces/ERoleName'
import { IMultipartFile } from '../../../interfaces/IMultipartFile'
import { ITokenUser } from '../../../interfaces/ITokenUser'
import { MultipartOptions } from '../../../utils/file.util'
import { ExtendListingExpirationDto } from '../dtos/ExtendListingExpiration.dto'
import { GetAllListingsDto } from '../dtos/GetAllListings.dto'
import { GetBAHRatesDto } from '../dtos/GetBAHRates.dto'
import { GetMapListingsDto } from '../dtos/GetMapListings.dto'
import { GetOwnerAllListingsDto } from '../dtos/GetOwnerAllListings.dto'
import { InitListingDto } from '../dtos/InitListing.dto'
import { SaveListingDto } from '../dtos/SaveListing.dto'
import { ListingCommandService } from '../services/listing-command.service'
import { ListingQueryService } from '../services/listing-query.service'
import { ListingSystemService } from '../services/listing-system.service'

const IMAGE_MAX_MB = 15
const IMAGE_MAX_BYTES = IMAGE_MAX_MB * 1024 * 1024
const ACCEPT_IMAGES = /(image\/(jpeg|png|webp))$/

@Controller('listings')
export class ListingController {
	constructor(
		private readonly listingCommandService: ListingCommandService,
		private readonly listingQueryService: ListingQueryService,
		private readonly listingSystemService: ListingSystemService
	) {}

	@Authorization(ERoleName.USER)
	@Get('my')
	async getOwnerAllListings(@Req() request: FastifyRequest, @Query() query: GetOwnerAllListingsDto) {
		const userFromToken = request.user as ITokenUser

		return await this.listingQueryService.getOwnerAllListings(userFromToken.id, query)
	}

	@Authorization(ERoleName.USER, ERoleName.ADMIN)
	@Get('my/:id')
	async getOwnerOneListing(@Req() request: FastifyRequest, @Param() params: ParamId) {
		const userFromToken = request.user as ITokenUser

		return await this.listingQueryService.getOwnerOneListing(userFromToken, params.id)
	}

	@Authorization(ERoleName.USER)
	@Post('init')
	async initListing(@Req() request: FastifyRequest, @Body() dto: InitListingDto) {
		const userFromToken = request.user as ITokenUser

		const listingId = await this.listingCommandService.initListing(userFromToken.id, dto)

		return {
			listingId
		}
	}

	@Authorization(ERoleName.USER, ERoleName.ADMIN)
	@Patch(':id')
	async saveListing(@Req() request: FastifyRequest, @Param() params: ParamId, @Body() dto: SaveListingDto) {
		const userFromToken = request.user as ITokenUser

		await this.listingCommandService.saveListing(userFromToken, params.id, dto)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.USER, ERoleName.ADMIN)
	@Post(':id/upload-images')
	@UseInterceptors(
		MultipartInterceptor({
			globalFileSizeLimit: IMAGE_MAX_BYTES,
			maxFiles: 40,
			validators: [new MultipartOptions(IMAGE_MAX_BYTES, ACCEPT_IMAGES, true, ACCEPT_IMAGES)]
		})
	)
	async uploadImages(
		@Req() request: FastifyRequest,
		@Files() files: Record<string, IMultipartFile[]>,
		@Param() params: ParamId
	) {
		const userFromToken = request.user as ITokenUser
		const filesArr = Object.values(files)?.[0]

		return await this.listingCommandService.uploadImages(userFromToken, params.id, filesArr)
	}

	@Authorization(ERoleName.USER)
	@Patch(':id/publish')
	async publish(@Req() request: FastifyRequest, @Param() params: ParamId) {
		const userFromToken = request.user as ITokenUser

		const data = await this.listingCommandService.publish(userFromToken.id, params.id)

		return (
			data || {
				ok: true
			}
		)
	}

	@Authorization(ERoleName.USER)
	@Delete(':id')
	async deleteListing(@Req() request: FastifyRequest, @Param() params: ParamId) {
		const userFromToken = request.user as ITokenUser

		await this.listingCommandService.deleteListing(userFromToken.id, params.id)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.USER)
	@Patch(':id/extend')
	async extendListingExpiration(
		@Req() request: FastifyRequest,
		@Param() params: ParamId,
		@Body() dto: ExtendListingExpirationDto
	) {
		const userFromToken = request.user as ITokenUser

		const data = await this.listingCommandService.extendListingExpiration(userFromToken.id, params.id, dto)

		return (
			data || {
				ok: true
			}
		)
	}

	@Authorization(ERoleName.USER)
	@Patch(':id/deactivate')
	async deactivateListing(@Req() request: FastifyRequest, @Param() params: ParamId) {
		const userFromToken = request.user as ITokenUser

		await this.listingCommandService.deactivateListing(userFromToken.id, params.id)

		return {
			ok: true
		}
	}

	@Get('')
	async getAllListings(@Query() query: GetAllListingsDto) {
		return await this.listingQueryService.getAllListings(query)
	}

	@Get('list/:id')
	async getOneCardListing(@Param() params: ParamId) {
		return await this.listingQueryService.getOneCardListing(params.id)
	}

	@Get('map')
	getMapListings(@Query() dto: GetMapListingsDto) {
		return this.listingQueryService.getMapListings(dto)
	}

	@OptionalAuthorization()
	@Get(':slug')
	async getOneListing(@Req() request: FastifyRequest, @Param() params: ParamSlug) {
		const userFromToken = request.user as ITokenUser | undefined

		return await this.listingQueryService.getOneListing(params.slug, userFromToken?.id)
	}

	@Get('bah-rates')
	async getBahRates(@Query() query: GetBAHRatesDto) {
		return await this.listingQueryService.getBahRates(query)
	}

	@OptionalAuthorization()
	@Patch(':id/add-view')
	async addView(@Req() request: FastifyRequest, @Param() params: ParamId) {
		const listingId = Number(params.id)

		const userId = (request as any).user?.id as number | undefined
		const viewerKey = userId ? `u:${userId}` : `ip:${request.ip}`

		const counted = await this.listingSystemService.markViewedOnce({
			listingId,
			viewerKey,
			ttlMs: 10 * 60 * 60 * 1000
		})

		if (counted) {
			await this.listingCommandService.addView(listingId)
		}

		return {
			ok: true
		}
	}

	@Get(':id/similar')
	async getSimilarListings(@Param() params: ParamId) {
		return await this.listingQueryService.getSimilarListings(params.id)
	}
}
