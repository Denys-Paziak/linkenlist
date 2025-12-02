import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common'

import { Authorization } from '../../../decorators/auth.decorator'
import { Files } from '../../../decorators/files.decorator'
import { ParamId } from '../../../dtos/ParamId.dto'
import { MultipartInterceptor } from '../../../interceptors/multipart.interceptor'
import { ERoleName } from '../../../interfaces/ERoleName'
import { IMultipartFile } from '../../../interfaces/IMultipartFile'
import { MultipartOptions } from '../../../utils/file.util'
import { CreateLinkDto } from '../dtos/CreateLink.dto'
import { DeleteLinkDto } from '../dtos/DeleteLink.dto'
import { GetAllLinksAdminDto } from '../dtos/GetAllLinks.admin.dto'
import { UpdateLinkDto } from '../dtos/UpdateLink.dto'
import { LinkCommandService } from '../services/link-command.service'
import { LinkQueryService } from '../services/link-query.service'

const MAX_MB = 5
const MAX_BYTES = MAX_MB * 1024 * 1024
const ACCEPT_IMAGES = /(image\/(jpeg|png|webp))$/

@Controller('admin/links')
export class LinkAdminController {
	constructor(
		private readonly linkCommandService: LinkCommandService,
		private readonly linkQueryService: LinkQueryService
	) {}

	@Authorization(ERoleName.ADMIN)
	@Get()
	async getAllLinks(@Query() query: GetAllLinksAdminDto) {
		return this.linkQueryService.getAllLinksAdmin(query)
	}

	@Authorization(ERoleName.ADMIN)
	@Get(':id')
	async getOneLink(@Param() param: ParamId) {
		return this.linkQueryService.getOneLink(param.id)
	}

	@Authorization(ERoleName.ADMIN)
	@Post()
	@UseInterceptors(
		MultipartInterceptor({
			globalFileSizeLimit: MAX_BYTES,
			maxFiles: 1,
			validators: [new MultipartOptions(MAX_BYTES, ACCEPT_IMAGES, true, ACCEPT_IMAGES)]
		})
	)
	async createLink(@Files() files: Record<string, IMultipartFile[]>, @Body() dto: CreateLinkDto) {
		const file = Object.values(files)?.[0]?.[0]

		await this.linkCommandService.createLink(dto, file)

		return { ok: true }
	}

	@Authorization(ERoleName.ADMIN)
	@Patch(':id')
	@UseInterceptors(
		MultipartInterceptor({
			globalFileSizeLimit: MAX_BYTES,
			maxFiles: 1,
			validators: [new MultipartOptions(MAX_BYTES, ACCEPT_IMAGES, true, ACCEPT_IMAGES)]
		})
	)
	async updateLink(@Files() files: Record<string, IMultipartFile[]>, @Param() params: ParamId, @Body() dto: UpdateLinkDto) {
		const file = Object.values(files)?.[0]?.[0]

		await this.linkCommandService.updateLink(params.id, dto, file)

		return { ok: true }
	}

	@Authorization(ERoleName.ADMIN)
	@Delete(':id')
	async deleteLink(@Param() params: ParamId, @Body() dto: DeleteLinkDto) {
		await this.linkCommandService.deleteLink(params.id, dto)

		return { ok: true }
	}

	@Authorization(ERoleName.ADMIN)
	@Get('tags')
	async getAllLinkTags() {
		return await this.linkQueryService.getAllLinkTags()
	}
}
