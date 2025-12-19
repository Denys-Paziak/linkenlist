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
import { DeleteResourceDto } from '../dtos/DeleteResource.dto'
import { GetSimplifiedResourceDto } from '../dtos/GetSimplifiedResource.dto'
import { ParamsContentSection } from '../dtos/ParamsContentSection.dto'
import { SaveBasicInformationDto } from '../dtos/SaveBasicInformation.dto'
import { SaveContentSectionDto } from '../dtos/SaveContentSection.dto'
import { SaveSEODto } from '../dtos/SaveSEO.dto'
import { SetSelectRelatedDto } from '../dtos/SetSelectRelated.dto'
import { SwitchRelatedMode } from '../dtos/SwitchRelatedMode.dto'
import { ResourceCommandService } from '../services/resource-command.service'
import { ResourceQueryService } from '../services/resource-query.service'
import { GetAllResourcesAdminDto } from '../dtos/GetAllResourcesAdmin.dto'
import { SwitchFeaturedDto } from '../dtos/SwitchFeatured.dto'

const IMAGE_MAX_MB = 5
const IMAGE_MAX_BYTES = IMAGE_MAX_MB * 1024 * 1024
const ACCEPT_IMAGES = /(image\/(jpeg|png))$/

const SECTION_FILE_MAX_MB = 50
const SECTION_FILE_MAX_BYTES = SECTION_FILE_MAX_MB * 1024 * 1024
const ACCEPT_SECTION_FILE =
	/(image\/(jpeg|png|webp)|application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|application\/vnd\.ms-excel|application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)$/

@Controller('admin/resources')
export class ResourceAdminController {
	constructor(
		private readonly resourceCommandService: ResourceCommandService,
		private readonly resourceQueryService: ResourceQueryService
	) {}

	@Authorization(ERoleName.ADMIN)
	@Get()
	async getAllResources(@Query() query: GetAllResourcesAdminDto) {
		return this.resourceQueryService.getAllResourcesAdmin(query)
	}

	@Authorization(ERoleName.ADMIN)
	@Get(':id')
	async getOneResource(@Param() params: ParamId) {
		return await this.resourceQueryService.getOneResourceAdmin(params.id)
	}

	@Authorization(ERoleName.ADMIN)
	@Post('init')
	async initResource() {
		return await this.resourceCommandService.initResource()
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

		await this.resourceCommandService.saveBasicInformation(params.id, dto, file)

		return { ok: true }
	}

	@Authorization(ERoleName.ADMIN)
	@Post(':id/content-section')
	async createContentSection(@Param() params: ParamId) {
		return await this.resourceCommandService.createContentSection(params.id)
	}

	@Authorization(ERoleName.ADMIN)
	@Delete(':id/content-section/:sectionId')
	async deleteContentSection(@Param() params: ParamsContentSection) {
		await this.resourceCommandService.deleteContentSection(params.id, params.sectionId)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Patch(':id/content-section/positions')
	async changePosContentSections(@Param() params: ParamId, @Body() dto: ChangePosContentSectionsDto) {
		await this.resourceCommandService.changePosContentSections(params.id, dto)

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

		await this.resourceCommandService.saveContentSection(params.id, params.sectionId, dto, filesArr)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Patch(':id/surfacing/related-mode')
	async switchRelatedMode(@Param() params: ParamId, @Body() dto: SwitchRelatedMode) {
		await this.resourceCommandService.switchRelatedMode(params.id, dto)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Patch(':id/surfacing/featured')
	async switchFeatured(@Param() params: ParamId, @Body() dto: SwitchFeaturedDto) {
		await this.resourceCommandService.switchFeatured(params.id, dto)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Get('simplified')
	async getSimplifiedResources(@Query() query: GetSimplifiedResourceDto) {
		// прийматиме рядок пошуку, та сторінку і ліміт для пагінації
		// пагінація автоматична при доскролювані до кінця
		// повертатиме id name slug isVerified

		return await this.resourceQueryService.getSimplifiedResources(query)
	}

	@Authorization(ERoleName.ADMIN)
	@Post(':id/related-resources')
	async addSelectRelated(@Param() params: ParamId, @Body() dto: SetSelectRelatedDto) {
		await this.resourceCommandService.addSelectRelated(params.id, dto)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Delete(':id/related-resources')
	async deleteSelectRelated(@Param() params: ParamId, @Body() dto: SetSelectRelatedDto) {
		await this.resourceCommandService.deleteSelectRelated(params.id, dto)

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

		await this.resourceCommandService.saveSEO(params.id, dto, file)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Patch(':id/change-status')
	async changeStatus(@Param() params: ParamId, @Body() dto: ChangeStatusDto) {
		await this.resourceCommandService.changeStatus(params.id, dto)

		return {
			ok: true
		}
	}

	@Authorization(ERoleName.ADMIN)
	@Delete(':id')
	async deleteResource(@Param() params: ParamId, @Body() dto: DeleteResourceDto) {
		await this.resourceCommandService.deleteResource(params.id, dto)

		return { ok: true }
	}

	@Authorization(ERoleName.ADMIN)
	@Get('tags')
	async getAllResourceTags() {
		return await this.resourceQueryService.getAllResourceTags()
	}
}
