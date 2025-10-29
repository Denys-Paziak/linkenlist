// interceptors/multipart.interceptor.ts
import { MultipartValue } from '@fastify/multipart'
import {
	CallHandler,
	ExecutionContext,
	HttpException,
	HttpStatus,
	Injectable,
	mixin,
	NestInterceptor,
	PayloadTooLargeException,
	Type,
	UnprocessableEntityException
} from '@nestjs/common'
import * as fastify from 'fastify'
import { Observable } from 'rxjs'

import { IMultipartFile } from '@/interfaces/IMultipartFile'
import { coerceArrays } from '@/utils/coerce-arrays.util'
import { getFileFromPart, MultipartOptions, validateFile } from '@/utils/file.util'

export interface MultipartInterceptorOptions {
	/** Глобальний ліміт розміру файлу (байти) — передається в parts({ limits }) */
	globalFileSizeLimit?: number
	/** Скільки файлів максимально приймати (загалом). За замовчуванням 1. */
	maxFiles?: number
	/** Набір правил валідації, що застосовуються до кожного файлу */
	validators?: MultipartOptions[]
	/** Які текстові поля нормалізувати як масиви */
	arrayKeys?: string[]
}

export function MultipartInterceptor(opts: MultipartInterceptorOptions = {}): Type<NestInterceptor> {
	const { globalFileSizeLimit, maxFiles = 1, validators = [], arrayKeys = ['branches', 'tags'] } = opts

	@Injectable()
	class MixinInterceptor implements NestInterceptor {
		async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
			const req = context.switchToHttp().getRequest() as fastify.FastifyRequest
			if (!req.isMultipart?.()) {
				throw new HttpException('The request should be a form-data', HttpStatus.BAD_REQUEST)
			}

			const files: Record<string, IMultipartFile[]> = {}
			const body: Record<string, any> = {}

			const parts = (req as any).parts({
				limits: globalFileSizeLimit ? { fileSize: globalFileSizeLimit } : undefined
			}) as AsyncIterable<any>

			let seenFiles = 0

			for await (const part of parts) {
				if (part.type !== 'file') {
					body[part.fieldname] = (part as MultipartValue).value
					continue
				}

				if (seenFiles >= maxFiles) {
					try {
						part.file?.resume?.()
					} catch {}
					throw new UnprocessableEntityException(`Maximum ${maxFiles} file(s) allowed.`)
				}

				let file: IMultipartFile
				try {
					file = await getFileFromPart(part)
				} catch (e: any) {
					try {
						part.file?.resume?.()
					} catch {}
					if (e?.code === 'FST_REQ_FILE_TOO_LARGE') {
						const mb = globalFileSizeLimit ? Math.floor(globalFileSizeLimit / 1024 / 1024) : undefined
						throw new PayloadTooLargeException(`File exceeds maximum allowed size${mb ? ` of ${mb}MB` : ''}`)
					}
					throw e
				}

				for (const rule of validators) {
					const error = await validateFile(file, rule)
					if (error) {
						throw new UnprocessableEntityException(error)
					}
				}

				files[part.fieldname] ||= []
				files[part.fieldname].push(file)
				seenFiles++
			}

			req.storedFiles = files
			req.body = coerceArrays(body, arrayKeys)

			return next.handle()
		}
	}

	return mixin(MixinInterceptor)
}
