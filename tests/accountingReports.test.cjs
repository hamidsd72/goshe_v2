const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

function fixture(get) {
  const source = fs.readFileSync(path.join(__dirname, '../src/views/admin/Accounting.vue'), 'utf8')
  const script = source.match(/<script>([\s\S]*?)<\/script>/)[1]
    .replace(/^import .+$/gm, '').replace('export default', 'module.exports =')
  const elements = []
  const element = () => ({ style: {}, setAttribute() {}, click() { this.clicked = true }, remove() {} })
  const sandbox = {
    Blob,
    module: { exports: {} }, axios: { get },
    URL: { createObjectURL: () => 'blob:test-report', revokeObjectURL() {} },
    document: { createElement: element, body: { appendChild: item => elements.push(item) } },
    setTimeout() {}
  }
  vm.runInNewContext(script, sandbox)
  const component = sandbox.module.exports
  const page = component.data()
  for (const [key, method] of Object.entries(component.methods)) page[key] = method.bind(page)
  page.report = {}
  return { page, elements }
}

test('detailed reports use applied report filters, not unsubmitted form changes', async () => {
  let request
  const { page } = fixture(async (url, config) => {
    request = { url, params: config.params }
    return { data: { title: 'report' } }
  })
  page.reportFilters = { start: '2026-11-01', consultant: 123 }
  page.filters.start = '2026-12-01'
  page.reportType = 'settlements'
  await page.loadDetailedReport()
  assert.equal(request.params.start, '2026-11-01')
  assert.equal(request.params.consultant, 123)
  assert.equal(request.params.report_type, 'settlements')
  assert.equal(page.detailedFilters.start, '2026-11-01')
})

test('late report response is discarded after main report changes', async () => {
  let resolve
  const { page } = fixture(() => new Promise(done => { resolve = done }))
  const pending = page.loadDetailedReport()
  page.report = {}
  resolve({ data: { title: 'stale' } })
  await pending
  assert.equal(page.detailedReport, null)
})

test('Excel download uses authenticated blob request and xlsx filename', async () => {
  let request
  const { page, elements } = fixture(async (url, config) => {
    request = { url, config }
    return { data: 'xlsx-bytes' }
  })
  page.detailedFilters = { report_type: 'balances', start: '2026-11-01' }
  await page.exportReport('xlsx')
  assert.equal(request.config.responseType, 'blob')
  assert.equal(request.config.params.file_type, 'xlsx')
  assert.equal(elements[0].download, 'consultant-balances.xlsx')
  assert.equal(elements[0].clicked, true)
})

test('PDF action accepts JSON through API validation and creates a print frame', async () => {
  let responseType
  const { page, elements } = fixture(async (url, config) => {
    responseType = config.responseType
    return { data: { html: '<html dir="rtl">گزارش</html>' } }
  })
  page.detailedFilters = { report_type: 'performance' }
  await page.exportReport('print')
  assert.equal(responseType, 'json')
  assert.equal(elements[0].title, 'چاپ گزارش مالی')
  assert.equal(elements[0].src, 'blob:test-report')
  assert.equal(typeof elements[0].onload, 'function')
})

test('report refresh invalidates an outstanding detailed response before refresh finishes', async () => {
  let resolve
  const { page } = fixture(() => new Promise(done => { resolve = done }))
  const pending = page.loadDetailedReport()
  page.reportRevision += 1
  resolve({ data: { title: 'old report' } })
  await pending
  assert.equal(page.detailedReport, null)
})
