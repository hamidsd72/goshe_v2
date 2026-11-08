const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

function fixture(rows) {
  const source = fs.readFileSync(path.join(__dirname, '../src/views/admin/Accounting.vue'), 'utf8')
  const script = source.match(/<script>([\s\S]*?)<\/script>/)[1]
    .replace(/^import .+$/gm, '').replace('export default', 'module.exports =')
  const sandbox = { module: { exports: {} } }
  vm.runInNewContext(script, sandbox)
  const component = sandbox.module.exports
  const page = { ...component.data(), report: { results: rows } }
  for (const [key, method] of Object.entries(component.methods)) page[key] = method.bind(page)
  for (const [key, getter] of Object.entries(component.computed)) {
    Object.defineProperty(page, key, { get: () => getter.call(page) })
  }
  return page
}

const ids = page => Array.from(page.sortedRows, row => row.user_id)

test('money columns sort numerically in both directions and keep missing amounts last', () => {
  const page = fixture([
    { user_id: 1, balance: 100 }, { user_id: 2, balance: 2 },
    { user_id: 3, balance: -500 }, { user_id: 4, balance: 0 },
    { user_id: 5, balance: null }, { user_id: 6, balance: '10' }
  ])
  page.sortColumn('balance')
  assert.deepEqual(ids(page), [3, 4, 2, 6, 1, 5])
  page.sortColumn('balance')
  assert.deepEqual(ids(page), [1, 6, 2, 4, 3, 5])
})

test('Persian names sort alphabetically and switching columns starts ascending', () => {
  const page = fixture([
    { user_id: 1, first_name: 'زهرا' }, { user_id: 2, first_name: 'آرزو' },
    { user_id: 3, first_name: 'بهار' }
  ])
  page.sortColumn('first_name')
  assert.deepEqual(ids(page), [2, 3, 1])
  page.sortColumn('first_name')
  assert.deepEqual(ids(page), [1, 3, 2])
  page.sortColumn('balance')
  assert.equal(page.sortDirection, 'asc')
})

test('sorting preserves source rows, selected consultants and stable order for ties', () => {
  const rows = [{ user_id: 1, balance: 2 }, { user_id: 2, balance: 1 }, { user_id: 3, balance: 1 }]
  const page = fixture(rows)
  page.selected = [1, 3]
  page.sortColumn('balance')
  assert.deepEqual(ids(page), [2, 3, 1])
  assert.deepEqual(rows.map(row => row.user_id), [1, 2, 3])
  assert.deepEqual(page.selected, [1, 3])
})

test('pending tax, empty data and phone values are handled', () => {
  const page = fixture([
    { user_id: 1, tax: null, phone: '09120000010' },
    { user_id: 2, tax: null, phone: '09120000002' }
  ])
  page.sortColumn('tax')
  assert.deepEqual(ids(page), [1, 2])
  page.sortColumn('phone')
  assert.deepEqual(ids(page), [2, 1])
  page.report.results = []
  assert.deepEqual(ids(page), [])
})

test('payment status and ambiguous IBAN use their displayed Persian labels', () => {
  const page = fixture([])
  assert.equal(page.sortValue({ settlement_status: 'partial' }, { key: 'settlement_status' }), 'پرداخت جزئی')
  assert.equal(page.sortValue({ iban: '', iban_ambiguous: true }, { key: 'iban' }), 'چند شبای متفاوت')
  assert.equal(page.sortValue({ iban: '' }, { key: 'iban' }), null)
})
