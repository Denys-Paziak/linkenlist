import { Controller, Post, Query, UseInterceptors } from '@nestjs/common'

import { Authorization } from '../../../decorators/auth.decorator'
import { Files } from '../../../decorators/files.decorator'
import { MultipartInterceptor } from '../../../interceptors/multipart.interceptor'
import { ERoleName } from '../../../interfaces/ERoleName'
import { IMultipartFile } from '../../../interfaces/IMultipartFile'
import { MultipartOptions } from '../../../utils/file.util'
import { ListingCommandService } from '../services/listing-command.service'

const FILE_MAX_MB = 10
const FILE_MAX_BYTES = FILE_MAX_MB * 1024 * 1024

@Controller('admin/listings')
export class ListingAdminController {
	constructor(private readonly listingCommandService: ListingCommandService) {}

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
}
