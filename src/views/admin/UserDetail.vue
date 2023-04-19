<template>
  <div class="Dashboard mt-5 col-lg-8 mx-auto">
    <div class="row">
        <div class="col-12 text-center">
            <a href="#" @click="call(item.username)">تماس با کاربر</a><br>
            <img :src="item.avatar" :alt="item.username" class="img-circle">
        </div>
        <div class="col-lg-3 col-6">
                <div class="col-12">نام کوچک</div>
                <input type="text" class="form-control col" v-model="item.first_name">
        </div>
        <div class="col-lg-3 col-6">
                <div class="col-12">نام خانوادگی</div>
                <input type="text" class="form-control col" v-model="item.last_name">
        </div>
        <div class="col-lg-3 col-6 ">
            شماره موبایل
            <input type="text" class="form-control" v-model="item.username">
        </div>
        <div class="col-lg-3 col-6">
            تاریخ تولد
            <input type="text" class="form-control" v-model="item.birthDay">
        </div>
        <div class="col-lg-3 col-6">
            کدملی
            <input type="text" class="form-control" v-model="item.codeMelly">
        </div>
        <div class="col-lg-3 col-6">
            موجودی
            <input type="number" class="form-control" v-model="item.amount">
        </div>

        <div class="col-lg-3 col-6 ">
            شهر
            <input type="text" class="form-control" v-model="item.city">
        </div>
        <div class="col-lg-3 col-6 ">
            استان
            <input type="text" class="form-control" v-model="item.province">
        </div>
        <div class="col-lg-2 col-3 text-danger">
            سوپریوزر
            <input type="checkbox" class="form-control" v-model="item.is_superuser">
        </div>
        <div class="col-lg-10 col">
            آدرس
            <input type="text" class="form-control" v-model="item.address">
        </div>
        <div class="col-12 text-center mt-5">
          <button @click="doEdit" class="btn btn-success">ارسال تغییرات</button>
        </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AdminDashboardPage',
  data () {
    return { 
      item: {},
    }
  },
  mounted() {
    axios.get(`admin-user/${this.$route.params.id}/`)
    .then(response => this.item = response.data )
    .catch(e => console.table(e.response.data))
    .finally(() => this.$store.state.runAnimation = false )
  },
  methods: {
      call(number) {
        axios.get('/api/auth/users/me/')
        .then(response => {
          axios.post('/adminCallCreate/', {myMobile: String(response.data.username), username: String(number)})
          .then(response => {
            console.log(response.data)
            alert(response.data) 
          })
          .catch(e => alert(e.response.data) )
        })
        
      },
      doEdit() {
        axios.patch(`admin-user/${this.$route.params.id}/`, 
        {
            last_name: this.item.last_name,
            first_name: this.item.first_name,
            username: this.item.username,
            birthDay: this.item.birthDay,
            codeMelly: this.item.codeMelly,
            amount: this.item.amount,
            is_superuser: this.item.is_superuser,
            city: this.item.city,
            province: this.item.province,
            address: this.item.address
        })
        .then(response => {
            this.item = response.data
            alert('انجام شد')
        })
      }
  },
}
</script>
