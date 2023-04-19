<template>
  <div class="TransactionCreate pt-lg-5">
    <div class="container">
        <div class="card rounded">
            <div class="card-header">
                <h6 class="text-right mb-3">شماره موبایل کاربر : {{user.username}}</h6>
                <h6 class="text-right">اعتبار فعلی شما : {{formatMoney(price)}}</h6>
            </div>

            <div class="row p-2 m-1 ">
                <div class="col-12 py-4 pb-lg-0 redu20 text-dark">
                    {{msg}}
                    <div v-if="!submit" class="col-lg-4 mx-auto">
                        ...در حال انتقال به درگاه پرداخت
                        <div class="text-muted mt-1">درصورت بروز خطا در انتقال با پشتیبانی تماس بگیرید</div>
                    </div>
                </div>

                <div class="col-12 px-lg-5">
                    <div class="row">
                        <div class="col-md-6 col-lg-4 mt-4">
                            <div class="card rounded">
                                <h5 class="card-header text-secondary">شارژ کیف پول</h5>
                                <h6 class="text-info pt-4 mt-2">مبلغ قابل پرداخت</h6>
                                <h5 class="py-4">۲۵,۰۰۰تومان</h5>
                                <button class="btn btn-success" v-if="this.amount == 250000" @click="Transaction()">پرداخت</button>
                                <button class="btn btn-primary" v-else @click="this.amount = 250000">اتخاب بسته</button>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-4 mt-4">
                            <div class="card rounded">
                                <h5 class="card-header text-secondary">شارژ کیف پول</h5>
                                <h6 class="text-info pt-4 mt-2">مبلغ قابل پرداخت</h6>
                                <h5 class="py-4">۵۰,۰۰۰تومان</h5>
                                <button class="btn btn-success" v-if="this.amount == 500000" @click="Transaction()">پرداخت</button>
                                <button class="btn btn-primary" v-else @click="this.amount = 500000">اتخاب بسته</button>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-4 mt-4">
                            <div class="card rounded">
                                <h5 class="card-header text-secondary">شارژ کیف پول</h5>
                                <h6 class="text-info pt-4 mt-2">مبلغ قابل پرداخت</h6>
                                <h5 class="py-4">۱۰۰,۰۰۰تومان</h5>
                                <button class="btn btn-success" v-if="this.amount == 1000000" @click="Transaction()">پرداخت</button>
                                <button class="btn btn-primary" v-else @click="this.amount = 1000000">اتخاب بسته</button>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-4 mt-4">
                            <div class="card rounded">
                                <h5 class="card-header text-secondary">شارژ کیف پول</h5>
                                <h6 class="text-info pt-4 mt-2">مبلغ قابل پرداخت</h6>
                                <h5 class="py-4">۲۰۰,۰۰۰تومان</h5>
                                <button class="btn btn-success" v-if="this.amount == 2000000" @click="Transaction()">پرداخت</button>
                                <button class="btn btn-primary" v-else @click="this.amount = 2000000">اتخاب بسته</button>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-4 mt-4">
                            <div class="card rounded">
                                <h5 class="card-header text-secondary">شارژ کیف پول</h5>
                                <h6 class="text-info pt-4 mt-2">مبلغ قابل پرداخت</h6>
                                <h5 class="py-4">۵۰۰,۰۰۰تومان</h5>
                                <button class="btn btn-success" v-if="this.amount == 5000000" @click="Transaction()">پرداخت</button>
                                <button class="btn btn-primary" v-else @click="this.amount = 5000000">اتخاب بسته</button>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-4 mt-4">
                            <div class="card rounded">
                                <h5 class="card-header text-secondary">شارژ کیف پول</h5>
                                <h6 class="text-info mt-4">مبلغ قابل پرداخت</h6>
                                <h5 class="py-4">۱,۰۰۰,۰۰۰تومان</h5>
                                <button class="btn btn-success" v-if="this.amount == 10000000" @click="Transaction()">پرداخت</button>
                                <button class="btn btn-primary" v-else @click="this.amount = 10000000">اتخاب بسته</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'TransactionCreate',
    data () {
        return { 
            user: {},
            msg: '',
            amount: null,
            price: 10,
            submit: true,
        }
    },
    mounted() {
        this.$store.state.filter = false

        axios.get('/api/auth/users/me/')
        .then(response => this.user = response.data)
        .catch(e => {
            console.log(e)
            this.$store.commit("logout")
            this.$router.push("/login")
        })
        .finally(() => this.$store.state.runAnimation = false )

        this.price = localStorage.getItem("amount")
    },methods: {
        Transaction() {
            if ( !this.amount || this.amount < 9999 ) {
                this.msg    = "حداقل مبلغ 10000 تومان میباشد"
            } else {
                this.msg    = ''
                this.submit = false
                axios.post("transaction/", {userId: this.user.id, amount: this.amount, authorLink: '/dashboard'})
                .then(response => {
                    if (response.data.id) {
                        this.paymentCreate(response.data.id)
                    }
                }).catch(e => {console.log(e.response.status, e.response.data), alert('مشگل در ارسال اطلاعات')})
            }
        },
        formatMoney(number) {
            let money = (number / 10).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            if (money.length > 0) {
               return `تومان ${money.substr(1,money.length-4)}`
            }
        },
        paymentCreate(order_id) {
            // axios.post("/payment_create/", {order_id: order_id})
            axios.post("/gateway/parspal/create/link/", {order_id: order_id})
            .then(response => {
                if (response.data.link) {
                    window.location.href = response.data.link
                }
            }).catch(e => {
                console.log(e.response.status, e.response.data.msg);
                if (e.response.data.msg==='مشگل ناشناخته') {
                    this.paymentCreate(order_id)
                } else {
                    alert('مشگل در ارتباط با سامانه دوباره لطفا امتحان کنید');
                    location.reload();
                }
            })
        }
    },
}
</script>


