import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { Injectable, Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { execFile } from 'child_process'
import { randomUUID } from 'crypto'
import { promises as fs } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import sharp from 'sharp'
import { promisify } from 'util'

import { EFileStatus } from '../../interfaces/EFileStatus'
import { replaceExt } from '../../utils/replace-ext.utils'
import { DealSystemService } from '../deal/services/deal-system.service'
import { LinkSystemService } from '../link/services/link-system.service'
import { S3StorageService } from '../s3-storage/s3-storage.service'

import { AttachmentJobData, ImageJobData } from './image-queue.service'

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
		private readonly linkSystemService: LinkSystemService,
		private readonly dealSystemService: DealSystemService
	) {
		super()
	}

	async process(job: Job<ImageJobData>) {
		switch (job.name) {
			case 'link-hero':
				return this.linkHero(job)
			case 'deal-hero':
				return this.dealHero(job)
			case 'deal-attachment':
				return this.dealAttachment(job)
			default:
				throw new Error(`Unknown job type: ${job.name}`)
		}
	}

	/** HERO для Link */
	private async linkHero(job: Job<ImageJobData>) {
		const { entityId, entityFileId, srcKey } = job.data
		this.logger.log(`Start job ${job.id} for linkId=${entityId}, linkImageId=${entityFileId}, srcKey=${srcKey}`)

		// 0) Ідемпотентність та перехід у PROCESSING
		try {
			const alreadyQueued = await this.linkSystemService.isImageStatus(entityFileId, EFileStatus.QUEUED)
			if (!alreadyQueued) {
				this.logger.log(`Skip job ${job.id}: image already PROCESSED (linkImageId=${entityFileId})`)
				return { ok: true, skipped: true }
			}
			await this.linkSystemService.updatImageStatus(entityFileId, EFileStatus.PROCESSING)
		} catch (e) {
			if (isNotFoundError(e)) {
				this.logger.warn(`Skip: LinkImage ${entityFileId} not found before processing`)
				throw new DiscardedError(`LinkImage ${entityFileId} not found`)
			}
			throw e
		}

		// 1) Отримати оригінал
		let input: Buffer
		try {
			input = await this.s3.getObjectAsBuffer(srcKey)
		} catch (e: any) {
			if (isNoSuchKey(e)) {
				try {
					await this.linkSystemService.updatImageStatus(entityFileId, EFileStatus.FAILED)
				} catch {}
				this.logger.warn(`Original not found for linkImageId=${entityFileId}, key=${srcKey}`)
				throw new DiscardedError('Original image not found in S3')
			}
			throw e
		}

		// 2) Обробка зображення (hero превʼю)
		const out = await sharp(input, { failOn: 'none' })
			.rotate()
			.resize({ width: 400, height: 300, fit: 'inside', withoutEnlargement: true })
			.toColourspace('srgb')
			.webp({ quality: 82, effort: 5 })
			.toBuffer()

		const meta = await sharp(out).metadata()

		// 3) Ключ призначення
		const dstKey = replaceExt(srcKey, '.webp')

		// 4) Запис до S3
		let uploaded: { key: string; url: string } | null = null
		try {
			uploaded = await this.s3.uploadPublic(out, 'image/webp', true, dstKey)
		} catch (e) {
			throw e
		}

		// 5) Оновлення БД
		try {
			await this.linkSystemService.updateLink(entityId, {
				id: entityId,
				image: {
					id: entityFileId,
					processedKey: uploaded.key,
					url: uploaded.url,
					width: meta.width ?? 0,
					height: meta.height ?? 0,
					status: EFileStatus.READY
				}
			})
		} catch (e) {
			if (isNotFoundError(e)) {
				this.logger.warn(
					`Linked entity missing while saving result (linkId=${entityId}, linkImageId=${entityFileId}). Cleaning up S3...`
				)
				try {
					if (uploaded?.key) await this.s3.delete(uploaded.key)
				} catch (delErr) {
					this.logger.warn(`Cleanup failed for key=${uploaded?.key}: ${(delErr as Error).message}`)
				}
				throw new DiscardedError('Linked entity deleted during processing')
			}
			throw e
		}

		this.logger.log(`Completed job ${job.id}: linkImageId=${entityFileId} -> ${uploaded.url}`)
	}

	/** HERO для Deal */
	private async dealHero(job: Job<ImageJobData>) {
		const { entityId, entityFileId, srcKey } = job.data
		this.logger.log(`Start job ${job.id} for dealId=${entityId}, dealImageId=${entityFileId}, srcKey=${srcKey}`)

		// 0) Ідемпотентність та перехід у PROCESSING
		try {
			const alreadyQueued = await this.dealSystemService.isImageStatus(entityFileId, EFileStatus.QUEUED)
			if (!alreadyQueued) {
				this.logger.log(`Skip job ${job.id}: image already PROCESSED (dealImageId=${entityFileId})`)
				return { ok: true, skipped: true }
			}
			await this.dealSystemService.updatImageStatus(entityFileId, EFileStatus.PROCESSING)
		} catch (e) {
			if (isNotFoundError(e)) {
				this.logger.warn(`Skip: DealImage ${entityFileId} not found before processing`)
				throw new DiscardedError(`DealImage ${entityFileId} not found`)
			}
			throw e
		}

		// 1) Отримати оригінал
		let input: Buffer
		try {
			input = await this.s3.getObjectAsBuffer(srcKey)
		} catch (e: any) {
			if (isNoSuchKey(e)) {
				try {
					await this.dealSystemService.updatImageStatus(entityFileId, EFileStatus.FAILED)
				} catch {}
				this.logger.warn(`Original not found for dealImageId=${entityFileId}, key=${srcKey}`)
				throw new DiscardedError('Original image not found in S3')
			}
			throw e
		}

		// 2) Обробка зображення (великий hero)
		const out = await sharp(input, { failOn: 'none' })
			.rotate()
			.resize({ width: 1200, height: 630, fit: 'inside', withoutEnlargement: true })
			.toColourspace('srgb')
			.webp({ quality: 82, effort: 5 })
			.toBuffer()

		const meta = await sharp(out).metadata()

		// 3) Ключ призначення
		const dstKey = replaceExt(srcKey, '.webp')

		// 4) Запис до S3
		let uploaded: { key: string; url: string } | null = null
		try {
			uploaded = await this.s3.uploadPublic(out, 'image/webp', true, dstKey)
		} catch (e) {
			throw e
		}

		// 5) Оновлення БД
		try {
			await this.dealSystemService.updateDeal(entityId, {
				id: entityId,
				image: {
					id: entityFileId,
					processedKey: uploaded.key,
					url: uploaded.url,
					width: meta.width ?? 0,
					height: meta.height ?? 0,
					status: EFileStatus.READY
				}
			})
		} catch (e) {
			if (isNotFoundError(e)) {
				this.logger.warn(
					`Deal entity missing while saving result (dealId=${entityId}, dealImageId=${entityFileId}). Cleaning up S3...`
				)
				try {
					if (uploaded?.key) await this.s3.delete(uploaded.key)
				} catch (delErr) {
					this.logger.warn(`Cleanup failed for key=${uploaded?.key}: ${(delErr as Error).message}`)
				}
				throw new DiscardedError('Deal entity deleted during processing')
			}
			throw e
		}

		this.logger.log(`Completed job ${job.id}: dealImageId=${entityFileId} -> ${uploaded.url}`)
	}

	/**
	 * Мінімальна очистка/оптимізація для вкладених файлів:
	 * PDF / DOC / DOCX / XLS / XLSX / PNG / JPG
	 */
	private async dealAttachment(job: Job<AttachmentJobData>) {
		const { entityId, entityFileId, srcKey } = job.data
		this.logger.log(`Start attachment job ${job.id} for dealId=${entityId}, attachmentId=${entityFileId}, srcKey=${srcKey}`)

		// 0) Ідемпотентність + статус
		try {
			const alreadyQueued = await this.dealSystemService.isAttachmentStatus(entityFileId, EFileStatus.QUEUED)
			if (!alreadyQueued) {
				this.logger.log(`Skip job ${job.id}: attachment already PROCESSED (id=${entityFileId})`)
				return { ok: true, skipped: true }
			}
			await this.dealSystemService.updatAttachmentStatus(entityFileId, EFileStatus.PROCESSING)
		} catch (e) {
			if (isNotFoundError(e)) {
				this.logger.warn(`Skip: Deal attachment ${entityFileId} not found before processing`)
				throw new DiscardedError(`Deal attachment ${entityFileId} not found`)
			}
			throw e
		}

		// 1) Отримати оригінал
		let input: Buffer
		try {
			input = await this.s3.getObjectAsBuffer(srcKey)
		} catch (e: any) {
			if (isNoSuchKey(e)) {
				try {
					await this.dealSystemService.updatAttachmentStatus(entityFileId, EFileStatus.FAILED)
				} catch {}
				this.logger.warn(`Original not found for dealAttachmentId=${entityFileId}, key=${srcKey}`)
				throw new DiscardedError('Original file not found in S3')
			}
			throw e
		}

		// 2) Мінімальна оптимізація по типу файлу
		const ext = getExtensionFromKey(srcKey)
		const output = await optimizeFileMinimal(input, ext)

		// Тут не міняємо розширення, щоб лишити очікуваний тип файлу
		const dstKey = srcKey

		// 3) Запис у S3
		let uploaded: { key: string; url: string } | null = null
		if (output) {
			try {
				uploaded = await this.s3.uploadPublic(output.out, output.contentType, true, dstKey)
			} catch (e) {
				throw e
			}
		}

		// 4) Оновлення БД
		try {
			await this.dealSystemService.updateDealSectionAttachment(entityFileId, {
				processedKey: uploaded?.key,
				url: uploaded?.url,
				status: EFileStatus.READY
			})
		} catch (e) {
			if (isNotFoundError(e)) {
				this.logger.warn(
					`Deal attachment entity missing while saving result (dealId=${entityId}, attachmentId=${entityFileId}). Cleaning up S3...`
				)
				try {
					if (uploaded?.key) await this.s3.delete(uploaded.key)
				} catch (delErr) {
					this.logger.warn(`Cleanup failed for key=${uploaded?.key}: ${(delErr as Error).message}`)
				}
				throw new DiscardedError('Deal attachment entity deleted during processing')
			}
			throw e
		}

		this.logger.log(`Completed attachment job ${job.id}: attachmentId=${entityFileId} -> ${uploaded?.url}`)
	}

	/** Глобальний обробник падінь */
	@OnWorkerEvent('failed')
	async onFailed(job: Job<ImageJobData>, err: Error) {
		if (err && err.name === 'DiscardedError') {
			this.logger.warn(`[discarded] jobId=${job.id}: ${err.message}`)
			return
		}

		const id = job?.data?.entityFileId
		if (!id) {
			this.logger.error(`[failed] jobId=${job.id}: ${err.message}`, err.stack)
			return
		}

		try {
			// Відмічаємо FAILED тим сервісом, до якого належить job
			if (job.name === 'link-hero') {
				await this.linkSystemService.updatImageStatus(id, EFileStatus.FAILED)
			} else {
				await this.dealSystemService.updatImageStatus(id, EFileStatus.FAILED)
			}
		} catch {
			/* сутність може не існувати */
		}

		this.logger.error(`[failed] jobId=${job.id}: ${err.message}`, err.stack)
	}
}

/** Визначення "оригінал не знайдено" для S3 SDK */
function isNoSuchKey(e: any) {
	const code = e?.name || e?.code
	return code === 'NoSuchKey' || code === 'NotFound' || code === 'ENOENT' || /no such key/i.test(String(e?.message))
}

/** Визначення помилки "сутність не знайдена" у домені */
function isNotFoundError(e: any) {
	const msg = String(e?.message || '')
	return /not\s*found/i.test(msg) || e?.status === 404
}

/** Дістати розширення з ключа */
function getExtensionFromKey(key: string): string {
	const match = /\.([a-zA-Z0-9]+)$/.exec(key)
	return match ? match[1].toLowerCase() : ''
}

const execFileAsync = promisify(execFile)

/** Мінімальна оптимізація файлів за розширенням */
async function optimizeFileMinimal(input: Buffer, ext: string): Promise<{ out: Buffer; contentType: string } | null> {
	const lowerExt = ext.toLowerCase()

	switch (lowerExt) {
		// JPG / JPEG — легка компресія + поворот
		case 'jpg':
		case 'jpeg': {
			const pipeline = sharp(input, { failOn: 'none' }).rotate()

			const meta = await pipeline.metadata()
			// якщо гігантські, даунскейл до 2560px по довгій стороні
			const maxSide = Math.max(meta.width ?? 0, meta.height ?? 0)
			if (maxSide > 0 && maxSide > 2560) {
				pipeline.resize({
					width: meta.width && meta.width >= meta.height ? 2560 : undefined,
					height: meta.height && meta.height > meta.width ? 2560 : undefined,
					fit: 'inside',
					withoutEnlargement: true
				})
			}

			const out = await pipeline
				.jpeg({
					quality: 82,
					mozjpeg: true,
					chromaSubsampling: '4:2:0'
				})
				.toBuffer()

			return { out, contentType: 'image/jpeg' }
		}

		// PNG — максимальної компресії, палітра якщо можливо
		case 'png': {
			const pipeline = sharp(input, { failOn: 'none' }).rotate()

			const meta = await pipeline.metadata()
			// якщо гігантські, даунскейл до 2560px по довгій стороні
			const maxSide = Math.max(meta.width ?? 0, meta.height ?? 0)
			if (maxSide > 0 && maxSide > 2560) {
				pipeline.resize({
					width: meta.width && meta.width >= meta.height ? 2560 : undefined,
					height: meta.height && meta.height > meta.width ? 2560 : undefined,
					fit: 'inside',
					withoutEnlargement: true
				})
			}

			const out = await pipeline
				.png({
					compressionLevel: 9,
					palette: true
				})
				.toBuffer()

			return { out, contentType: 'image/png' }
		}

		// PDF — реальна оптимізація через Ghostscript + fallback (просто повертаємо вхід)
		case 'pdf': {
			const optimized = await optimizePdfWithGhostscript(input).catch(() => null)
			if (optimized) {
				return {
					out: optimized,
					contentType: 'application/pdf'
				}
			} else {
				return null
			}
		}

		// DOC / DOCX / XLS / XLSX — мінімум: очищення метаданих через exiftool
		case 'doc':
		case 'docx':
		case 'xls':
		case 'xlsx': {
			const cleaned = await stripMetadataWithExiftool(input, lowerExt).catch(() => null)

			let contentType: string
			switch (lowerExt) {
				case 'doc':
					contentType = 'application/msword'
					break
				case 'docx':
					contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
					break
				case 'xls':
					contentType = 'application/vnd.ms-excel'
					break
				case 'xlsx':
					contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
					break
				default:
					contentType = 'application/octet-stream'
			}

			if (cleaned) {
				return {
					out: cleaned,
					contentType
				}
			} else {
				return null
			}
		}

		default:
			// нічого не чіпаємо
			return null
	}
}

/**
 * Оптимізація PDF через Ghostscript.
 * Повертає оптимізований PDF або кидає помилку, якщо щось пішло не так.
 *
 * Важливо: потрібен встановлений `gs` у PATH.
 */
async function optimizePdfWithGhostscript(input: Buffer): Promise<Buffer> {
	const tmpBase = join(tmpdir(), `pdf-opt-${randomUUID()}`)
	const inPath = `${tmpBase}-in.pdf`
	const outPath = `${tmpBase}-out.pdf`

	await fs.writeFile(inPath, input)

	try {
		// Налаштування:
		// -dPDFSETTINGS=/ebook — непоганий баланс якості/розміру
		// можна змінити на /screen, /printer, /prepress за потреби
		const args = [
			'-sDEVICE=pdfwrite',
			'-dCompatibilityLevel=1.4',
			'-dPDFSETTINGS=/ebook',
			'-dNOPAUSE',
			'-dQUIET',
			'-dBATCH',
			`-sOutputFile=${outPath}`,
			inPath
		]

		await execFileAsync('gs', args)

		const out = await fs.readFile(outPath)
		return out
	} finally {
		// best-effort cleanup
		await safeUnlink(inPath)
		await safeUnlink(outPath)
	}
}

/**
 * Очищення метаданих для Office/PDF через exiftool.
 * Повертає новий файл або кидає помилку.
 *
 * Важливо: потрібен встановлений `exiftool` у PATH.
 */
async function stripMetadataWithExiftool(input: Buffer, ext: string): Promise<Buffer> {
	const tmpBase = join(tmpdir(), `meta-strip-${randomUUID()}`)
	const inPath = `${tmpBase}-in.${ext}`
	const outPath = `${tmpBase}-out.${ext}`

	await fs.writeFile(inPath, input)

	try {
		// -all=    — видалити всі метадані
		// -overwrite_original — перезаписати вхідний файл
		// -o out   — вивід у інший файл, щоб не лізти в open handles
		const args = ['-all=', inPath, '-o', outPath]

		await execFileAsync('exiftool', args)

		const out = await fs.readFile(outPath)
		return out
	} finally {
		// exiftool зазвичай створює ще *-in.ext_original — теж прибираємо
		await safeUnlink(inPath)
		await safeUnlink(outPath)
		await safeUnlink(`${inPath}_original`)
	}
}

async function safeUnlink(path: string) {
	try {
		await fs.unlink(path)
	} catch {
		// ignore
	}
}
