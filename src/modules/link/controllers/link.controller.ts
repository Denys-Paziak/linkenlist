import { Body, Controller, Delete, Get, Patch, Post, UnprocessableEntityException, UseInterceptors } from '@nestjs/common'

import { Files } from '../../../decorators/files.decorator'
import { MultipartInterceptor } from '../../../interceptors/multipart.interceptor'
import { IMultipartFile } from '../../../interfaces/IMultipartFile'
import { fetchImageAsIMultipartFile } from '../../../utils/fetch-image.util'
import { MultipartOptions, validateFile } from '../../../utils/file.util'
import { CreateLinkDto } from '../dtos/CreateLink.dto'
import { DeleteLinkDto } from '../dtos/DeleteLink.dto'
import { UpdateLinkDto } from '../dtos/UpdateLink.dto'
import { LinkCommandService } from '../services/link-command.service'
import { LinkQueryService } from '../services/link-query.service'

const MAX_MB = 2
const MAX_BYTES = MAX_MB * 1024 * 1024
const ACCEPT_IMAGES = /(image\/(jpeg|png|webp))$/

@Controller('links')
export class LinkController {
	constructor(
		private readonly linkCommandService: LinkCommandService,
		private readonly linkQueryService: LinkQueryService
	) {}

	//@Authorization(ERoleNames.ADMIN)
	@Post()
	@UseInterceptors(
		MultipartInterceptor({
			globalFileSizeLimit: MAX_BYTES,
			maxFiles: 1,
			validators: [new MultipartOptions(MAX_BYTES, ACCEPT_IMAGES, true, ACCEPT_IMAGES)],
			arrayKeys: ['branches', 'tags']
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

		await this.linkCommandService.createLink(dto, file)
	}

	@Patch()
	@UseInterceptors(
		MultipartInterceptor({
			globalFileSizeLimit: MAX_BYTES,
			maxFiles: 1,
			validators: [new MultipartOptions(MAX_BYTES, ACCEPT_IMAGES, true, ACCEPT_IMAGES)],
			arrayKeys: ['branches', 'tags']
		})
	)
	async updateLink(@Files() files: Record<string, IMultipartFile[]>, @Body() dto: UpdateLinkDto) {
		let file: IMultipartFile | undefined | null
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
		} else if (typeof dto.imgUrl !== 'string') {
			file = dto.imgUrl
		} 

		await this.linkCommandService.updateLink(dto, file)
	}

	@Delete()
	async deleteLink(@Body() dto: DeleteLinkDto) {
		await this.linkCommandService.deleteLink(dto)
	}

	@Get('tags')
	async getAllLinkTags() {
		return await this.linkQueryService.getAllLinkTags()
	}
}
