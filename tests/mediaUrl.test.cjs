const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const axios = require('axios')
const { mediaUrl, normalizeMediaFields } = require('../src/utils/mediaUrl.cjs')
const { installApiTransport } = require('../src/utils/apiTransport.cjs')
const origin = 'https://doctor.example'
const base = '/api-backend/'

test('relative, root and absolute Django file paths use the API media prefix', () => {
  for (const value of ['files/avatar/test.jpeg', '/files/avatar/test.jpeg',
    'http://doctor.example/files/avatar/test.jpeg', 'https://doctor.example/files/avatar/test.jpeg',
    'http://doctor.example:8000/files/avatar/test.jpeg', '//doctor.example/files/avatar/test.jpeg']) {
    assert.equal(mediaUrl(value, base, origin), `${origin}/api-backend/files/avatar/test.jpeg`)
  }
})

test('already prefixed media URLs are idempotent and preserve encoded filenames and queries', () => {
  const value = `${origin}/api-backend/files/ticket/%D8%AA%20image.jpeg?download=1#preview`
  assert.equal(mediaUrl(value, base, origin), value)
  assert.equal(mediaUrl('/api-backend/files/avatar/test.jpeg', base, origin), `${origin}/api-backend/files/avatar/test.jpeg`)
})

test('custom, absolute and root API bases remain supported', () => {
  assert.equal(mediaUrl('/files/avatar/test.jpeg', '/backend', origin), `${origin}/backend/files/avatar/test.jpeg`)
  assert.equal(mediaUrl('/files/avatar/test.jpeg', 'http://localhost:8000/', origin), 'http://localhost:8000/files/avatar/test.jpeg')
  assert.equal(mediaUrl('http://api.example/files/avatar/test.jpeg', 'https://api.example/v1/', origin), 'https://api.example/v1/files/avatar/test.jpeg')
})

test('external images, frontend assets, empty values and non-media routes stay unchanged', () => {
  for (const value of [null, undefined, '', '/img/logo.png', '/files-other/test.jpeg',
    'https://images.example/files/avatar/test.jpeg', 'https://doctor.example.evil.example/files/avatar/test.jpeg',
    '/payment/result?status=1', 'blob:https://doctor.example/test', 'data:image/png;base64,test',
    'https://user:pass@doctor.example/files/avatar/test.jpeg']) {
    assert.equal(mediaUrl(value, base, origin), value)
  }
})

test('nested lists normalize only model media fields, not message text, pagination or payment links', () => {
  const data = { results: [{ userId: { avatar: '/files/avatar/test.jpeg' }, baner: '/files/baner/test.jpg',
    attach: '/files/files/test.pdf', content: '/files/files/test.pdf', authorLink: '/files/files/test.pdf',
    link: 'https://pay.example/payment', next: 'http://doctor.example/author/?page=2' }] }
  const same = normalizeMediaFields(data, base, origin)
  assert.equal(same, data)
  const row = data.results[0]
  assert.equal(row.userId.avatar, `${origin}/api-backend/files/avatar/test.jpeg`)
  assert.equal(row.baner, `${origin}/api-backend/files/baner/test.jpg`)
  assert.equal(row.attach, `${origin}/api-backend/files/files/test.pdf`)
  assert.equal(row.content, '/files/files/test.pdf')
  assert.equal(row.authorLink, '/files/files/test.pdf')
  assert.equal(row.link, 'https://pay.example/payment')
  assert.equal(row.next, 'http://doctor.example/author/?page=2')
})

test('actual Axios responses normalize both nested GET files and uploaded avatar responses', async () => {
  const api = axios.create()
  installApiTransport(api, base, origin)
  api.defaults.adapter = async config => ({ status: 200, config, headers: { 'content-type': 'application/json' },
    data: config.method === 'get' ? { results: [{ userId: { avatar: 'http://doctor.example/files/avatar/test.jpeg' } }] }
      : { avatar: '/files/avatar/new.jpeg' } })
  const list = await api.get('author/')
  assert.equal(list.data.results[0].userId.avatar, `${origin}/api-backend/files/avatar/test.jpeg`)
  const updated = await api.patch('my-user/1/', { first_name: 'test' })
  assert.equal(updated.data.avatar, `${origin}/api-backend/files/avatar/new.jpeg`)
})

test('search views no longer concatenate API prefixes or hardcoded IPs with avatar URLs', () => {
  for (const file of ['views/Categury.vue', 'views/ShowCategury.vue', 'views/Home.vue']) {
    const source = fs.readFileSync(path.join(__dirname, '../src', file), 'utf8')
    assert.match(source, /:src="result\.userId\.avatar"/)
    assert.doesNotMatch(source, /:src="String\([^"\n]*avatar/)
  }
})
