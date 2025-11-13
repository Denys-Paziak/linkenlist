export interface IUploadedImage {
	key: string
	url: string
	width?: number
	height?: number
}

export interface IUploadedFile {
	key: string
	url: string
	name?: string,
	ext?: string
}