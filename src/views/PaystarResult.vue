<template>
  <div class="container mt-5 text-dark text-right" dir="rtl">
    <div class="card shadow-sm mx-auto" style="max-width: 620px" aria-live="polite">
      <div class="card-body p-4">
        <h1 class="h4 mb-4">نتیجه پرداخت</h1>
        <div v-if="loading" role="status">در حال بررسی و تأیید پرداخت؛ لطفاً منتظر بمانید…</div>
        <template v-else>
          <div class="alert" :class="phase === 'success' ? 'alert-success' : 'alert-danger'" role="alert">
            {{ message }}
          </div>
          <p v-if="orderId">شماره سفارش: {{ orderId }}</p>
          <template v-if="phase === 'success'">
            <p>مبلغ افزوده‌شده به موجودی: {{ amountToman }} تومان</p>
            <p v-if="trackingCode">کد پیگیری: {{ trackingCode }}</p>
            <router-link :to="authorLink" class="btn btn-success ml-2">ادامه</router-link>
          </template>
          <template v-else>
            <button v-if="retryable" class="btn btn-primary ml-2" @click="verifyPayment">بررسی دوباره پرداخت</button>
            <p v-if="retryable" class="text-muted small mt-3">نتیجه هنوز قطعی نیست؛ پیش از پرداخت مجدد، دوباره بررسی کنید یا با پشتیبانی تماس بگیرید.</p>
            <router-link v-else to="/transaction/create/" class="btn btn-outline-primary ml-2">بازگشت به افزایش موجودی</router-link>
          </template>
          <router-link to="/dashboard" class="btn btn-outline-secondary">داشبورد</router-link>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const { callbackPayload, safeReturnPath } = require('@/utils/paymentCallback.cjs')

export default {
  name: 'PaystarResult',
  data() {
    return {
      loading: true, phase: 'pending', message: '', retryable: false,
      orderId: '', amount: 0, trackingCode: '', authorLink: '/dashboard',
    }
  },
  computed: {
    amountToman() {
      return (this.amount / 10).toLocaleString('fa-IR')
    },
  },
  mounted() {
    this.verifyPayment()
  },
  methods: {
    async verifyPayment() {
      this.loading = true
      this.retryable = false
      this.phase = 'pending'
      try {
        const payload = callbackPayload(this.$route.query)
        this.orderId = payload.order_id
        const response = await axios.post('/gateway/paystar/confirm/', payload, { timeout: 60000 })
        const result = response.data
        if (!result || result.status !== 'success' || String(result.order_id) !== payload.order_id ||
            !Number.isFinite(result.amount) || result.amount <= 0) {
          const error = new Error('پاسخ تأیید پرداخت معتبر نیست؛ برای بررسی با پشتیبانی تماس بگیرید')
          error.retryable = true
          throw error
        }
        this.phase = 'success'
        this.message = result.msg
        this.amount = result.amount
        this.trackingCode = result.tracking_code || ''
        this.authorLink = safeReturnPath(result.authorLink)
      } catch (error) {
        const response = error.response
        this.phase = 'failed'
        if (response) {
          this.message = (response.data && response.data.msg) || 'بررسی پرداخت ناموفق بود'
          this.retryable = response.status >= 500
        } else if (error.request || error.retryable) {
          this.message = 'ارتباط برای بررسی پرداخت برقرار نشد؛ نتیجه هنوز مشخص نیست'
          this.retryable = true
        } else {
          this.message = error.message || 'اطلاعات پرداخت معتبر نیست'
        }
      } finally {
        this.loading = false
        this.$store.state.runAnimation = false
      }
    },
  },
}
</script>
