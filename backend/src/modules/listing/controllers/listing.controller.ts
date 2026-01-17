import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseInterceptors } from '@nestjs/common'
import type { FastifyRequest } from 'fastify'

import { Authorization } from '../../../decorators/auth.decorator'
import { Files } from '../../../decorators/files.decorator'
import { ParamId } from '../../../dtos/ParamId.dto'
import { MultipartInterceptor } from '../../../interceptors/multipart.interceptor'
import { ERoleName } from '../../../interfaces/ERoleName'
import { IMultipartFile } from '../../../interfaces/IMultipartFile'
import { ITokenUser } from '../../../interfaces/ITokenUser'
import { MultipartOptions } from '../../../utils/file.util'
import { ExtendListingExpirationDto } from '../dtos/ExtendListingExpiration.dto'
import { GetAllListingsDto } from '../dtos/GetAllListings.dto'
import { GetOwnerAllListingsDto } from '../dtos/GetOwnerAllListings.dto'
import { InitListingDto } from '../dtos/InitListing.dto'
import { SaveListingDto } from '../dtos/SaveListing.dto'
import { ListingCommandService } from '../services/listing-command.service'
import { ListingQueryService } from '../services/listing-query.service'
import { ParamSlug } from '../../../dtos/ParamSlug.dto'

const IMAGE_MAX_MB = 15
const IMAGE_MAX_BYTES = IMAGE_MAX_MB * 1024 * 1024
const ACCEPT_IMAGES = /(image\/(jpeg|png|webp))$/

@Controller('listings')
export class ListingController {
	constructor(
		private readonly listingCommandService: ListingCommandService,
		private readonly listingQueryService: ListingQueryService
	) {}

	@Authorization(ERoleName.USER)
	@Get('my')
	async getOwnerAllListings(@Req() request: FastifyRequest, @Query() query: GetOwnerAllListingsDto) {
		const userFromToken = request.user as ITokenUser

		return await this.listingQueryService.getOwnerAllListings(userFromToken.id, query)
	}

	@Authorization(ERoleName.USER)
	@Get('my/:id')
	async getOwnerOneListing(@Req() request: FastifyRequest, @Param() params: ParamId) {
		const userFromToken = request.user as ITokenUser

		return await this.listingQueryService.getOwnerOneListing(userFromToken.id, params.id)
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

	@Authorization(ERoleName.USER)
	@Patch(':id')
	async saveListing(@Req() request: FastifyRequest, @Param() params: ParamId, @Body() dto: SaveListingDto) {
		const userFromToken = request.user as ITokenUser

		await this.listingCommandService.saveListing(userFromToken.id, params.id, dto)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.USER)
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

		return await this.listingCommandService.uploadImages(userFromToken.id, params.id, filesArr)
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

	@Get(':slug')
	async getOneListing(@Param() params: ParamSlug) {
		return await this.listingQueryService.getOneListing(params.slug)
	}
}
