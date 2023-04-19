<template>
  <div class="Transaction container pt-lg-5">
    <div class="bg-white p-3 rounded border">
      <div class="col-12 d-none d-lg-block text-right mb-4">
        <router-link to="/dashboard" class="btn btn-danger"><i class="fa fa-close"></i></router-link>
      </div>

      <div class="px-2 px-4 text-right" v-if="transaction.length">
        <div class="row">
          <div class="col border p-1 p-lg-2">مبلغ</div>
          <div class="col border p-1 p-lg-2">تاریخ</div>
        </div>
        <div v-for="t in transaction" :key="t.id" class="row">
          <div class="col border p-1 p-lg-2" >{{formatMoney(t.amount)}}</div>
          <div class="col border p-1 p-lg-2" >{{t.jpublish}}</div>
        </div>
      </div>
      <div v-else class="text-danger h6">موردی یافت نشد</div>

    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'TransactionPage',
  components: {
  },
  data() {
    return {
        transaction: {},
    }
  },
  methods: {
    formatMoney(number) {
        let money = (number / 10).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        if (money.length > 0) {
            return `تومان ${money.substr(1,money.length-4)}`
        }
    },
    gatway(link) {
      window.location.href = link
    }
  },
  mounted() {
    this.$store.state.filter = false

    axios.get(`/transaction/?userId=${JSON.parse(localStorage.getItem("userId"))}`)
      .then(response => this.transaction = response.data.results)
      .catch(e => console.log(e.response.data.status))
      .finally(() => this.$store.state.runAnimation = false )

  },
}
</script>
