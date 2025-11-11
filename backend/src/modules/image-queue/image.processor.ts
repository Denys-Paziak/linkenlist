import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { Injectable, Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import sharp from 'sharp'

import { EImageStatus } from '../../interfaces/EImageStatus'
import { replaceExt } from '../../utils/replace-ext.utils'
import { LinkSystemService } from '../link/services/link-system.service'
import { S3StorageService } from '../s3-storage/s3-storage.service'

import { ImageJobData } from './image-queue.service'

class DiscardedError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'DiscardedError'
	}
}

@Processor('image')
@Injectable()
export class ImageProcessor extends WorkerHost {
	private readonly logger = new Logger(ImageProcessor.name)

	constructor(
		private readonly s3: S3StorageService,
		private readonly linkSystemService: LinkSystemService
	) {
		super()
	}

	async process(job: Job<ImageJobData>) {
		const { linkId, linkImageId, srcKey } = job.data
		this.logger.log(`Start job ${job.id} for linkId=${linkId}, linkImageId=${linkImageId}, srcKey=${srcKey}`)

		// 0) Ідемпотентність та перехід у PROCESSING
		// Якщо хтось уже зробив цю роботу — просто вийдемо
		try {
			const alreadyReady = await this.linkSystemService.isImageStatus(linkImageId, EImageStatus.QUEUED)
			if (!alreadyReady) {
				this.logger.log(`Skip job ${job.id}: image already READY (linkImageId=${linkImageId})`)
				return { ok: true, skipped: true }
			}
			await this.linkSystemService.updateImageStatus(linkImageId, EImageStatus.PROCESSING)
		} catch (e) {
			// Якщо LinkImage вже видалили — немає сенсу далі працювати
			if (isNotFoundError(e)) {
				this.logger.warn(`Skip: LinkImage ${linkImageId} not found before processing`)
				throw new DiscardedError(`LinkImage ${linkImageId} not found`)
			}
			throw e
		}

		// 1) Спроба отримати оригінал з S3
		let input: Buffer
		try {
			input = await this.s3.getObjectAsBuffer(srcKey)
		} catch (e: any) {
			if (isNoSuchKey(e)) {
				// Оригінал зник/видалили — фіксуємо бізнес-стан і НЕ ретраїмо
				await safeSetFailed(this.linkSystemService, linkImageId, 'ORIGINAL_NOT_FOUND')
				this.logger.warn(`Original not found for linkImageId=${linkImageId}, key=${srcKey}`)
				throw new DiscardedError('Original image not found in S3')
			}
			// Інші помилки — хай ретраяться згідно attempts/backoff
			throw e
		}

		// 2) Обробка зображення
		const out = await sharp(input, { failOn: 'none' })
			.rotate()
			.resize({ width: 400, height: 300, fit: 'inside', withoutEnlargement: true })
			.toColourspace('srgb')
			.webp({ quality: 82, effort: 5 })
			.toBuffer()

		const meta = await sharp(out).metadata()

		// 3) Ключ призначення: той самий шлях, інше розширення
		const dstKey = replaceExt(srcKey, '.webp')

		// 4) Запис результату у S3
		let uploaded: { key: string; url: string } | null = null
		try {
			// твій підпис: uploadPublic(buffer, contentType, cacheForever, keyOverride)
			uploaded = await this.s3.uploadPublic(out, 'image/webp', true, dstKey)
		} catch (e) {
			// Проблеми з S3 ретраяться
			throw e
		}

		// 5) Оновлення БД. Можуть трапитись ситуації, коли лінк/картинку видалили.
		try {
			await this.linkSystemService.updateLink(linkId, {
				id: linkId,
				image: {
					id: linkImageId,
					processedKey: uploaded.key,
					url: uploaded.url,
					width: meta.width ?? 0,
					height: meta.height ?? 0,
					status: EImageStatus.READY
				}
			})
		} catch (e) {
			// Якщо пов’язану сутність видалили — намагаємося прибрати із S3 згенероване зображення
			if (isNotFoundError(e)) {
				this.logger.warn(
					`Linked entity missing while saving result (linkId=${linkId}, linkImageId=${linkImageId}). Cleaning up S3...`
				)
				try {
					if (uploaded?.key) await this.s3.delete(uploaded.key)
				} catch (delErr) {
					this.logger.warn(`Cleanup failed for key=${uploaded?.key}: ${(delErr as Error).message}`)
				}
				// Позначати FAILED для LinkImage тут уже нема кому (сутність зникла),
				// тож просто **не ретраїмо** — job завершена логічно.
				throw new DiscardedError('Linked entity deleted during processing')
			}
			// Інші помилки — нехай ретраяться
			throw e
		}

		this.logger.log(`Completed job ${job.id}: linkImageId=${linkImageId} -> ${uploaded.url}`)
		return {
			ok: true,
			linkId,
			linkImageId,
			key: uploaded.key,
			url: uploaded.url,
			width: meta.width ?? 0,
			height: meta.height ?? 0
		}
	}

	/** Глобальний обробник падінь: ставимо FAILED, якщо можемо, і лог */
	@OnWorkerEvent('failed')
	async onFailed(job: Job<ImageJobData>, err: Error) {
		// Якщо це наш "DiscardedError" — це очікувана бізнес-ситуація, статус уже виставили (або нема сутності).
		if (err && err.name === 'DiscardedError') {
			this.logger.warn(`[discarded] jobId=${job.id}: ${err.message}`)
			return
		}
		// Інакше — реальна помилка. Спробуємо позначити FAILED, якщо LinkImage ще існує.
		try {
			if (job?.data?.linkImageId) {
				await safeSetFailed(this.linkSystemService, job.data.linkImageId, err.message || 'PROCESSING_ERROR')
			}
		} catch {
			/* ігноруємо: сутність може не існувати */
		}
		this.logger.error(`[failed] jobId=${job.id}: ${err.message}`, err.stack)
	}
}

/** Визначення "оригінал не знайдено" для S3 SDK */
function isNoSuchKey(e: any) {
	const code = e?.name || e?.code
	return code === 'NoSuchKey' || code === 'NotFound' || code === 'ENOENT' || /no such key/i.test(String(e?.message))
}

/** Визначення помилки "сутність не знайдена" у домені (Link/LinkImage) */
function isNotFoundError(e: any) {
	const msg = String(e?.message || '')
	return /not\s*found/i.test(msg) || e?.status === 404
}

/** Безпечне проставлення FAILED для LinkImage */
async function safeSetFailed(linkSystemService: LinkSystemService, linkImageId: number, reason: string) {
	try {
		await linkSystemService.updateImageStatus(linkImageId, EImageStatus.FAILED)
	} catch {
		/* якщо сутність пропала — нічого не робимо */
	}
}
