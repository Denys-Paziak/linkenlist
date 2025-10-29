export function coerceArrays(fields: Record<string, any>, keys: string[]) {
  const out: Record<string, any> = { ...fields }
  for (const k of keys) {
    const v = out[k]
    if (v == null) { out[k] = []; continue }
    if (Array.isArray(v)) { out[k] = v.map(String); continue }
    const s = String(v)
    try {
      const parsed = JSON.parse(s)
      out[k] = Array.isArray(parsed) ? parsed.map(String) : [String(v)]
    } catch {
      out[k] = s.includes(',') ? s.split(',').map(x => x.trim()).filter(Boolean) : [s]
    }
  }
  return out
}