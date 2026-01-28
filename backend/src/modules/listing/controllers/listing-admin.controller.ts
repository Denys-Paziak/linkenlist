import { Body, Controller, Get, Patch, Post, Query, UseInterceptors } from '@nestjs/common'

import { Authorization } from '../../../decorators/auth.decorator'
import { Files } from '../../../decorators/files.decorator'
import { MultipartInterceptor } from '../../../interceptors/multipart.interceptor'
import { ERoleName } from '../../../interfaces/ERoleName'
import { IMultipartFile } from '../../../interfaces/IMultipartFile'
import { MultipartOptions } from '../../../utils/file.util'
import { BulkAdjustExpirationDto } from '../dtos/BulkAdjustExpiration.dto'
import { BulkApproveDto } from '../dtos/BulkApprove.dto'
import { BulkRejectDto } from '../dtos/BulkReject.dto'
import { GetAdminAllListingsDto } from '../dtos/GetAdminAllListings.dto'
import { InitListingAdminDto } from '../dtos/InitListingAdmin.dto'
import { ListingCommandService } from '../services/listing-command.service'
import { ListingQueryService } from '../services/listing-query.service'

const FILE_MAX_MB = 10
const FILE_MAX_BYTES = FILE_MAX_MB * 1024 * 1024

@Controller('admin/listings')
export class ListingAdminController {
	constructor(
		private readonly listingCommandService: ListingCommandService,
		private readonly listingQueryService: ListingQueryService
	) {}

	@Authorization(ERoleName.ADMIN)
	@Post('import-bah-rates')
	@UseInterceptors(
		MultipartInterceptor({
			globalFileSizeLimit: FILE_MAX_BYTES,
			maxFiles: 1,
			validators: [new MultipartOptions(FILE_MAX_BYTES)]
		})
	)
	async importBahRatesFromJson(@Files() files: Record<string, IMultipartFile[]>, @Query('dryRun') dryRun?: string) {
		const file = Object.values(files)?.[0]?.[0]

		return await this.listingCommandService.importBahRatesFromJson(file, {
			dryRun: dryRun === '1' || dryRun === 'true'
		})
	}

	@Authorization(ERoleName.ADMIN)
	@Post('import-bah-zip-mappings')
	@UseInterceptors(
		MultipartInterceptor({
			globalFileSizeLimit: FILE_MAX_BYTES,
			maxFiles: 1,
			validators: [new MultipartOptions(FILE_MAX_BYTES)]
		})
	)
	async importBahZipMappingsFromCsv(@Files() files: Record<string, IMultipartFile[]>, @Query('dryRun') dryRun?: string) {
		const file = Object.values(files)?.[0]?.[0]

		return await this.listingCommandService.importBahZipMappingsFromCsv(file, {
			dryRun: dryRun === '1' || dryRun === 'true'
		})
	}

	@Authorization(ERoleName.ADMIN)
	@Get()
	async getAllListings(@Query() query: GetAdminAllListingsDto) {
		return await this.listingQueryService.getAdminAllListings(query)
	}

	@Authorization(ERoleName.ADMIN)
	@Get('filter-counters')
	async getAdminListingsCounters() {
		return await this.listingQueryService.getAdminListingsCounters()
	}

	@Authorization(ERoleName.ADMIN)
	@Patch('bulk-approve')
	async bulkApprove(@Body() dto: BulkApproveDto) {
		await this.listingCommandService.bulkApprove(dto)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Patch('bulk-reject')
	async bulkReject(@Body() dto: BulkRejectDto) {
		await this.listingCommandService.bulkReject(dto)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Patch('bulk-adjust-expiration')
	async bulkAdjustExpiration(@Body() dto: BulkAdjustExpirationDto) {
		await this.listingCommandService.bulkAdjustExpiration(dto)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Post('init')
	async initListing(@Body() dto: InitListingAdminDto) {
		const listingId = await this.listingCommandService.initListingAdmin(dto)

		return {
			listingId
		}
	}
}
