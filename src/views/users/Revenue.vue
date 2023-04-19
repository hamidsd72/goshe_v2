<template>
    <div class="ticket container pt-lg-5">
        <div class="card text-center">
            <div class="card-header h6 font-weight-bold">بررسی درآمد من</div>
            <div class="card-body" v-if="this.access && author">

                <div v-if="author.userId" >
                    <img :src="author.userId.avatar" class="img-big-circle rounded-circle shadow" alt="گوش شنوا">
                    <div class="col-12 py-3">
                        {{String([author.userId.first_name,author.userId.last_name].join(" "))}}<div class="pt-2">{{author.shaba}} شبا</div>
                    </div>
                </div>

                <div class="row py-3 border-bottom">
                    <div class="col-lg mb-3">
                        <div class="bg-light border rounded p-3">
                            میزان درآمد مشاوره تلفنی
                            <h6 class="m-0 py-2">{{formatMoney(myCalls)}}</h6>
                        </div>
                    </div>
                    <div class="col-lg mb-3">
                        <div class="bg-light border rounded p-3">
                            میزان درآمد مشاوره متنی
                            <h6 class="m-0 py-2">{{formatMoney(myMessage)}}</h6>
                        </div>
                    </div>
                    <div class="col-lg mb-3">
                        <div class="bg-light border rounded p-3">
                            میزان دریافتی مشاور
                            <h6 class="m-0 py-2">{{formatMoney(myRevenue)}}</h6>
                        </div>
                    </div>
                    <div class="col-lg">
                        <div class="bg-light border rounded p-3">
                            مانده درآمد مشاور
                            <h6 class="m-0 py-2">{{formatMoney(sum)}}</h6>
                        </div>
                    </div>
                </div>

                <div class="col-12 py-3">
                    <label for="price">مبلغ را جهت برداشت از حساب وارد کنید</label>
                    <input type="number" class="form-control mb-3 mx-auto" style="max-width: 240px;" v-model="price" placeholder="مبلغ به تومان میباشد">
                    <p v-if="price">{{ formatMoney(price) }}</p>
                    <button @click="send" class="btn btn-primary">درخواست برداشت از حساب</button>
                </div>
                
            </div>
        </div>

    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'RevenuePage',
    data() {
        return {
            author: '',
            price: null,
            subject: 'درخواست برداشت',
            access: true,
            sum: 0,
            myCalls: 0,
            myMessage: 0,
            myRevenue: 0,
        }
    },
    mounted() {
        this.$store.state.filter = false
        axios.get('callAndMessageLog/')
        .then(response => {
            console.log(response.data, parseInt((response.data.myCalls * 50)  / 1000))
            if ( ((response.data.myCalls * 50)  / 1000) > 1) {
                this.myCalls = parseInt((response.data.myCalls / 1000) * 50)
            }
            if ( ((response.data.myMessage * 50) / 100) > 1) {
                this.myMessage = parseInt((response.data.myMessage / 100 ) * 50)
            }
            if (response.data.myRevenue ) {
                this.myRevenue = response.data.myRevenue
            }
            this.sum = this.myCalls + this.myMessage - this.myRevenue
            axios.get('/api/auth/users/me/')
            .then(response => {
                axios.get(`/userauthor/?userId=${response.data.id}`)
                .then(response => {
                    this.author = response.data.results[0]
                }).catch(e => console.table(e.response.data))
            }).catch(e => console.table(e.response.data))
        })
        .catch(e => console.table(e.response.data))
        .finally(() => this.$store.state.runAnimation = false )
    },
    methods: {
        send() {
            if (this.price===null || this.price  < 9999 ) {
                alert('حداقل مبلغ درخواستی ۱۰,۰۰۰ تومان میباشد')
            } else if ( this.price > (this.myCalls + this.myMessage) ) {
                alert('مبلغ درخواستی بیشتر از درآمدهای مشاور هست')
            } else {
                this.$store.state.runAnimation = true
                this.access = false
                axios.get('/api/auth/users/me/')
                .then(response => {
                    const fd = new FormData();
                    fd.append('userId', response.data.id,)
                    fd.append('subject', this.subject,)
                    fd.append('content', `لطفا مبلغ ${this.price} تومان را به شماره شبا ${this.author.shaba} واریز نمایید`,)
    
                    axios.post('ticket/', fd)
                    .then(response => {
                        console.log(response)
                        this.access = true
                        this.$router.push("/ticket")
                        // alert('درخواست شما به پشتیبانی ارسال شد, لطفا منتظر باشید')
                    }).catch(e => console.log(e.response.status, e.response.data) )
                    .finally(() => this.$store.state.runAnimation = false )
                })
            }
        },
        formatMoney(number) {
            if (number > 0) {
                return new Intl.NumberFormat('fa').format(number)+' تومان '
            }
        },
    },
}
</script>

