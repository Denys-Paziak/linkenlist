export function replaceExt(key: string, newExt = '.webp') {
	return key.replace(/\.[a-z0-9]+$/i, newExt)
}
