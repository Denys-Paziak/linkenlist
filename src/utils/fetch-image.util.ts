import { BadRequestException, PayloadTooLargeException, UnprocessableEntityException } from '@nestjs/common'
import { fileTypeFromBuffer } from 'file-type'
import imageSize from 'image-size'
import { lookup as dnsLookup } from 'node:dns/promises'
import net from 'node:net'
import { basename } from 'node:path'

import { IMultipartFile } from '@/interfaces/IMultipartFile'

function isPrivateIp(ip: string) {
	if (net.isIPv4(ip)) {
		const n = ip.split('.').map(Number)
		return n[0] === 10 || (n[0] === 172 && n[1] >= 16 && n[1] <= 31) || (n[0] === 192 && n[1] === 168) || n[0] === 127
	}
	return ip === '::1' || ip.toLowerCase().startsWith('fc') || ip.toLowerCase().startsWith('fd')
}

function sanitizeName(name: string) {
	return (
		name
			.replace(/[^\p{L}\p{N}.\-_ ]/gu, '')
			.replace(/\s+/g, '_')
			.slice(0, 128) || 'file'
	)
}

function filenameFromCD(h?: string | null) {
	if (!h) return null
	const m = /filename\*?=(?:UTF-8''|")?([^";]+)[;""]?/i.exec(h)
	if (!m) return null
	try {
		return decodeURIComponent(m[1])
	} catch {
		return m[1]
	}
}

export async function fetchImageAsIMultipartFile(urlStr: string, maxBytes: number): Promise<IMultipartFile> {
	let url: URL
	try {
		url = new URL(urlStr)
	} catch {
		throw new BadRequestException('imgUrl is invalid')
	}
	if (!['http:', 'https:'].includes(url.protocol)) throw new BadRequestException('Only http/https URLs are allowed')

	try {
		const { address } = await dnsLookup(url.hostname)
		if (isPrivateIp(address)) throw new BadRequestException('Forbidden host')
	} catch (e) {
		throw new UnprocessableEntityException('Failed to resolve imgUrl')
	}

	const controller = new AbortController()
	const timer = setTimeout(() => controller.abort(), 15_000)

	let res: Response
	try {
		res = await fetch(url, {
			redirect: 'follow',
			signal: controller.signal,
			headers: { 'User-Agent': 'LinkEnlist/1.0 (+https://example.com)' }
		})
	} catch {
		clearTimeout(timer)
		throw new UnprocessableEntityException('Failed to fetch imgUrl')
	}
	clearTimeout(timer)

	if (!res.ok || !res.body) throw new UnprocessableEntityException(`imgUrl responded with ${res.status}`)

	const len = res.headers.get('content-length')
	if (len && Number(len) > maxBytes) {
		throw new PayloadTooLargeException(`File exceeds maximum allowed size of ${Math.round(maxBytes / 1048576)}MB`)
	}

	// побайтове читання з лімітом
	const reader = res.body.getReader()
	const chunks: Buffer[] = []
	let total = 0
	while (true) {
		const { value, done } = await reader.read()
		if (done) break
		if (value) {
			total += value.byteLength
			if (total > maxBytes) {
				try {
					reader.cancel()
				} catch {}
				throw new PayloadTooLargeException(`File exceeds maximum allowed size of ${Math.round(maxBytes / 1048576)}MB`)
			}
			chunks.push(Buffer.from(value))
		}
	}
	const buffer = Buffer.concat(chunks)

	let width: number | undefined
	let height: number | undefined

	try {
		const dimensions = imageSize(buffer)
		width = dimensions.width
		height = dimensions.height
	} catch {}

	const detected = await fileTypeFromBuffer(buffer)
	const mime = detected?.mime || res.headers.get('content-type') || 'application/octet-stream'

	const cdName = filenameFromCD(res.headers.get('content-disposition') || undefined)
	const urlName = basename(url.pathname || '') || 'file'
	const base = sanitizeName(cdName || urlName)
	const ext = detected?.ext ? `.${detected.ext}` : ''
	const filename = base.endsWith(ext) ? base : `${base}${ext}`

	return { buffer, size: buffer.length, filename, mimetype: mime, fieldname: 'imgUrl', width, height }
}
