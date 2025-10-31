import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import sharp from 'sharp'


import { replaceExt } from '../../utils/replace-ext.utils'
import { LinkSystemService } from '../link/services/link-system.service'
import { S3StorageService } from '../s3-storage/s3-storage.service'

import { ImageJobData } from './image-queue.service'
import { ELinkImageStatus } from '../../interfaces/ELinkImage'

@Processor('image')
export class ImageProcessor extends WorkerHost {
	constructor(
		private readonly s3: S3StorageService,
		private readonly linkSystemService: LinkSystemService
	) {
		super()
	}

	async process(job: Job<ImageJobData>) {
		const { linkId, linkImageId, srcKey } = job.data

		const input = await this.s3.getObjectAsBuffer(srcKey)

		const out = await sharp(input, { failOn: 'none' })
			.rotate()
			.resize({ width: 400, height: 300, fit: 'inside', withoutEnlargement: true })
			.toColourspace('srgb')
			.webp({ quality: 82, effort: 5 })
			.toBuffer()

		const meta = await sharp(out).metadata()

		const dstKey = replaceExt(srcKey, '.webp')

		const { key, url } = await this.s3.uploadPublic(
			out,
			'image/webp',
			true,
			dstKey
		)

		await this.linkSystemService.saveLink(linkId, {
			id: linkId,
			image: {
				id: linkImageId,
				processedKey: key,
				url,
				width: meta.width ?? 0,
				height: meta.height ?? 0,
				status: ELinkImageStatus.READY
			}
		})
	}
}
