// Django media URLs do not inherit Axios baseURL when used in img/a elements.
function mediaUrl(value, baseURL, origin) {
  if (typeof value !== 'string' || !value || /[\\\r\n]/.test(value)) return value
  const base = new URL((baseURL || '/api-backend/').replace(/\/*$/, '/'), origin)
  let target
  try {
    target = new URL(value, origin + '/')
  } catch (_) {
    return value
  }
  if (!['http:', 'https:'].includes(target.protocol) || target.username || target.password) return value
  // Leave external storage/CDN files untouched. Same-host legacy HTTP/8000 URLs
  // should follow the configured API transport instead of bypassing its prefix.
  if (![base.hostname, new URL(origin).hostname].includes(target.hostname)) return value
  const prefix = base.pathname.replace(/\/$/, '')
  let pathname = target.pathname
  if (prefix && pathname.startsWith(prefix + '/files/')) pathname = pathname.slice(prefix.length)
  if (!pathname.startsWith('/files/')) return value
  return new URL(pathname.slice(1) + target.search + target.hash, base).href
}

function normalizeMediaFields(data, baseURL, origin) {
  if (!data || typeof data !== 'object') return data
  for (const key of Object.keys(data)) {
    if (['avatar', 'baner', 'attach'].includes(key) && typeof data[key] === 'string') {
      data[key] = mediaUrl(data[key], baseURL, origin)
    } else if (data[key] && typeof data[key] === 'object') {
      normalizeMediaFields(data[key], baseURL, origin)
    }
  }
  return data
}

module.exports = { mediaUrl, normalizeMediaFields }
