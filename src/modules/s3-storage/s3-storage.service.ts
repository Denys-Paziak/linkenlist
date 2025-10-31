// s3-storage.service.ts
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { basename, extname } from 'node:path'


import { createS3Client } from './s3.client'
import { generateRandomSuffix } from '../../utils/generate-random-suffix.util'
import { generateSlug } from '../../utils/slug.util'

@Injectable()
export class S3StorageService {
	private readonly s3: S3Client
	private readonly bucket: string
	private readonly publicBase: string | null // MinIO / CDN / власний домен
	private readonly isPath: boolean
	private readonly region: string

	constructor(private readonly configService: ConfigService) {
		this.s3 = createS3Client()
		this.bucket = this.configService.getOrThrow<string>('S3_BUCKET')
		this.publicBase = this.configService.getOrThrow<string>('S3_PUBLIC_BASE') || null
		this.isPath = String(this.configService.getOrThrow<string>('S3_FORCE_PATH_STYLE')).toLowerCase() === 'true'
		this.region = this.configService.getOrThrow<string>('S3_REGION')
	}

	private buildKey(path: string, entityId: number, originalName: string) {
		const p = path.replace(/^\/+|\/+$/g, '')
		const ext = (extname(originalName) || '').toLowerCase()
		const slugName = generateSlug(basename(originalName, ext))
		const d = new Date()
		const yyyy = d.getUTCFullYear()
		const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
		const dd = String(d.getUTCDate()).padStart(2, '0')
		// структура: <prefix>/<YYYY>/<MM>/<DD>/<hash>-<uuid><ext>
		return `${p}/${entityId}/${yyyy}-${mm}-${dd}-${slugName}-${generateRandomSuffix()}${ext}`
	}

	private publicUrlForKey(key: string) {
		if (this.publicBase) {
			// MinIO/CDN: для MinIO в path-style додаємо назву бакета
			const base = this.publicBase.replace(/\/$/, '')
			return this.isPath ? `${base}/${this.bucket}/${key}` : `${base}/${key}`
		}
		// Стандартна AWS URL для публічного бакета
		return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`
	}

	/** Завантаження буфера; повертає публічну стабільну URL */
	async uploadPublic(
		buffer: Buffer,
		contentType: string,
		cacheForever = true,
		key:
			| string
			| {
					filename: string
					path: string
					entityId: number
			  }
	) {
		const Key = typeof key === 'string' ? key : this.buildKey(key.path, key.entityId, key.filename)

		try {
			await this.s3.send(
				new PutObjectCommand({
					Bucket: this.bucket,
					Key,
					Body: buffer,
					ContentType: contentType,
					CacheControl: cacheForever ? 'public, max-age=31536000, immutable' : 'public, max-age=600'
					// ACL не потрібен, якщо bucket policy вже публічний.
				})
			)
		} catch (err) {
			throw new InternalServerErrorException('Failed to upload to S3')
		}

		return { key: Key, url: this.publicUrlForKey(Key) }
	}

	async delete(key: string) {
		await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }))
	}

	async getObjectAsBuffer(key: string): Promise<Buffer> {
		const res = await this.s3.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }))
		const chunks: Uint8Array[] = []
		for await (const chunk of res.Body as any) chunks.push(chunk)
		return Buffer.concat(chunks)
	}
}
