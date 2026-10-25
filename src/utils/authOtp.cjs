const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹'
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'

function normalizeDigits(value) {
  return String(value || '').replace(/[۰-۹٠-٩]/g, digit => {
    const persianIndex = PERSIAN_DIGITS.indexOf(digit)
    return String(persianIndex >= 0 ? persianIndex : ARABIC_DIGITS.indexOf(digit))
  })
}

function normalizeMobileInput(value) {
  const mobile = normalizeDigits(value).replace(/\s+/g, '')
  return mobile.startsWith('0') ? mobile.slice(1) : mobile
}

function isValidIranMobile(value) {
  return /^9\d{9}$/.test(normalizeMobileInput(value))
}

function isValidOtp(value) {
  return /^[0-9]{5,}$/.test(normalizeDigits(value))
}

module.exports = { normalizeDigits, normalizeMobileInput, isValidIranMobile, isValidOtp }
