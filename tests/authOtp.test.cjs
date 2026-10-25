const test = require('node:test')
const assert = require('node:assert/strict')
const {
  normalizeDigits,
  normalizeMobileInput,
  isValidIranMobile,
  isValidOtp,
} = require('../src/utils/authOtp.cjs')

test('normalizes Persian and Arabic digits', () => {
  assert.equal(normalizeDigits('۱۲٣۴۵۶'), '123456')
})

test('normalizes Iranian mobile input to backend username format', () => {
  assert.equal(normalizeMobileInput('۰۹۱۲۳۴۵۶۷۸۹'), '9123456789')
})

test('validates Iranian mobile numbers', () => {
  assert.equal(isValidIranMobile('9123456789'), true)
  assert.equal(isValidIranMobile('8123456789'), false)
  assert.equal(isValidIranMobile('91234'), false)
})

test('accepts numeric OTPs with at least five digits', () => {
  for (const code of ['12345', '123456', '1234567', '۱۲۳۴۵', '١٢٣٤٥', '01234']) {
    assert.equal(isValidOtp(code), true, code)
  }
})

test('rejects short and nonnumeric OTPs', () => {
  for (const code of ['', '1234', '۱۲۳۴', '1234a', '123 45', null, undefined]) {
    assert.equal(isValidOtp(code), false, String(code))
  }
})
