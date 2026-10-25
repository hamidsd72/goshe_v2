const CALLBACK_FIELDS = ['status', 'order_id', 'ref_num', 'card_number', 'tracking_code']

function callbackPayload(query) {
  const payload = {}
  for (const key of CALLBACK_FIELDS) {
    const value = query[key]
    if (value === undefined || value === null) continue
    if (typeof value !== 'string' || value.length > 250 || value.includes('#')) {
      throw new Error('اطلاعات بازگشت پرداخت معتبر نیست')
    }
    payload[key] = value
  }
  if (!/^[0-9]+$/.test(payload.order_id || '') || !payload.ref_num ||
      !/^-?[0-9]+$/.test(payload.status || '')) {
    throw new Error('اطلاعات بازگشت پرداخت ناقص یا نامعتبر است')
  }
  // Never forward browser-supplied amounts, user IDs or return destinations.
  return payload
}

function safeReturnPath(value) {
  return typeof value === 'string' && value.startsWith('/') &&
    !value.startsWith('//') && !/[\\\x00-\x1f]/.test(value) ? value : '/dashboard'
}

module.exports = { callbackPayload, safeReturnPath }
