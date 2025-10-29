import { MultipartFile } from '@fastify/multipart'
import { FileTypeValidator, FileValidator, MaxFileSizeValidator } from '@nestjs/common'
import { fileTypeFromBuffer } from 'file-type'
import imageSize from 'image-size'

import { IMultipartFile } from '@/interfaces/IMultipartFile'

export class MultipartOptions {
	constructor(
		public maxFileSize?: number,
		public fileType?: string | RegExp,
		public enforceSignature?: boolean,
		public allowedSignature?: string | RegExp
	) {}
}

export const getFileFromPart = async (part: MultipartFile): Promise<IMultipartFile> => {
	const buffer = await part.toBuffer()

	let width: number | undefined
	let height: number | undefined

	try {
		const dimensions = imageSize(buffer)
		width = dimensions.width
		height = dimensions.height
	} catch {}

	return {
		buffer,
		size: buffer.byteLength,
		filename: part.filename,
		mimetype: part.mimetype,
		fieldname: part.fieldname,
		width,
		height
	}
}

export const validateFile = async (file: IMultipartFile, options: MultipartOptions): Promise<string | void> => {
	const validators: FileValidator[] = []
	if (options.maxFileSize) validators.push(new MaxFileSizeValidator({ maxSize: options.maxFileSize }))
	if (options.fileType) validators.push(new FileTypeValidator({ fileType: options.fileType }))

	for (const v of validators) {
		if (!v.isValid(file)) return v.buildErrorMessage(file)
	}

	if (options.enforceSignature) {
		const sig = await fileTypeFromBuffer(file.buffer)
		const expected = options.allowedSignature
		const ok = sig?.mime && (expected instanceof RegExp ? expected.test(sig.mime) : sig.mime === expected)
		if (!ok) return `Invalid file signature. Expected: ${expected || 'unknown'}, got: ${sig?.mime || 'unknown'}`
	}
}
