<template>
  <div class="container-fluid py-4 text-right" dir="rtl">
    <router-link to="/admin" class="btn btn-light mb-3">بازگشت به مدیریت</router-link>
    <h1 class="h4">محاسبات کارکرد مشاوران</h1>
    <p>تمام مبالغ به تومان است. مالیات در انتظار تعیین است.</p>
    <form class="row align-items-end" @submit.prevent="load">
      <div class="col-md-2"><label for="accounting-start">از تاریخ میلادی</label><input id="accounting-start" type="date" class="form-control" v-model="filters.start"></div>
      <div class="col-md-2"><label for="accounting-end">تا تاریخ میلادی</label><input id="accounting-end" type="date" class="form-control" v-model="filters.end"></div>
      <div class="col-md-3"><label for="accounting-search">نام، نام خانوادگی یا تماس</label><input id="accounting-search" class="form-control" v-model="filters.search"></div>
      <div class="col-md-3"><label for="accounting-consultant">مشاور</label><select id="accounting-consultant" class="form-control" v-model="filters.consultant"><option value="">همه مشاوران</option><option v-for="row in consultants" :key="row.user_id" :value="row.user_id">{{ row.first_name }} {{ row.last_name }} — {{ row.phone }}</option></select></div>
      <div class="col-md-2"><button class="btn btn-primary mt-2" :disabled="loading">نمایش گزارش</button></div>
    </form>
    <p v-if="error" role="alert" class="alert alert-danger mt-3">{{ error }}</p>
    <p v-if="loading" role="status" class="mt-3">در حال دریافت گزارش…</p>
    <template v-if="report && !loading && !error">
      <div class="my-3">تعداد مشاوران {{ rows.length }} | مجموع کارکرد {{ money(report.totals.gross_earnings) }} | مجموع مانده {{ money(report.totals.balance) }}</div>
      <section class="border rounded p-3 mb-3" aria-label="گزارش‌های مالی">
        <h2 class="h5">گزارش‌های مالی</h2>
        <label for="accounting-report-type">نوع گزارش</label>
        <select id="accounting-report-type" class="form-control mb-2" v-model="reportType" :disabled="reportBusy" @change="detailedReport = null">
          <option value="performance">کارکرد تماس و پیام</option><option value="deductions">مالیات و کسورات</option>
          <option value="payments">پرداخت‌ها و کسورات ثبت‌شده</option><option value="balances">مانده بدهی به مشاوران</option>
          <option value="settlements">اسناد تسویه و برگشت</option>
        </select>
        <p>گزارش با فیلترهای آخرین گزارش نمایش‌داده‌شده تهیه می‌شود. خروجی‌ها داده‌های لحظه تهیه را دارند.</p>
        <button class="btn btn-outline-primary" :disabled="reportBusy" @click="loadDetailedReport">نمایش گزارش تفصیلی</button>
        <button class="btn btn-outline-success mr-2" :disabled="!detailedReport || reportBusy" @click="exportReport('xlsx')">دریافت Excel</button>
        <button class="btn btn-outline-secondary mr-2" :disabled="!detailedReport || reportBusy" @click="exportReport('print')">چاپ و ذخیره PDF</button>
        <p v-if="reportError" role="alert" class="text-danger mt-2">{{ reportError }}</p>
        <p v-if="reportBusy" role="status">در حال تهیه گزارش…</p>
        <template v-if="detailedReport">
          <h3 class="h6 mt-3">{{ detailedReport.title }}</h3>
          <p>{{ detailedReport.filter_description }} | بازه {{ detailedReport.start || 'ابتدای سوابق' }} تا {{ detailedReport.end || 'آخرین سوابق' }}</p>
          <p>{{ detailedReport.note }}</p>
          <div v-for="item in detailedReport.summary" :key="item.label">{{ item.label }} {{ money(item.amount) }} تومان</div>
          <div class="table-responsive mt-2"><table class="table table-bordered text-nowrap">
            <thead><tr><th v-for="column in detailedReport.columns" :key="column.key">{{ column.label }}</th></tr></thead>
            <tbody><tr v-for="(row, index) in detailedReport.rows" :key="index"><td v-for="column in detailedReport.columns" :key="column.key">{{ row[column.key] === null || row[column.key] === '' ? '—' : column.numeric ? money(row[column.key]) : row[column.key] }}</td></tr>
              <tr v-if="!detailedReport.rows.length"><td :colspan="detailedReport.columns.length">رکوردی یافت نشد.</td></tr>
            </tbody>
          </table></div>
        </template>
      </section>
      <div class="my-3">تعداد انتخاب {{ selected.length }} | جمع مانده مثبت انتخاب‌شده {{ money(selectedTotal) }}</div>
      <section class="border rounded p-3 mb-3" aria-label="ثبت پرداخت واقعی">
        <h2 class="h5">تأیید واریز واقعی</h2>
        <div v-for="row in rows.filter(item => selected.includes(item.user_id))" :key="row.user_id" class="row mb-2">
          <label class="col-md-5" :for="'payment-' + row.user_id">{{ row.first_name }} {{ row.last_name }} — مبلغ پرداخت‌شده به تومان</label>
          <div class="col-md-4"><input :id="'payment-' + row.user_id" class="form-control" type="number" min="1" max="2147483647" step="1" v-model="paymentAmounts[row.user_id]" :disabled="settlementBusy || !!pendingConfirmation" @input="settlementPreview = null"></div>
        </div>
        <button class="btn btn-outline-success" :disabled="!selected.length || settlementBusy || !!pendingConfirmation" @click="previewSettlement">بازبینی مبالغ پرداخت</button>
        <p v-if="settlementError" role="alert" class="text-danger mt-2">{{ settlementError }}</p>
        <div v-if="settlementPreview" class="mt-3">
          <ul><li v-for="row in settlementPreview.rows" :key="row.user_id">{{ row.first_name }} {{ row.last_name }} — {{ row.iban }} — {{ money(row.amount_toman) }} تومان</li></ul>
          <p>جمع پرداخت {{ money(settlementPreview.total_toman) }} تومان</p>
          <label for="settlement-reference">مرجع یکتای واریز بانکی (حروف انگلیسی و اعداد)</label>
          <input id="settlement-reference" class="form-control mb-2" v-model="bankReference" :disabled="settlementBusy || !!pendingConfirmation">
          <label for="settlement-paid-at">تاریخ و ساعت واقعی واریز به وقت دستگاه</label>
          <input id="settlement-paid-at" type="datetime-local" class="form-control mb-2" v-model="paidAt" :disabled="settlementBusy || !!pendingConfirmation">
          <label><input type="checkbox" v-model="transferCompleted" :disabled="settlementBusy || !!pendingConfirmation"> واریز بانکی برای تمام افراد این فهرست انجام شده و مبالغ را تأیید می‌کنم.</label>
          <div><button class="btn btn-success" :disabled="settlementBusy || !transferCompleted || !bankReference || !paidAt" @click="confirmSettlement">{{ pendingConfirmation ? 'پیگیری همان درخواست پرداخت' : 'تأیید نهایی و ثبت اسناد پرداخت' }}</button></div>
        </div>
      </section>
      <p v-if="settlementReceipt" class="alert alert-success" role="status">سند گروه {{ settlementReceipt.id }} با مرجع {{ settlementReceipt.bank_reference }} ثبت شد.</p>
      <button class="btn btn-outline-primary mb-3" :disabled="!selected.length || bankLoading" @click="previewBank">پیش‌نمایش فایل پارسیان</button>
      <p v-if="bankError" role="alert" class="alert alert-danger">{{ bankError }}</p>
      <section v-if="bankPreview" class="border rounded p-3 mb-3" aria-label="پیش‌نمایش بانکی">
        <h2 class="h5">پیش‌نمایش فایل پارسیان</h2>
        <p>تعداد معتبر {{ bankPreview.rows.length }} | مجموع {{ money(bankPreview.total_rial) }} ریال</p>
        <p>مبلغ فایل با مانده فعلی حساب کنترل شده است. دانلود فایل را پس از بازبینی فهرست انجام دهید.</p>
        <ul><li v-for="row in bankPreview.rows" :key="row.user_id">{{ row.first_name }} {{ row.last_name }} — <span dir="ltr">{{ row.iban }}</span> — {{ money(row.amount_rial) }} ریال</li></ul>
        <div v-for="row in bankPreview.excluded" :key="row.user_id" class="text-danger">{{ row.first_name }} {{ row.last_name }} (شناسه {{ row.user_id }}) — {{ row.errors.join(' / ') }}</div>
        <button class="btn btn-primary mt-2" :disabled="!bankPreview.token || bankLoading" @click="downloadBank">دانلود TXT با مجموع نمایش‌داده‌شده</button>
      </section>
      <p class="small">مانده برابر مانده انتقالی + کارکرد دوره − پرداخت دوره است. کسورات شامل پرداخت‌های w تا پایان بازه است. وضعیت پرداخت بر اساس مانده حساب محاسبه می‌شود.</p>
      <div class="table-responsive">
        <table class="table table-bordered table-striped text-nowrap">
          <thead>
            <tr>
              <th scope="col"><input type="checkbox" aria-label="انتخاب همه نتایج" :checked="rows.length > 0 && selected.length === rows.length" :disabled="!rows.length" @change="selectAll($event.target.checked)"></th>
              <th v-for="column in columns" :key="column.key" scope="col" class="accounting-sort-header" :aria-sort="sortKey === column.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'">
                <button type="button" class="accounting-sort-button" :class="{ 'is-active': sortKey === column.key }" :aria-label="'مرتب‌سازی ' + column.label + (sortKey === column.key && sortDirection === 'asc' ? ' به صورت نزولی' : ' به صورت صعودی')" @click="sortColumn(column.key)">
                  <span>{{ column.label }}</span>
                  <span class="accounting-sort-arrows" aria-hidden="true">
                    <span class="accounting-sort-arrow is-up" :class="{ 'is-active': sortKey === column.key && sortDirection === 'asc' }"></span>
                    <span class="accounting-sort-arrow is-down" :class="{ 'is-active': sortKey === column.key && sortDirection === 'desc' }"></span>
                  </span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody><tr v-for="row in sortedRows" :key="row.user_id"><td><input type="checkbox" v-model="selected" :value="row.user_id" :aria-label="'انتخاب ' + row.first_name + ' ' + row.last_name"></td><td v-for="column in columns" :key="column.key"><template v-if="column.money">{{ row[column.key] === null ? '—' : money(row[column.key]) }}</template><template v-else-if="column.key === 'settlement_status'">{{ statuses[row.settlement_status] }}</template><template v-else-if="column.key === 'iban'">{{ row.iban_ambiguous ? 'چند شبای متفاوت' : row.iban || 'ثبت نشده' }}</template><template v-else>{{ row[column.key] || '—' }}</template></td></tr>
          <tr v-if="!rows.length"><td :colspan="columns.length + 1">مشاوری یافت نشد.</td></tr></tbody>
        </table>
      </div>
    </template>
    <section class="mt-4" v-if="history || historyError">
      <h2 class="h5">اسناد پرداخت و برگشت</h2>
      <p v-if="historyError" role="alert" class="text-danger">{{ historyError }}</p>
      <div v-for="batch in history ? history.results : []" :key="batch.id" class="border rounded p-3 mb-2">
        <div>سند گروه {{ batch.id }} — مرجع {{ batch.bank_reference }} — مدیر {{ batch.confirmed_by }} — زمان واریز {{ formatDate(batch.paid_at) }}</div>
        <div v-for="payment in batch.payments" :key="payment.id">سند {{ payment.id }} — مشاور {{ payment.user_id }} — {{ money(payment.amount_toman) }} تومان — {{ payment.reverses ? 'برگشت سند ' + payment.reverses : 'پرداخت' }}
          <button v-if="!payment.reverses" class="btn btn-sm btn-outline-danger mr-2" :disabled="settlementBusy || !!pendingConfirmation" @click="openReversal(payment)">ثبت سند برگشت</button>
        </div>
      </div>
      <button v-if="history && history.previous" class="btn btn-light" @click="loadHistory(historyPage - 1)">صفحه قبل</button>
      <button v-if="history && history.next" class="btn btn-light" @click="loadHistory(historyPage + 1)">صفحه بعد</button>
      <form v-if="reversal" @submit.prevent="submitReversal" class="border p-3 mt-3">
        <h3 class="h6">برگشت کامل سند {{ reversal.payment.id }}</h3>
        <label for="reversal-reason">دلیل اصلاح</label><input id="reversal-reason" class="form-control" v-model="reversal.reason" required maxlength="500" :disabled="settlementBusy || !!reversal.pendingPayload">
        <label for="reversal-reference">مرجع یکتای سند برگشت</label><input id="reversal-reference" class="form-control" v-model="reversal.bank_reference" required :disabled="settlementBusy || !!reversal.pendingPayload">
        <label for="reversal-date">تاریخ و ساعت واقعی رویداد به وقت دستگاه</label><input id="reversal-date" class="form-control" type="datetime-local" v-model="reversal.paid_at" required :disabled="settlementBusy || !!reversal.pendingPayload">
        <label><input type="checkbox" v-model="reversal.confirmed" :disabled="settlementBusy || !!reversal.pendingPayload"> بازگرداندن مبلغ این سند به مانده مشاور را تأیید می‌کنم.</label>
        <div><button class="btn btn-danger" :disabled="settlementBusy || !reversal.confirmed">ثبت سند برگشت مستقل</button></div>
      </form>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
const accountingCollator = new Intl.Collator('fa-IR', { numeric: true, sensitivity: 'base' })
export default {
  name: 'AdminAccounting',
  data() {
    return {
      loading: false, error: '', report: null, consultants: [], selected: [],
      sortKey: '', sortDirection: 'asc',
      reportFilters: {}, reportRevision: 0, bankPreview: null, bankLoading: false, bankError: '',
      paymentAmounts: {}, settlementPreview: null, settlementBusy: false, settlementError: '',
      bankReference: '', paidAt: '', transferCompleted: false, pendingConfirmation: null,
      settlementReceipt: null, history: null, historyPage: 1, historyError: '', reversal: null,
      reportType: 'performance', detailedReport: null, detailedFilters: {}, reportBusy: false, reportError: '',
      filters: { start: '', end: '', search: '', consultant: '' },
      statuses: { settled: 'مانده تسویه‌شده', partial: 'پرداخت جزئی', unpaid: 'دارای مانده' },
      columns: [
        { key: 'first_name', label: 'نام' }, { key: 'last_name', label: 'نام خانوادگی' },
        { key: 'phone', label: 'شماره تماس' }, { key: 'iban', label: 'شماره شبا' },
        { key: 'call_share', label: 'کارکرد تماس', money: true },
        { key: 'message_share', label: 'کارکرد پیام', money: true },
        { key: 'previous_payments', label: 'واریزی قبل از دوره', money: true },
        { key: 'tax', label: 'مالیات', money: true },
        { key: 'gross_earnings', label: 'کارکرد ناخالص', money: true },
        { key: 'deductions', label: 'کسورات تا پایان دوره', money: true },
        { key: 'opening_balance', label: 'مانده انتقالی', money: true },
        { key: 'payable', label: 'قابل پرداخت پیش از پرداخت دوره', money: true },
        { key: 'paid_in_period', label: 'پرداخت‌شده در دوره', money: true },
        { key: 'balance', label: 'مانده قابل تسویه', money: true },
        { key: 'settlement_status', label: 'وضعیت پرداخت' }
      ]
    }
  },
  computed: {
    rows() { return this.report ? this.report.results : [] },
    sortedRows() {
      const column = this.columns.find(column => column.key === this.sortKey)
      if (!column) return this.rows
      const direction = this.sortDirection === 'asc' ? 1 : -1
      return [...this.rows].sort((left, right) => {
        const leftValue = this.sortValue(left, column)
        const rightValue = this.sortValue(right, column)
        if (leftValue === null && rightValue === null) return 0
        if (leftValue === null) return 1
        if (rightValue === null) return -1
        const comparison = column.money
          ? leftValue - rightValue
          : accountingCollator.compare(leftValue, rightValue)
        return comparison * direction
      })
    },
    selectedTotal() { return this.rows.filter(row => this.selected.includes(row.user_id)).reduce((sum, row) => sum + Math.max(row.balance, 0), 0) }
  },
  mounted() {
    this.$store.state.filter = false
    this.$store.state.runAnimation = false
    this.load(true)
    this.loadHistory()
  },
  watch: {
    selected: { deep: true, handler() {
      this.bankPreview = null
      this.bankError = ''
      if (!this.pendingConfirmation) this.settlementPreview = null
      this.paymentAmounts = Object.fromEntries(this.selected.map(id => [id, this.paymentAmounts[id] || Math.max(this.rows.find(row => row.user_id === id).balance, 0)]))
    } }
  },
  methods: {
    sortColumn(key) {
      this.sortDirection = this.sortKey === key && this.sortDirection === 'asc' ? 'desc' : 'asc'
      this.sortKey = key
    },
    sortValue(row, column) {
      let value = row[column.key]
      if (column.key === 'settlement_status') value = this.statuses[value]
      if (column.key === 'iban' && row.iban_ambiguous) value = 'چند شبای متفاوت'
      if (value === null || value === undefined || String(value).trim() === '') return null
      if (column.money) return Number.isFinite(Number(value)) ? Number(value) : null
      return String(value).trim()
    },
    async loadDetailedReport() {
      this.reportBusy = true
      this.reportError = ''
      this.detailedReport = null
      const report = this.report
      const revision = this.reportRevision
      const params = { ...this.reportFilters, report_type: this.reportType }
      try {
        const response = await axios.get('admin-accounting/reports/', { params })
        if (this.report === report && this.reportRevision === revision) {
          this.detailedReport = response.data
          this.detailedFilters = params
        }
      } catch (error) { this.reportError = 'دریافت گزارش تفصیلی ناموفق بود.' }
      finally { this.reportBusy = false }
    },
    async exportReport(fileType) {
      this.reportBusy = true
      this.reportError = ''
      try {
        const response = await axios.get('admin-accounting/reports/export/', {
          params: { ...this.detailedFilters, file_type: fileType }, responseType: fileType === 'xlsx' ? 'blob' : 'json'
        })
        const data = fileType === 'xlsx' ? response.data : new Blob([response.data.html], { type: 'text/html;charset=utf-8' })
        const url = URL.createObjectURL(data)
        if (fileType === 'xlsx') {
          const link = document.createElement('a')
          link.href = url
          link.download = `consultant-${this.detailedFilters.report_type}.xlsx`
          document.body.appendChild(link)
          link.click()
          link.remove()
          setTimeout(() => URL.revokeObjectURL(url), 1000)
        } else {
          const frame = document.createElement('iframe')
          frame.title = 'چاپ گزارش مالی'
          frame.setAttribute('sandbox', 'allow-same-origin allow-modals')
          frame.style.cssText = 'position:fixed;left:-10000px;top:0;width:1200px;height:800px;'
          frame.onload = () => {
            try {
              frame.contentWindow.focus()
              frame.contentWindow.print()
            } catch (error) { this.reportError = 'مرورگر اجازه چاپ نداد. تنظیمات چاپ مرورگر را بررسی کنید.' }
          }
          frame.src = url
          document.body.appendChild(frame)
          setTimeout(() => { frame.remove(); URL.revokeObjectURL(url) }, 120000)
        }
      } catch (error) { this.reportError = 'تهیه خروجی ناموفق بود. گزارش را تازه کنید و دوباره تلاش کنید.' }
      finally { this.reportBusy = false }
    },
    formatDate(value) { return new Date(value).toLocaleString('fa-IR') },
    async loadHistory(page = 1) {
      try {
        const response = await axios.get('admin-accounting/settlements/', { params: { page }, timeout: 30000 })
        this.history = response.data
        this.historyPage = page
        this.historyError = ''
      } catch (error) { this.historyError = 'دریافت سوابق پرداخت ناموفق بود.' }
    },
    async previewSettlement() {
      this.settlementBusy = true
      this.settlementError = ''
      this.settlementPreview = null
      const selected = [...this.selected]
      const report = this.report
      const revision = this.reportRevision
      try {
        const payments = selected.map(id => ({ user_id: id, amount_toman: Number(this.paymentAmounts[id]) }))
        const response = await axios.post('admin-accounting/settlements/preview/', { ...this.reportFilters, payments })
        if (this.report === report && this.reportRevision === revision && JSON.stringify(selected) === JSON.stringify(this.selected)) {
          this.settlementPreview = response.data
          this.transferCompleted = false
        }
      } catch (error) { this.settlementError = 'پیش‌نمایش پرداخت ناموفق بود. مبلغ، مانده و شبای افراد انتخابی را بررسی کنید.' }
      finally { this.settlementBusy = false }
    },
    async confirmSettlement() {
      this.settlementBusy = true
      this.settlementError = ''
      if (!this.pendingConfirmation) {
        const date = new Date(this.paidAt)
        if (!Number.isFinite(date.getTime())) {
          this.settlementError = 'تاریخ و ساعت واریز معتبر نیست.'
          this.settlementBusy = false
          return
        }
        this.pendingConfirmation = { token: this.settlementPreview.token, bank_reference: this.bankReference,
          paid_at: date.toISOString(), bank_transfer_completed: this.transferCompleted }
      }
      try {
        const response = await axios.post('admin-accounting/settlements/confirm/', this.pendingConfirmation)
        this.settlementReceipt = response.data
        this.pendingConfirmation = null
        this.settlementPreview = null
        this.bankReference = ''
        this.paidAt = ''
        this.transferCompleted = false
        await this.load()
        await this.loadHistory()
      } catch (error) {
        this.settlementError = error.response && error.response.data.detail
          ? error.response.data.detail : 'نتیجه ثبت پرداخت مشخص نشد. با دکمه پیگیری، همان درخواست را دوباره بررسی کنید.'
        if (error.response && [400, 403, 409].includes(error.response.status)) {
          this.pendingConfirmation = null
          this.settlementPreview = null
        }
      } finally { this.settlementBusy = false }
    },
    openReversal(payment) {
      const bytes = crypto.getRandomValues(new Uint8Array(16))
      bytes[6] = (bytes[6] & 15) | 64
      bytes[8] = (bytes[8] & 63) | 128
      const hex = Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('')
      const requestId = [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join('-')
      this.reversal = { payment, request_id: requestId, reason: '', bank_reference: '', paid_at: '', confirmed: false, pendingPayload: null }
    },
    async submitReversal() {
      this.settlementBusy = true
      this.historyError = ''
      try {
        if (!this.reversal.pendingPayload) {
          this.reversal.pendingPayload = {
            request_id: this.reversal.request_id, reason: this.reversal.reason,
            bank_reference: this.reversal.bank_reference, paid_at: new Date(this.reversal.paid_at).toISOString(),
            correction_confirmed: this.reversal.confirmed
          }
        }
        const response = await axios.post(`admin-accounting/settlements/${this.reversal.payment.id}/reverse/`, this.reversal.pendingPayload)
        this.settlementReceipt = response.data
        this.reversal = null
        await this.load()
        await this.loadHistory()
      } catch (error) {
        this.historyError = 'ثبت یا پیگیری برگشت ناموفق بود. همان اطلاعات و شناسه را برای تلاش مجدد حفظ کنید.'
        if (error.response && [400, 403, 409].includes(error.response.status)) this.reversal.pendingPayload = null
      }
      finally { this.settlementBusy = false }
    },
    async previewBank() {
      this.bankLoading = true
      this.bankError = ''
      this.bankPreview = null
      const selected = [...this.selected]
      const report = this.report
      const revision = this.reportRevision
      try {
        const response = await axios.post('admin-accounting/bank/preview/', { ...this.reportFilters, selected })
        if (this.report === report && this.reportRevision === revision && JSON.stringify(selected) === JSON.stringify(this.selected)) {
          this.bankPreview = response.data
        }
      } catch (error) {
        this.bankError = 'دریافت پیش‌نمایش ناموفق بود. انتخاب‌ها و دسترسی خود را بررسی کنید.'
      } finally { this.bankLoading = false }
    },
    async downloadBank() {
      this.bankLoading = true
      this.bankError = ''
      try {
        const response = await axios.post('admin-accounting/bank/download/', { token: this.bankPreview.token }, { responseType: 'blob' })
        const url = URL.createObjectURL(response.data)
        const link = document.createElement('a')
        link.href = url
        link.download = 'parsian-consultants.txt'
        document.body.appendChild(link)
        link.click()
        link.remove()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      } catch (error) {
        this.bankError = 'دانلود ناموفق بود. ممکن است پیش‌نمایش منقضی شده یا مانده و اطلاعات بانکی تغییر کرده باشد. دوباره پیش‌نمایش بگیرید.'
        this.bankPreview = null
      } finally { this.bankLoading = false }
    },
    money(value) { return new Intl.NumberFormat('fa-IR').format(value) },
    selectAll(checked) { this.selected = checked ? this.rows.map(row => row.user_id) : [] },
    async load(initial = false) {
      this.error = ''
      if (this.filters.start && this.filters.end && this.filters.start > this.filters.end) {
        this.error = 'تاریخ پایان باید بعد از تاریخ شروع باشد.'
        return
      }
      this.loading = true
      const revision = ++this.reportRevision
      this.selected = []
      this.detailedReport = null
      try {
        const params = Object.fromEntries(Object.entries(this.filters).filter(([, value]) => value !== ''))
        const response = await axios.get('admin-accounting/report/', { params, timeout: 30000 })
        if (revision !== this.reportRevision) return
        this.report = response.data
        this.reportFilters = params
        if (initial === true) this.consultants = response.data.results
      } catch (error) {
        if (revision !== this.reportRevision) return
        this.error = error.response && [401, 403].includes(error.response.status) ? 'دسترسی به این بخش فقط برای مدیر مجاز است.' : 'دریافت گزارش ناموفق بود. دوباره تلاش کنید.'
      } finally { if (revision === this.reportRevision) this.loading = false }
    }
  }
}
</script>

<style scoped>
.table th.accounting-sort-header {
  padding: 0;
  vertical-align: middle;
  background: #f7f7fa;
}

.accounting-sort-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  min-height: 44px;
  padding: 0.75rem;
  border: 0;
  background: transparent;
  color: #343a40;
  font: inherit;
  font-weight: 600;
  text-align: right;
  cursor: pointer;
}

.accounting-sort-button:hover,
.accounting-sort-button.is-active {
  background: #eee6f5;
  color: #3c0b64;
}

.accounting-sort-button:focus-visible {
  outline: 2px solid #754699;
  outline-offset: -3px;
}

.accounting-sort-arrows {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 4px;
}

.accounting-sort-arrow {
  width: 0;
  height: 0;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
}

.accounting-sort-arrow.is-up {
  border-bottom: 5px solid #adb5bd;
}

.accounting-sort-arrow.is-down {
  border-top: 5px solid #adb5bd;
}

.accounting-sort-arrow.is-up.is-active {
  border-bottom-color: #3c0b64;
}

.accounting-sort-arrow.is-down.is-active {
  border-top-color: #3c0b64;
}

/* App.vue's legacy loader styles target every td; restore real table cells here. */
.table td {
  display: table-cell;
  position: static;
  top: auto;
  left: auto;
  width: auto;
  height: auto;
  transform: none;
  animation: none;
}

.table td::before {
  display: none;
  content: none;
}
</style>
