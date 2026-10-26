const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const axios = require('axios')
// Axios 0.21 getUri omits baseURL; use the same combiner as its HTTP/XHR adapters.
const buildFullPath = require('axios/lib/core/buildFullPath')
const { normalizeApiUrl, validateApiResponse, paginatedResults, installApiTransport } = require('../src/utils/apiTransport.cjs')
const origin = 'https://doctor.example'
const base = '/api-backend/'

test('relative requests and prefixed links use the API prefix exactly once', () => {
  for (const url of ['category/', '/category/', '/api-backend/category/']) {
    assert.equal(normalizeApiUrl(url, base, origin), 'category/')
  }
  assert.equal(normalizeApiUrl('/api/auth/users/me/', base, origin), 'api/auth/users/me/')
})

test('HTTP DRF pagination stays on the HTTPS API with filters and encoding intact', () => {
  for (const scheme of ['http', 'https']) {
    for (const prefix of ['', '/api-backend']) {
      const query = '?limit=20&offset=20&category=A%2FB'
      assert.equal(normalizeApiUrl(`${scheme}://doctor.example${prefix}/author/${query}`, base, origin), `author/${query}`)
    }
  }
})

test('absolute API bases, including localhost ports, remain supported', () => {
  assert.equal(normalizeApiUrl('http://localhost:8000/author/?page=2', 'http://localhost:8000/', origin), 'author/?page=2')
  assert.equal(normalizeApiUrl('https://api.example/v1/author/?page=2', 'https://api.example/v1/', origin), 'author/?page=2')
})

test('custom Django endpoints without trailing slashes remain unchanged', () => {
  for (const url of ['notification-for-users', 'answer/question/visit/exam', 'answer/question/visit/exam/new']) {
    assert.equal(normalizeApiUrl(url, base, origin), url)
  }
})

test('untrusted absolute pagination URLs are rejected before transmitting auth headers', () => {
  for (const url of ['https://evil.example/author/', '//evil.example/author/',
    'https://doctor.example.evil.example/author/', 'https://doctor.example:9999/author/',
    'https://user:pass@doctor.example/author/', 'javascript:alert(1)', '/\\evil.example', '', null]) {
    assert.throws(() => normalizeApiUrl(url, base, origin))
  }
})

test('HTML with status 200 is rejected instead of being treated as API data', () => {
  for (const response of [
    { status: 200, data: '<!DOCTYPE html><html>Vue app</html>', headers: { 'content-type': 'text/html' } },
    { status: 200, data: '<html>Vue app</html>', headers: {} },
    { status: 200, data: {}, headers: { 'content-type': 'text/html' } },
  ]) {
    assert.throws(() => validateApiResponse(response), error => {
      assert.equal(error.code, 'ERR_INVALID_API_RESPONSE')
      assert.equal(typeof error.response.data.errors, 'string')
      assert.doesNotMatch(JSON.stringify(error.response), /<html>/)
      return true
    })
  }
})

test('JSON objects, lists and 204 responses are passed through unchanged', () => {
  for (const data of [{ token: 'test-only' }, { status: 'success' }, [], { results: [] }]) {
    const response = { status: 200, data }
    assert.equal(validateApiResponse(response), response)
  }
  const empty = { status: 204, data: '' }
  assert.equal(validateApiResponse(empty), empty)
})

test('paginated results reject malformed data instead of returning undefined', () => {
  for (const data of [null, '<html>', {}, { results: null }, { results: {} }]) {
    assert.throws(() => paginatedResults({ status: 200, data }))
  }
  const results = []
  assert.equal(paginatedResults({ data: { results } }), results)
})

test('real Axios integration retains base prefix, auth, method, body and timeout', async () => {
  const api = axios.create()
  installApiTransport(api, base, origin)
  api.defaults.headers.common.Authorization = 'Token test-only'
  const requests = []
  api.defaults.adapter = async config => {
    requests.push(config)
    return { status: 200, data: { results: [] }, headers: { 'content-type': 'application/json' }, config }
  }
  await api.get('/category/')
  await api.get('http://doctor.example/author/?offset=20')
  await api.post('/gateway/paystar/confirm/', { order_id: '42' }, { timeout: 60000 })
  const uri = config => buildFullPath(config.baseURL, config.url)
  assert.equal(uri(requests[0]), '/api-backend/category/')
  assert.equal(uri(requests[1]), '/api-backend/author/?offset=20')
  assert.equal(uri(requests[2]), '/api-backend/gateway/paystar/confirm/')
  assert.equal(requests[2].method, 'post')
  assert.equal(requests[2].data, '{"order_id":"42"}')
  assert.equal(requests[2].timeout, 60000)
  assert.equal(requests[2].headers.Authorization, 'Token test-only')
  await assert.rejects(api.get('https://evil.example/author/'))
  assert.equal(requests.length, 3)
})

test('Axios rejects an HTML 200 response and preserves normal HTTP error responses', async () => {
  const api = axios.create()
  installApiTransport(api, base, origin)
  api.defaults.adapter = async () => ({ status: 200, data: '<html>Vue app</html>', headers: {} })
  await assert.rejects(api.get('category/'), { code: 'ERR_INVALID_API_RESPONSE' })
  const denied = { response: { status: 401, data: { detail: 'unauthorized' } } }
  api.defaults.adapter = () => Promise.reject(denied)
  await assert.rejects(api.get('numbers/'), error => error === denied)
})

function sourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name)
    return entry.isDirectory() ? sourceFiles(file) : /\.(vue|js)$/.test(file) ? [file] : []
  })
}

test('audit every frontend Axios literal: only deliberate slashless Django endpoints are allowed', () => {
  const slashless = new Set(['notification-for-users', 'answer/question/visit/exam', 'answer/question/visit/exam/new'])
  let checked = 0
  for (const file of sourceFiles(path.join(__dirname, '../src'))) {
    const source = fs.readFileSync(file, 'utf8').replace(/^\s*\/\/.*$/gm, '')
    for (const match of source.matchAll(/axios\.(?:get|post|put|patch|delete)\(\s*(['"`])([\s\S]*?)\1/g)) {
      const url = match[2]
      if (url.startsWith('${')) continue // DRF pagination is covered by the transport tests.
      const pathname = url.split('?')[0].replace(/^\//, '')
      assert.ok(pathname.endsWith('/') || slashless.has(pathname), `${path.relative(__dirname, file)}: ${url}`)
      checked++
    }
  }
  assert.ok(checked > 120, 'the audit must include all frontend views and components')
})

test('category page handles empty, populated and malformed lists without length errors', async () => {
  for (const data of [{ results: [] }, { results: [{ id: 1 }] }, {}, '<html>Vue app</html>']) {
    const source = fs.readFileSync(path.join(__dirname, '../src/views/Categury.vue'), 'utf8')
    const script = source.match(/<script>([\s\S]*?)<\/script>/)[1]
      .replace(/^import .+$/gm, '').replace('export default', 'module.exports =')
    let pending
    const sandbox = {
      module: { exports: {} }, Categury: {},
      require: () => ({ paginatedResults }),
      axios: { get(url) {
        assert.equal(url, 'category/')
        pending = Promise.resolve({ status: 200, data })
        return pending
      } },
    }
    vm.runInNewContext(script, sandbox)
    const component = sandbox.module.exports
    const page = { ...component.data(), $store: { state: {} } }
    component.mounted.call(page)
    await pending
    await new Promise(resolve => setImmediate(resolve))
    assert.equal(page.$store.state.runAnimation, false)
    assert.ok(Array.isArray(page.items))
    if (Array.isArray(data.results)) assert.equal(page.items.length, data.results.length)
    else assert.ok(page.loadError)
  }
})

test('dashboard numbers request handles malformed and empty responses without unhandled errors', async () => {
  for (const data of [{ results: [] }, { results: [{ id: 1 }] }, {}, '<html>Vue app</html>']) {
    const source = fs.readFileSync(path.join(__dirname, '../src/views/users/Dashboard.vue'), 'utf8')
    const script = source.match(/<script>([\s\S]*?)<\/script>/)[1]
      .replace(/^import .+$/gm, '').replace('export default', 'module.exports =')
    const urls = []
    const sandbox = {
      module: { exports: {} }, DatePicker: {}, localStorage: { setItem() {} },
      require: () => ({ paginatedResults }),
      axios: { get(url) {
        urls.push(url)
        const body = url === 'numbers/' ? data : url.includes('users/me') ? { id: 1, username: 'test' }
          : url.includes('my-user') ? { id: 1, first_name: '', last_name: '' }
          : url.includes('userauthor') ? { results: [] } : { amount: 0, messageNotSee: 0 }
        return Promise.resolve({ status: 200, data: body })
      } },
    }
    vm.runInNewContext(script, sandbox)
    const component = sandbox.module.exports
    const page = {
      ...component.data(), $store: { state: {}, commit() { assert.fail('unexpected logout') } },
      $router: { push() { assert.fail('unexpected navigation') } },
    }
    component.mounted.call(page)
    await new Promise(resolve => setImmediate(resolve))
    assert.ok(urls.includes('numbers/'))
    assert.equal(page.$store.state.runAnimation, false)
    if (Array.isArray(data.results)) assert.equal(page.numbers.length, data.results.length)
    else assert.ok(page.numbersLoadError)
  }
})
