const { normalizeMediaFields } = require('./mediaUrl.cjs')

// All Axios consumers in this application talk to Django, including DRF next/previous links.
function normalizeApiUrl(url, baseURL, origin) {
  if (typeof url !== 'string' || !url.trim() || /[\\\r\n]/.test(url)) {
    throw new Error('Invalid API URL')
  }
  const base = new URL(baseURL || '/api-backend/', origin)
  const prefix = base.pathname.replace(/\/$/, '')
  let target
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url)) {
    target = new URL(url, base)
    // DRF may return HTTP links when TLS terminates at the CDN. Keep requests on
    // the configured API transport instead of following them outside its prefix.
    if (!['http:', 'https:'].includes(target.protocol) || target.host !== base.host ||
        target.username || target.password) {
      throw new Error('API URL is outside the configured backend')
    }
  } else {
    target = new URL(url.replace(/^\/+/, ''), base.origin + '/')
  }
  let pathname = target.pathname
  if (prefix && (pathname === prefix || pathname.startsWith(prefix + '/'))) {
    pathname = pathname.slice(prefix.length)
  }
  // Axios combines even leading-slash URLs with baseURL. Return one API-relative
  // path so the prefix is applied exactly once. Never add slashes indiscriminately:
  // some custom Django endpoints intentionally have no trailing slash.
  return pathname.replace(/^\/+/, '') + target.search + target.hash
}

function invalidResponse(response) {
  const message = 'پاسخ سرویس معتبر نیست. دوباره تلاش کنید.'
  const error = new Error(message)
  error.code = 'ERR_INVALID_API_RESPONSE'
  // Do not pass HTML (or request headers containing tokens) to UI error handlers.
  error.response = { status: response.status, data: { errors: message, msg: message } }
  return error
}

function validateApiResponse(response) {
  if (response.status === 204) return response
  if (response.data === null || typeof response.data !== 'object' ||
      /text\/html/i.test((response.headers || {})['content-type'] || '')) {
    throw invalidResponse(response)
  }
  return response
}

function paginatedResults(response) {
  if (!response.data || !Array.isArray(response.data.results)) {
    throw invalidResponse(response)
  }
  return response.data.results
}

function installApiTransport(axios, baseURL, origin) {
  axios.defaults.baseURL = (baseURL || '/api-backend/').replace(/\/*$/, '/')
  axios.interceptors.request.use(config => {
    config.url = normalizeApiUrl(config.url, config.baseURL || axios.defaults.baseURL, origin)
    return config
  })
  axios.interceptors.response.use(response => {
    validateApiResponse(response)
    normalizeMediaFields(response.data, (response.config || {}).baseURL || axios.defaults.baseURL, origin)
    return response
  })
}

module.exports = { normalizeApiUrl, validateApiResponse, paginatedResults, installApiTransport }
