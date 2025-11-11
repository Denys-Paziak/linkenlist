import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	Req,
	UnprocessableEntityException,
	UseInterceptors
} from '@nestjs/common'
import type { FastifyRequest } from 'fastify'

import { Authorization } from '../../../decorators/auth.decorator'
import { Files } from '../../../decorators/files.decorator'
import { ParamId } from '../../../dtos/ParamId.dto'
import { MultipartInterceptor } from '../../../interceptors/multipart.interceptor'
import { ERoleNames } from '../../../interfaces/ERoleNames'
import { IMultipartFile } from '../../../interfaces/IMultipartFile'
import { fetchImageAsIMultipartFile } from '../../../utils/fetch-image.util'
import { MultipartOptions, validateFile } from '../../../utils/file.util'
import { CreateLinkDto } from '../dtos/CreateLink.dto'
import { DeleteLinkDto } from '../dtos/DeleteLink.dto'
import { GetAllLinksDto } from '../dtos/GetAllLinks.dto'
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

	@Authorization(ERoleNames.ADMIN)
	@Get()
	async getAllLinks(@Query() query: GetAllLinksDto) {
		return this.linkQueryService.getAllLinks(query)
	}

	@Authorization(ERoleNames.ADMIN)
	@Get(':id')
	async getOneLink(@Param() param: ParamId) {
		return this.linkQueryService.getOneLink(param.id)
	}

	@Authorization(ERoleNames.ADMIN)
	@Post()
	@UseInterceptors(
		MultipartInterceptor({
			globalFileSizeLimit: MAX_BYTES,
			maxFiles: 1,
			validators: [new MultipartOptions(MAX_BYTES, ACCEPT_IMAGES, true, ACCEPT_IMAGES)]
		})
	)
	async createLink(@Files() files: Record<string, IMultipartFile[]>, @Body() dto: CreateLinkDto) {
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

		await this.linkCommandService.createLink(dto, file)

		return { ok: true }
	}

	@Authorization(ERoleNames.ADMIN)
	@Patch(':id')
	@UseInterceptors(
		MultipartInterceptor({
			globalFileSizeLimit: MAX_BYTES,
			maxFiles: 1,
			validators: [new MultipartOptions(MAX_BYTES, ACCEPT_IMAGES, true, ACCEPT_IMAGES)]
		})
	)
	async updateLink(@Files() files: Record<string, IMultipartFile[]>, @Param() params: ParamId, @Body() dto: UpdateLinkDto) {
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

		await this.linkCommandService.updateLink(params.id, dto, file)

		return { ok: true }
	}

	@Authorization(ERoleNames.ADMIN)
	@Delete(':id')
	async deleteLink(@Param() params: ParamId, @Body() dto: DeleteLinkDto) {
		await this.linkCommandService.deleteLink(params.id, dto)

		return { ok: true }
	}

	@Get('tags')
	async getAllLinkTags() {
		return await this.linkQueryService.getAllLinkTags()
	}
}
