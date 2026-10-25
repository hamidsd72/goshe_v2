const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

// Exercise the existing Options API method without installing a new test runner.
function componentMethods(file, axios, window) {
  const source = fs.readFileSync(path.join(__dirname, '../src', file), 'utf8')
  const script = source.match(/<script>([\s\S]*?)<\/script>/)[1]
    .replace(/^import .+$/gm, '')
    .replace('export default', 'module.exports =')
  const sandbox = {
    module: { exports: {} }, axios, window, Star: {},
    require: () => require('../src/utils/authOtp.cjs'),
  }
  vm.runInNewContext(script, sandbox)
  return sandbox.module.exports.methods
}

for (const file of ['components/Profile.vue', 'views/users/TransactionCreate.vue']) {
  test(`${file} requests Paystar using order_id and follows returned link`, async () => {
    let actualUrl, actualBody
    const axios = {
      post(url, body) {
        actualUrl = url
        actualBody = body
        return Promise.resolve({ data: { link: 'https://core.paystar.ir/api/pardakht/payment?token=test' } })
      },
    }
    const window = { location: { href: '' } }
    const methods = componentMethods(file, axios, window)
    methods.paymentCreate.call({}, 42)
    await Promise.resolve()
    assert.equal(actualUrl, '/gateway/paystar/create/link/')
    assert.equal(actualBody.order_id, 42)
    assert.deepEqual(Object.keys(actualBody), ['order_id'])
    assert.equal(window.location.href, 'https://core.paystar.ir/api/pardakht/payment?token=test')
  })
}
