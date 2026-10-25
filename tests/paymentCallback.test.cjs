const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { callbackPayload, safeReturnPath } = require('../src/utils/paymentCallback.cjs')

const query = {
  status: '1', order_id: '42', ref_num: 'test-ref',
  card_number: '6037****1234', tracking_code: 'test-track',
}

function resultPage(axios, params = query) {
  const source = fs.readFileSync(path.join(__dirname, '../src/views/PaystarResult.vue'), 'utf8')
  const script = source.match(/<script>([\s\S]*?)<\/script>/)[1]
    .replace(/^import .+$/gm, '').replace('export default', 'module.exports =')
  const sandbox = {
    module: { exports: {} }, axios,
    require: () => require('../src/utils/paymentCallback.cjs'),
  }
  vm.runInNewContext(script, sandbox)
  const component = sandbox.module.exports
  const page = {
    ...component.data(), $route: { query: params }, $store: { state: { runAnimation: true } },
  }
  page.verifyPayment = component.methods.verifyPayment.bind(page)
  return { page, component }
}

test('forwards only provider callback fields, never client amount or beneficiary', () => {
  assert.deepEqual(callbackPayload({ ...query, amount: '999999', userId: '7', authorLink: '//evil.example' }), query)
  assert.deepEqual(callbackPayload({ status: '-98', order_id: '42', ref_num: 'test-ref' }), {
    status: '-98', order_id: '42', ref_num: 'test-ref',
  })
})

test('rejects incomplete callbacks, duplicate fields and malformed identifiers', () => {
  for (const value of [{}, { ...query, status: ['1', '-98'] }, { ...query, ref_num: '' },
    { ...query, order_id: 'abc' }, { ...query, status: 'success' }, { ...query, tracking_code: 'a#b' }]) {
    assert.throws(() => callbackPayload(value))
  }
})

test('return destinations remain local Vue routes', () => {
  assert.equal(safeReturnPath('/profile/1/test'), '/profile/1/test')
  for (const value of ['https://evil.example/', '//evil.example/', '/\\evil.example/', '/\n', null]) {
    assert.equal(safeReturnPath(value), '/dashboard')
  }
})

test('result page shows loading until JSON confirmation, then server-proven success', async () => {
  let resolve, actualUrl, actualPayload, actualOptions
  const axios = { post(url, payload, options) {
    actualUrl = url; actualPayload = payload; actualOptions = options
    return new Promise(done => { resolve = done })
  } }
  const { page, component } = resultPage(axios)
  const pending = page.verifyPayment()
  assert.equal(page.loading, true)
  assert.equal(page.phase, 'pending')
  resolve({ data: { status: 'success', msg: 'verified', order_id: 42, amount: 100000,
    tracking_code: 'bank-track', authorLink: '/profile/1/test' } })
  await pending
  assert.equal(actualUrl, '/gateway/paystar/confirm/')
  assert.deepEqual(actualPayload, query)
  assert.equal(actualOptions.timeout, 60000)
  assert.equal(page.phase, 'success')
  assert.equal(page.loading, false)
  assert.equal(page.amount, 100000)
  assert.equal(component.computed.amountToman.call(page), (10000).toLocaleString('fa-IR'))
  assert.equal(page.authorLink, '/profile/1/test')
  assert.equal(page.$store.state.runAnimation, false)
})

test('cancelled payment is sent to backend and displayed as failure on frontend', async () => {
  let calls = 0
  const axios = { post(url, payload) {
    calls++
    assert.equal(payload.status, '-98')
    return Promise.reject({ response: { status: 400, data: { status: 'failed', msg: 'لغو شده' } } })
  } }
  const { page } = resultPage(axios, { status: '-98', order_id: '42', ref_num: 'test-ref' })
  await page.verifyPayment()
  assert.equal(calls, 1)
  assert.equal(page.phase, 'failed')
  assert.equal(page.message, 'لغو شده')
  assert.equal(page.retryable, false)
})

test('browser status=1 never overrides a failed server verification', async () => {
  const { page } = resultPage({ post: () => Promise.reject({
    response: { status: 502, data: { status: 'error', msg: 'not verified' } },
  }) })
  await page.verifyPayment()
  assert.equal(page.phase, 'failed')
  assert.equal(page.message, 'not verified')
  assert.equal(page.retryable, true)
})

test('network failure offers a confirmation retry, not another automatic payment', async () => {
  let calls = 0
  const { page } = resultPage({ post: () => {
    calls++
    return calls === 1 ? Promise.reject({ request: {} }) : Promise.resolve({
      data: { status: 'success', msg: 'verified', order_id: 42, amount: 100000 },
    })
  } })
  await page.verifyPayment()
  assert.equal(page.phase, 'failed')
  assert.equal(page.retryable, true)
  await page.verifyPayment()
  assert.equal(page.phase, 'success')
  assert.equal(calls, 2)
})

test('invalid URL parameters produce an inline error without contacting the API', async () => {
  const { page } = resultPage({ post: () => { throw new Error('must not be called') } }, {})
  await page.verifyPayment()
  assert.equal(page.phase, 'failed')
  assert.equal(page.retryable, false)
  assert.equal(page.loading, false)
  assert.match(page.message, /نامعتبر/)
})

test('malformed or wrong-order success response is not shown as success', async () => {
  for (const data of [{}, { status: 'success', order_id: 99, amount: 100000 },
    { status: 'success', order_id: 42, amount: '100000' }]) {
    const { page } = resultPage({ post: () => Promise.resolve({ data }) })
    await page.verifyPayment()
    assert.equal(page.phase, 'failed')
    assert.equal(page.retryable, true)
  }
})

test('payment result route is public even when the login session has expired', () => {
  const router = fs.readFileSync(path.join(__dirname, '../src/router/index.js'), 'utf8')
  const route = router.match(/\{\s*path: '\/payment\/result',[\s\S]*?\}/)[0]
  assert.match(route, /component: PaystarResult/)
  assert.doesNotMatch(route, /loginRequired/)
})
