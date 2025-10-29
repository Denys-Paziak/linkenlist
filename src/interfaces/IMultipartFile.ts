export interface IMultipartFile {
	buffer: Buffer
	filename: string
	size: number
	mimetype: string
	fieldname: string
}
