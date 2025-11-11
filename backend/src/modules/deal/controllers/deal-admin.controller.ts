import { BadRequestException, Body, Controller, Post, UnprocessableEntityException, UseInterceptors } from '@nestjs/common'

import { Authorization } from '../../../decorators/auth.decorator'
import { Files } from '../../../decorators/files.decorator'
import { MultipartInterceptor } from '../../../interceptors/multipart.interceptor'
import { ERoleNames } from '../../../interfaces/ERoleNames'
import { IMultipartFile } from '../../../interfaces/IMultipartFile'
import { fetchImageAsIMultipartFile } from '../../../utils/fetch-image.util'
import { MultipartOptions, validateFile } from '../../../utils/file.util'
import { SaveBasicInformationDto } from '../dtos/SaveBasicInformation.dto'
import { DealCommandService } from '../services/deal-command.service'

const MAX_MB = 5
const MAX_BYTES = MAX_MB * 1024 * 1024
const ACCEPT_IMAGES = /(image\/(jpeg|png|webp))$/

@Controller('admin/deals')
export class DealAdminController {
	constructor(private readonly dealCommandService: DealCommandService) {}

	@Authorization(ERoleNames.ADMIN)
	@Post()
	@UseInterceptors(
		MultipartInterceptor({
			globalFileSizeLimit: MAX_BYTES,
			maxFiles: 1,
			validators: [new MultipartOptions(MAX_BYTES, ACCEPT_IMAGES, true, ACCEPT_IMAGES)]
		})
	)
	async saveBasicInformation(@Files() files: Record<string, IMultipartFile[]>, @Body() dto: SaveBasicInformationDto) {
		let file: IMultipartFile | undefined

		const firstField = files && Object.keys(files)[0]

		if (firstField && files![firstField]?.length) {
			file = files![firstField][0]
		} else if (dto.imgUrl) {
			const fetched = await fetchImageAsIMultipartFile(dto.imgUrl, MAX_BYTES)

			const err = await validateFile(fetched, new MultipartOptions(MAX_BYTES, ACCEPT_IMAGES, true, ACCEPT_IMAGES))
			if (err) {
				throw new UnprocessableEntityException(err)
			}
			file = fetched
		}

		if (!file) throw new BadRequestException('No image available')

		await this.dealCommandService.saveBasicInformation(dto, file)

		return { ok: true }
	}
}
