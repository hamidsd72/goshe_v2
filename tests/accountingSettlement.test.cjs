const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

function fixture(post) {
  const source = fs.readFileSync(path.join(__dirname, '../src/views/admin/Accounting.vue'), 'utf8')
  const script = source.match(/<script>([\s\S]*?)<\/script>/)[1]
    .replace(/^import .+$/gm, '').replace('export default', 'module.exports =')
  const sandbox = { module: { exports: {} }, axios: { post }, crypto: require('node:crypto').webcrypto }
  vm.runInNewContext(script, sandbox)
  const component = sandbox.module.exports
  const page = component.data()
  for (const [key, method] of Object.entries(component.methods)) page[key] = method.bind(page)
  page.load = async () => {}
  page.loadHistory = async () => {}
  return page
}

test('uncertain confirmation retries exactly the same token, time and bank reference', async () => {
  const calls = []
  const page = fixture(async (url, payload) => {
    calls.push(JSON.parse(JSON.stringify(payload)))
    if (calls.length === 1) throw new Error('network lost after commit')
    return { data: { id: 1, bank_reference: payload.bank_reference } }
  })
  page.settlementPreview = { token: 'signed-token' }
  page.bankReference = 'BANK-123'
  page.paidAt = '2026-11-07T10:00'
  page.transferCompleted = true
  await page.confirmSettlement()
  assert.ok(page.pendingConfirmation)
  page.bankReference = 'changed-after-timeout'
  page.paidAt = '2026-11-07T11:00'
  await page.confirmSettlement()
  assert.deepEqual(calls[0], calls[1])
  assert.equal(page.pendingConfirmation, null)
  assert.equal(page.settlementReceipt.id, 1)
})

test('rejected stale confirmation requires a new preview', async () => {
  const page = fixture(async () => { throw { response: { status: 409, data: { detail: 'balance changed' } } } })
  page.settlementPreview = { token: 'signed-token' }
  page.bankReference = 'BANK-123'
  page.paidAt = '2026-11-07T10:00'
  page.transferCompleted = true
  await page.confirmSettlement()
  assert.equal(page.pendingConfirmation, null)
  assert.equal(page.settlementPreview, null)
  assert.equal(page.settlementError, 'balance changed')
})

test('a late preview cannot replace a changed selection', async () => {
  let resolve
  const page = fixture(() => new Promise(done => { resolve = done }))
  page.selected = [1]
  page.paymentAmounts = { 1: 100 }
  page.report = {}
  const pending = page.previewSettlement()
  page.selected = [2]
  resolve({ data: { token: 'stale-preview' } })
  await pending
  assert.equal(page.settlementPreview, null)
})

test('reversal gets a stable UUID on HTTP-capable crypto API', () => {
  const page = fixture(async () => ({}))
  page.openReversal({ id: 123 })
  assert.match(page.reversal.request_id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  assert.equal(page.reversal.payment.id, 123)
})
