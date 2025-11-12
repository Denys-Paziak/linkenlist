import { Body, Controller, Param, Post, UnprocessableEntityException, UseInterceptors } from '@nestjs/common'

import { Authorization } from '../../../decorators/auth.decorator'
import { Files } from '../../../decorators/files.decorator'
import { ParamId } from '../../../dtos/ParamId.dto'
import { MultipartInterceptor } from '../../../interceptors/multipart.interceptor'
import { ERoleNames } from '../../../interfaces/ERoleNames'
import { IMultipartFile } from '../../../interfaces/IMultipartFile'
import { fetchImageAsIMultipartFile } from '../../../utils/fetch-image.util'
import { MultipartOptions, validateFile } from '../../../utils/file.util'
import { ChangePosContentSectionsDto } from '../dtos/ChangePosContentSections.dto'
import { ChangeStatusDto } from '../dtos/ChangeStatus.dto'
import { DeleteContentSectionDto } from '../dtos/DeleteContentSection.dto'
import { SaveBasicInformationDto } from '../dtos/SaveBasicInformation.dto'
import { SaveContentSectionDto } from '../dtos/SaveContentSection.dto'
import { SaveOfferDetailsDto } from '../dtos/SaveOfferDetails.dto'
import { SaveSEODto } from '../dtos/SaveSEO.dto'
import { SelectRelatedDealsDto } from '../dtos/SelectRelatedDeals.dto'
import { DealCommandService } from '../services/deal-command.service'

const MAX_MB = 5
const MAX_BYTES = MAX_MB * 1024 * 1024
const ACCEPT_IMAGES = /(image\/(jpeg|png|webp))$/

@Controller('admin/deals')
export class DealAdminController {
	constructor(private readonly dealCommandService: DealCommandService) {}

	async initDeal() {}

	@Authorization(ERoleNames.ADMIN)
	@Post()
	@UseInterceptors(
		MultipartInterceptor({
			globalFileSizeLimit: MAX_BYTES,
			maxFiles: 1,
			validators: [new MultipartOptions(MAX_BYTES, ACCEPT_IMAGES, true, ACCEPT_IMAGES)]
		})
	)
	async saveBasicInformation(
		@Files() files: Record<string, IMultipartFile[]>,
		@Param() params: ParamId,
		@Body() dto: SaveBasicInformationDto
	) {
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

		await this.dealCommandService.saveBasicInformation(params.id, dto, file)

		return { ok: true }
	}

	async saveOfferDetails(@Param() params: ParamId, @Body() dto: SaveOfferDetailsDto) {}

	async createContentSection(@Param() params: ParamId) {}

	async deleteContentSection(@Param() params: ParamId, @Body() dto: DeleteContentSectionDto) {}

	async changePosContentSections(@Param() params: ParamId, @Body() dto: ChangePosContentSectionsDto) {}

	async saveContentSection(@Param() params: ParamId, @Body() dto: SaveContentSectionDto) {}

	async switchRelatedDealsMode(@Param() params: ParamId) {}

	async getSimplifiedDeals() {
		// прийматиме рядок пошуку, та сторінку і ліміт для пагінації
		// пагінація автоматична при доскролювані до кінця
		// повертатиме id name slug isVerified
	}

	async selectRelatedDeals(@Param() params: ParamId, @Body() dto: SelectRelatedDealsDto) {}

	@UseInterceptors(
		MultipartInterceptor({
			globalFileSizeLimit: MAX_BYTES,
			maxFiles: 1,
			validators: [new MultipartOptions(MAX_BYTES, ACCEPT_IMAGES, true, ACCEPT_IMAGES)]
		})
	)
	async saveSEO(@Files() files: Record<string, IMultipartFile[]>, @Param() params: ParamId, @Body() dto: SaveSEODto) {
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
	}

	async changeStatus(@Param() params: ParamId, @Body() dto: ChangeStatusDto) {}
}
