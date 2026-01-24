import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common'

import { Authorization } from '../../../decorators/auth.decorator'
import { Files } from '../../../decorators/files.decorator'
import { ParamId } from '../../../dtos/ParamId.dto'
import { MultipartInterceptor } from '../../../interceptors/multipart.interceptor'
import { ERoleName } from '../../../interfaces/ERoleName'
import { IMultipartFile } from '../../../interfaces/IMultipartFile'
import { MultipartOptions } from '../../../utils/file.util'
import { ChangePosContentSectionsDto } from '../dtos/ChangePosContentSections.dto'
import { ChangeStatusDto } from '../dtos/ChangeStatus.dto'
import { DeleteDealDto } from '../dtos/DeleteDeal.dto'
import { GetAllDealsAdminDto } from '../dtos/GetAllDealsAdmin.dto'
import { GetSimplifiedDealsDto } from '../dtos/GetSimplifiedDeals.dto'
import { ParamsContentSection } from '../dtos/ParamsContentSection.dto'
import { SaveBasicInformationDto } from '../dtos/SaveBasicInformation.dto'
import { SaveContentSectionDto } from '../dtos/SaveContentSection.dto'
import { SaveOfferDetailsDto } from '../dtos/SaveOfferDetails.dto'
import { SaveSEODto } from '../dtos/SaveSEO.dto'
import { SetSelectRelatedDto } from '../dtos/SetSelectRelatedDto.dto'
import { SwitchFeaturedDto } from '../dtos/SwitchFeatured.dto'
import { SwitchRelatedMode } from '../dtos/SwitchRelatedMode.dto'
import { SwitchShowOfferDetailsDto } from '../dtos/SwitchShowOfferDetails.dto'
import { DealCommandService } from '../services/deal-command.service'
import { DealQueryService } from '../services/deal-query.service'
import { ParamsContentSectionImage } from '../dtos/ParamsContentSectionImage.dto'

const IMAGE_MAX_MB = 5
const IMAGE_MAX_BYTES = IMAGE_MAX_MB * 1024 * 1024
const ACCEPT_IMAGES = /(image\/(jpeg|png))$/

const SECTION_FILE_MAX_MB = 50
const SECTION_FILE_MAX_BYTES = SECTION_FILE_MAX_MB * 1024 * 1024
const ACCEPT_SECTION_FILE =
	/(image\/(jpeg|png|webp)|application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|application\/vnd\.ms-excel|application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)$/

@Controller('admin/deals')
export class DealAdminController {
	constructor(
		private readonly dealCommandService: DealCommandService,
		private readonly dealQueryService: DealQueryService
	) {}

	@Authorization(ERoleName.ADMIN)
	@Get()
	async getAllDeals(@Query() query: GetAllDealsAdminDto) {
		return await this.dealQueryService.getAllDealsAdmin(query)
	}

	@Authorization(ERoleName.ADMIN)
	@Get(':id')
	async getOneDeal(@Param() params: ParamId) {
		return await this.dealQueryService.getOneDealAdmin(params.id)
	}

	@Authorization(ERoleName.ADMIN)
	@Post('init')
	async initDeal() {
		const dealId = await this.dealCommandService.initDeal()

		return {
			id: dealId
		}
	}

	@Authorization(ERoleName.ADMIN)
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
		const file = Object.values(files)?.[0]?.[0]

		await this.dealCommandService.saveBasicInformation(params.id, dto, file)

		return { ok: true }
	}

	@Authorization(ERoleName.ADMIN)
	@Patch(':id/offer-details')
	async saveOfferDetails(@Param() params: ParamId, @Body() dto: SaveOfferDetailsDto) {
		await this.dealCommandService.saveOfferDetails(params.id, dto)

		return { ok: true }
	}

	@Authorization(ERoleName.ADMIN)
	@Patch(':id/offer-details/enable')
	async switchShowOfferDetails(@Param() params: ParamId, @Body() dto: SwitchShowOfferDetailsDto) {
		await this.dealCommandService.switchShowOfferDetails(params.id, dto)

		return { ok: true }
	}

	@Authorization(ERoleName.ADMIN)
	@Post(':id/content-section')
	async createContentSection(@Param() params: ParamId) {
		return await this.dealCommandService.createContentSection(params.id)
	}

	@Authorization(ERoleName.ADMIN)
	@Delete(':id/content-section/:sectionId')
	async deleteContentSection(@Param() params: ParamsContentSection) {
		await this.dealCommandService.deleteContentSection(params.id, params.sectionId)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Patch(':id/content-section/positions')
	async changePosContentSections(@Param() params: ParamId, @Body() dto: ChangePosContentSectionsDto) {
		await this.dealCommandService.changePosContentSections(params.id, dto)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Patch(':id/content-section/:sectionId')
	@UseInterceptors(
		MultipartInterceptor({
			globalFileSizeLimit: SECTION_FILE_MAX_BYTES,
			maxFiles: 10,
			validators: [new MultipartOptions(SECTION_FILE_MAX_BYTES, ACCEPT_SECTION_FILE, true, ACCEPT_SECTION_FILE)]
		})
	)
	async saveContentSection(
		@Files() files: Record<string, IMultipartFile[]>,
		@Param() params: ParamsContentSection,
		@Body() dto: SaveContentSectionDto
	) {
		const filesArr = Object.values(files)?.[0]

		await this.dealCommandService.saveContentSection(params.id, params.sectionId, dto, filesArr)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Post(':id/content-section/:sectionId/text-image')
	@UseInterceptors(
		MultipartInterceptor({
			globalFileSizeLimit: IMAGE_MAX_BYTES,
			maxFiles: 1,
			validators: [new MultipartOptions(IMAGE_MAX_BYTES, ACCEPT_IMAGES, true, ACCEPT_IMAGES)]
		})
	)
	async uploadContentSectionImage(@Files() files: Record<string, IMultipartFile[]>, @Param() params: ParamsContentSection) {
		const file = Object.values(files)?.[0]?.[0]

		return await this.dealCommandService.uploadContentSectionImage(params.sectionId, file)
	}

	@Authorization(ERoleName.ADMIN)
	@Delete(':id/content-section/:sectionId/text-image/:imageId')
	async deleteContentSectionImage(@Param() params: ParamsContentSectionImage) {
		await this.dealCommandService.deleteContentSectionImage(params.imageId)
		return { ok: true }
	}

	@Authorization(ERoleName.ADMIN)
	@Patch(':id/surfacing/related-mode')
	async switchRelatedMode(@Param() params: ParamId, @Body() dto: SwitchRelatedMode) {
		await this.dealCommandService.switchRelatedMode(params.id, dto)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Patch(':id/surfacing/featured')
	async switchFeatured(@Param() params: ParamId, @Body() dto: SwitchFeaturedDto) {
		await this.dealCommandService.switchFeatured(params.id, dto)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Get('simplified')
	async getSimplifiedDeals(@Query() query: GetSimplifiedDealsDto) {
		return await this.dealQueryService.getSimplifiedDeals(query)
	}

	@Authorization(ERoleName.ADMIN)
	@Post(':id/related-deals')
	async addSelectRelated(@Param() params: ParamId, @Body() dto: SetSelectRelatedDto) {
		await this.dealCommandService.addSelectRelated(params.id, dto)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Delete(':id/related-deals')
	async deleteSelectRelated(@Param() params: ParamId, @Body() dto: SetSelectRelatedDto) {
		await this.dealCommandService.deleteSelectRelated(params.id, dto)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@UseInterceptors(
		MultipartInterceptor({
			globalFileSizeLimit: IMAGE_MAX_BYTES,
			maxFiles: 1,
			validators: [new MultipartOptions(IMAGE_MAX_BYTES, ACCEPT_IMAGES, true, ACCEPT_IMAGES)]
		})
	)
	@Patch(':id/seo')
	async saveSEO(@Files() files: Record<string, IMultipartFile[]>, @Param() params: ParamId, @Body() dto: SaveSEODto) {
		const file = Object.values(files)?.[0]?.[0]

		await this.dealCommandService.saveSEO(params.id, dto, file)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Patch(':id/change-status')
	async changeStatus(@Param() params: ParamId, @Body() dto: ChangeStatusDto) {
		await this.dealCommandService.changeStatus(params.id, dto)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Delete(':id')
	async deleteDeal(@Param() params: ParamId, @Body() dto: DeleteDealDto) {
		await this.dealCommandService.deleteDeal(params.id, dto)

		return { ok: true }
	}

	@Authorization(ERoleName.ADMIN)
	@Get('tags')
	async getAllDealTags() {
		return await this.dealQueryService.getAllDealTags()
	}
}
