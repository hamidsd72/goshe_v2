// Characterization tests: document current behavior and reproduce reported defects.
// No live backend, browser session, credentials or production records are used.
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const days = ['oneDay', 'twoDay', 'treeDay', 'fourDay', 'fiveDay', 'sixDay', 'sevenDay']
const controls = ['oneday', 'twoday', 'treeday', 'fourday', 'fiveday', 'sixday', 'sevenday']

function fixture(reply = () => Promise.resolve({ data: {} })) {
  const calls = [], promises = []
  function track(promise) {
    promises.push(promise)
    promise.catch(() => {}) // Observe even broken error handlers without leaking unhandled rejections.
    return { then: fn => track(promise.then(fn)), catch: fn => track(promise.catch(fn)) }
  }
  const errorElement = { innerHTML: '', classList: { remove() {} } }
  const source = fs.readFileSync(path.join(__dirname, '../src/views/users/Dashboard.vue'), 'utf8')
  const script = source.match(/<script>([\s\S]*?)<\/script>/)[1]
    .replace(/^import .+$/gm, '').replace('export default', 'module.exports =')
  const sandbox = {
    module: { exports: {} }, DatePicker: {}, console: { log() {}, table() {} },
    require: () => require('../src/utils/apiTransport.cjs'),
    document: { querySelector: () => errorElement },
    axios: { patch(url, body) {
      calls.push({ url, body })
      return track(reply(url, body))
    } },
  }
  vm.runInNewContext(script, sandbox)
  const component = sandbox.module.exports
  const page = { ...component.data(), edit: true, is_doctor: true,
    user: { id: 169, first_name: 'Test', last_name: 'User', birthDay: '1370/01/01',
      codeMelly: '0000000000', province: 'test', city: 'test', address: 'test address' },
    doctor: [{ id: 902, uid: 12, call_price: 1000, msg_price: 2000, status: true,
      older: 'test history', shaba: 'test', visit_type: 'b', services: true,
      category: [1, 2], certificate: 'test degree' }],
  }
  days.forEach((day, i) => {
    page.doctor[0][day] = '09:00,17:00'
    page[controls[i] + 'first'] = '10:00'
    page[controls[i] + 'last'] = '18:00'
  })
  return { page, calls, errorElement,
    run: () => component.methods.doEdit.call(page),
    async settle() {
      await new Promise(resolve => setImmediate(resolve))
      return Promise.allSettled(promises)
    },
  }
}

test('doEdit sends user fields and all consultant fields, including services and seven shifts', async () => {
  const f = fixture()
  assert.equal(f.run(), undefined) // Current method does not return a completion promise.
  await f.settle()
  assert.deepEqual(f.calls.map(c => c.url), ['/my-user/169/', '/createauthor/169/'])
  assert.deepEqual(Object.keys(f.calls[0].body).sort(),
    ['first_name', 'last_name', 'birthDay', 'codeMelly', 'province', 'city', 'address'].sort())
  const author = f.calls[1].body
  for (const field of ['uid', 'call_price', 'msg_price', 'status', 'older', 'shaba', 'visit_type', 'services', 'category', 'certificate']) {
    assert.equal(author[field], f.page.doctor[0][field])
  }
  days.forEach(day => assert.equal(author[day], '10:00,18:00'))
  assert.equal(f.page.edit, false)
  assert.equal(f.page.anime, true) // Defect: loading is never cleared.
})

test('ordinary users only PATCH the user endpoint', async () => {
  const f = fixture()
  f.page.is_doctor = false
  f.run(); await f.settle()
  assert.equal(f.calls.length, 1)
})

test('each incomplete shift falls back to the entire existing shift', async () => {
  for (let i = 0; i < days.length; i++) {
    for (const part of ['first', 'last']) {
      const f = fixture()
      f.page[controls[i] + part] = ''
      f.run(); await f.settle()
      assert.equal(f.calls[1].body[days[i]], '09:00,17:00')
    }
  }
})

test('reproduces partial success: user success closes editing even when consultant PATCH fails', async () => {
  const f = fixture(url => url.includes('createauthor')
    ? Promise.reject({ response: { status: 500, data: '<html>MultipleObjectsReturned</html>' } })
    : Promise.resolve({ data: {} }))
  f.run(); await f.settle()
  assert.equal(f.page.edit, false)
  assert.match(f.errorElement.innerHTML, /<html>/) // Defect: backend HTML reaches an HTML sink.
})

test('reproduces consultant write continuing even when the user PATCH is rejected', async () => {
  const f = fixture(url => url.includes('my-user')
    ? Promise.reject({ response: { status: 400, data: { first_name: ['invalid'] } } })
    : Promise.resolve({ data: {} }))
  f.run(); await f.settle()
  assert.equal(f.calls.length, 2)
  assert.match(f.errorElement.innerHTML, /invalid/)
})

test('reproduces network error handlers crashing when response is absent', async () => {
  const f = fixture(() => Promise.reject(new Error('Network Error')))
  f.run()
  const settled = await f.settle()
  assert.ok(settled.some(result => result.status === 'rejected' && result.reason.name === 'TypeError'))
})

test('reproduces missing doctor record throwing after the user PATCH was already started', async () => {
  const f = fixture()
  f.page.doctor = []
  assert.throws(() => f.run(), { name: 'TypeError' })
  await f.settle()
  assert.equal(f.calls.length, 1)
})

test('multiple consultant records: only first record fields are sent to a userId-based endpoint', async () => {
  const f = fixture()
  f.page.doctor.push({ ...f.page.doctor[0], id: 903, services: false })
  f.run(); await f.settle()
  assert.equal(f.calls[1].url, '/createauthor/169/')
  assert.equal(f.calls[1].body.services, true)
  assert.equal(f.calls[1].body.id, undefined)
})
