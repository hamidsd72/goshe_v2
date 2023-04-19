<template>
  <div class="CallLog container mt-5">
    <div class="bg-white p-lg-3 rounded border">
      <div class="col-12 d-none d-lg-block text-right mb-4">
        <router-link to="/dashboard" class="btn btn-danger"><i class="fa fa-close"></i></router-link>
      </div>
      
      <div class="px-3 text-right" v-if="callLog.length">
        <div class="row">
          <!-- <div class="col border p-1 p-lg-2">شناسه تماس | عملیات</div> -->
          <div class="col border p-1 p-lg-2">شناسه تماس</div>
          <div class="col border p-1 p-lg-2">وضعیت</div>
          <div class="col border p-1 p-lg-2">مبلغ</div>
          <div class="col-4 col-lg border p-1 p-lg-2">تاریخ</div>
        </div>
        <div v-for="t in callLog" :key="t.id" class="row">
          <div class="col border p-1 p-lg-2" >
            <div v-if="t.authorId===user.id">
              <button v-if="in_blacklist(t.id)" class="btn btn-sm btn-secondary">مسدود شده {{t.id}}</button>
              <button v-else onclick="add_to_blacklist(t.id)" class="btn btn-sm btn-warning">مسدود کردن {{t.id}}</button>
            </div>
            <div v-else>{{t.id}}</div>
            <div>{{t.id}}</div>
          </div>
          <div class="col border p-1 p-lg-2" :class="t.authorId===user.id ? 'text-success': ''">
            {{t.authorId===user.id ? ' دریافتی ': ' گرفته شده '}}
            <div v-html="setStatus(t.type)"></div>
          </div>
          <div class="col border p-1 p-lg-2" >
            <div v-if="t.call_amount && t.call_amount > 9" class="col-lg mb-2">
              {{String(t.call_amount).substr(0, ( (String(t.call_amount).length)-1) )}}
            </div>
            <div v-else>________</div>
          </div>
          <div class="col-4 col-lg border p-1 p-lg-2" >{{t.jpublish}}</div>
        </div>
      </div>
      <div v-else class="text-danger h6">موردی یافت نشد</div>

    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CallLog',
  components: {
  },
  data() {
    return {
        callLog: {},
        user: null,
    }
  },
  mounted() {
    this.$store.state.filter = false

    axios.get('/api/auth/users/me/')
      .then(response => {
          this.user = response.data

          axios.get('callLog-v2/')
            .then(response => this.callLog = response.data.results)
            .catch(e => console.log(e.response.data.status))
            .finally(() => this.$store.state.runAnimation = false )
            
        })
        .catch(e => console.log(e.response.data.status))
  },
  methods: {
    add_to_blacklist(id) {
      console.log(id)
    },
    in_blacklist(id) {
      return false;
    },
    setStatus(status) {
      switch (status) {
        case 'Customer : ANSWER ,  Consultant : ANSWER':
          return "<span class='text-success'>تماس موفق</span>";
          break;
        case 'Customer : ANSWER ,  Consultant : BUSY':
          return "<span class='text-danger'>عدم پاسخ مشاور</span>";
          break;
        case 'Customer : ANSWER ,  Consultant : CANCEL':
          return "<span class='text-danger'>عدم پاسخ مشاور</span>";
          break;
        case 'Customer : ANSWER ,  Consultant : CONGESTION':
          return "<span class='text-danger'>عدم پاسخ مشاور</span>";
          break;
        case 'Customer : ANSWER ,  Consultant :':
          return "<span class='text-danger'>عدم پاسخ مشاور</span>";
          break;
        default:
          console.log(status)
          return "<span class='text-danger'>تماس ناموفق</span>";
          break;
      }
    }
  },
}
</script>
