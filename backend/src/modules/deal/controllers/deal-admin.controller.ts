import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UnprocessableEntityException, UseInterceptors } from '@nestjs/common'

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
import { ParamsContentSection } from '../dtos/ParamsContentSection.dto'
import { SaveBasicInformationDto } from '../dtos/SaveBasicInformation.dto'
import { SaveContentSectionDto } from '../dtos/SaveContentSection.dto'
import { SaveOfferDetailsDto } from '../dtos/SaveOfferDetails.dto'
import { SaveSEODto } from '../dtos/SaveSEO.dto'
import { SetSelectRelatedDealsDto } from '../dtos/SetSelectRelatedDeals.dto'
import { SwitchShowOfferDetailsDto } from '../dtos/SwitchShowOfferDetails.dto'
import { DealCommandService } from '../services/deal-command.service'
import { SwitchRelatedDealsMode } from '../dtos/SwitchRelatedDealsMode.dto'
import { GetSimplifiedDealsDto } from '../dtos/GetSimplifiedDeals.dto'

const IMAGE_MAX_MB = 5
const IMAGE_MAX_BYTES = IMAGE_MAX_MB * 1024 * 1024
const ACCEPT_IMAGES = /(image\/(jpeg|png|webp))$/

const SECTION_FILE_MAX_MB = 10
const SECTION_FILE_MAX_BYTES = SECTION_FILE_MAX_MB * 1024 * 1024
const ACCEPT_SECTION_FILE =
	/(image\/(jpeg|png|webp)|application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|application\/vnd\.ms-excel|application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)$/

@Controller('admin/deals')
export class DealAdminController {
	constructor(private readonly dealCommandService: DealCommandService) {}

	@Authorization(ERoleNames.ADMIN)
	@Post('init')
	async initDeal() {
		return await this.dealCommandService.initDeal()
	}

	@Authorization(ERoleNames.ADMIN)
	@Patch(':id/basic-information')
	@UseInterceptors(
		MultipartInterceptor({
			globalFileSizeLimit: IMAGE_MAX_BYTES,
			maxFiles: 1,
			validators: [new MultipartOptions(IMAGE_MAX_BYTES, ACCEPT_IMAGES, true, ACCEPT_IMAGES)]
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
			const fetched = await fetchImageAsIMultipartFile(dto.imgUrl, IMAGE_MAX_BYTES)

			const err = await validateFile(fetched, new MultipartOptions(IMAGE_MAX_BYTES, ACCEPT_IMAGES, true, ACCEPT_IMAGES))
			if (err) {
				throw new UnprocessableEntityException(err)
			}
			file = fetched
		}

		await this.dealCommandService.saveBasicInformation(params.id, dto, file)

		return { ok: true }
	}

	@Authorization(ERoleNames.ADMIN)
	@Patch(':id/offer-details')
	async saveOfferDetails(@Param() params: ParamId, @Body() dto: SaveOfferDetailsDto) {
		await this.dealCommandService.saveOfferDetails(params.id, dto)

		return { ok: true }
	}

	@Authorization(ERoleNames.ADMIN)
	@Patch(':id/offer-details/enable')
	async switchShowOfferDetails(@Param() params: ParamId, @Body() dto: SwitchShowOfferDetailsDto) {
		await this.dealCommandService.switchShowOfferDetails(params.id, dto)

		return { ok: true }
	}

	@Authorization(ERoleNames.ADMIN)
	@Post(':id/content-section')
	async createContentSection(@Param() params: ParamId) {
		return await this.dealCommandService.createContentSection(params.id)
	}

	@Authorization(ERoleNames.ADMIN)
	@Delete(':id/content-section/:sectionId')
	async deleteContentSection(@Param() params: ParamsContentSection) {
		await this.dealCommandService.deleteContentSection(params.id, params.sectionId)

		return {
			ok: true
		}
	}

	@Authorization(ERoleNames.ADMIN)
	@Patch(':id/content-section/positions')
	async changePosContentSections(@Param() params: ParamId, @Body() dto: ChangePosContentSectionsDto) {
		await this.dealCommandService.changePosContentSections(params.id, dto)

		return {
			ok: true
		}
	}

	@Authorization(ERoleNames.ADMIN)
	@Patch(':id/content-section/:sectionId')
	@UseInterceptors(
		MultipartInterceptor({
			globalFileSizeLimit: SECTION_FILE_MAX_BYTES,
			maxFiles: 1,
			validators: [new MultipartOptions(SECTION_FILE_MAX_BYTES, ACCEPT_SECTION_FILE, true, ACCEPT_SECTION_FILE)]
		})
	)
	async saveContentSection(
		@Files() files: Record<string, IMultipartFile[]>,
		@Param() params: ParamsContentSection,
		@Body() dto: SaveContentSectionDto
	) {
		let file: IMultipartFile | undefined

		const firstField = files && Object.keys(files)[0]

		file = files[firstField][0]

		await this.dealCommandService.saveContentSection(params.id, params.sectionId, dto, file)

		return {
			ok: true
		}
	}

	@Authorization(ERoleNames.ADMIN)
	@Patch(':id/surfacing/related-mode')
	async switchRelatedDealsMode(@Param() params: ParamId, @Body() dto: SwitchRelatedDealsMode) {
		await this.dealCommandService.switchRelatedDealsMode(params.id, dto)
		
		return {
			ok: true
		}
	}

	@Authorization(ERoleNames.ADMIN)
	@Get('simplified')
	async getSimplifiedDeals(@Query() query: GetSimplifiedDealsDto) {
		// прийматиме рядок пошуку, та сторінку і ліміт для пагінації
		// пагінація автоматична при доскролювані до кінця
		// повертатиме id name slug isVerified

		return await this.dealCommandService.getSimplifiedDeals(query)
	}

	@Authorization(ERoleNames.ADMIN)
	@Patch(':id/related-deals/select')
	async setSelectRelatedDeals(@Param() params: ParamId, @Body() dto: SetSelectRelatedDealsDto) {
		await this.dealCommandService.setSelectRelatedDeals(params.id, dto)

		return {
			ok: true
		}
	}

	@UseInterceptors(
		MultipartInterceptor({
			globalFileSizeLimit: IMAGE_MAX_BYTES,
			maxFiles: 1,
			validators: [new MultipartOptions(IMAGE_MAX_BYTES, ACCEPT_IMAGES, true, ACCEPT_IMAGES)]
		})
	)
	async saveSEO(@Files() files: Record<string, IMultipartFile[]>, @Param() params: ParamId, @Body() dto: SaveSEODto) {
		let file: IMultipartFile | undefined

		const firstField = files && Object.keys(files)[0]

		if (firstField && files![firstField]?.length) {
			file = files![firstField][0]
		} else if (dto.imgUrl) {
			const fetched = await fetchImageAsIMultipartFile(dto.imgUrl, IMAGE_MAX_BYTES)

			const err = await validateFile(fetched, new MultipartOptions(IMAGE_MAX_BYTES, ACCEPT_IMAGES, true, ACCEPT_IMAGES))
			if (err) {
				throw new UnprocessableEntityException(err)
			}
			file = fetched
		}
	}

	async changeStatus(@Param() params: ParamId, @Body() dto: ChangeStatusDto) {}
}
