<template>
  <div class="admin container">

    <div v-if="access.is_superuser" class="mt-5 text-right text-dark ">
        <div v-if="item" class="card">

            <div v-if="item.userId" class="card-header">{{item.userId.id}} : شناسه کاربری</div>
            <div class="card-body row">
                <div class="col-lg-2"><img v-if="item.userId.avatar" :src="item.userId.avatar" :alt="item.id" class="img-big-circle"></div>
                <div class="col-lg mt-3 mt-lg-5">{{item.userId.username}} : شماره موبایل کاربر</div>
                <div class="col-lg mt-3 mt-lg-5">نام کامل : {{String([item.userId.first_name || 'بدون اسم' , item.userId.last_name || 'بدون فامیلی'].join(' '))}}</div>
            </div>

            <div class="card-header">
                <div class="row">
                    <div class="col-6"><input class="form-control" type="text" v-model="item.shaba"> : شماره شبا</div>
                    <div class="col-6"><input class="form-control" type="text" v-model="item.uid"> : شماره پروانه کسب</div>
                    <div class="col-6"><input class="form-control" type="text" v-model="item.call_price"> : قیمت هر پیام</div>
                    <div class="col-6"><input class="form-control" type="text" v-model="item.msg_price"> : قیمت هر دقیقه تماس</div>

                    <div class="col-12 mt-2 mb-2"><input class="form-control" type="text" v-model="item.older"> : بایوگرافی</div>

                    <div class="col-lg-3 col-6"><input class="form-control" type="text" v-model="item.oneDay"> : oneDay</div>
                    <div class="col-lg-3 col-6"><input class="form-control" type="text" v-model="item.twoDay"> : twoDay</div>
                    <div class="col-lg-3 col-6"><input class="form-control" type="text" v-model="item.treeDay"> : treeDay</div>
                    <div class="col-lg-3 col-6"><input class="form-control" type="text" v-model="item.fourDay"> : fourDay</div>
                    <div class="col-lg-3 col-6"><input class="form-control" type="text" v-model="item.fiveDay"> : fiveDay</div>
                    <div class="col-lg-3 col-6"><input class="form-control" type="text" v-model="item.sixDay"> : sixDay</div>
                    <div class="col-lg-3 col-12"><input class="form-control" type="text" v-model="item.sevenDay"> : sevenDay</div>

                    <div class="col-lg-3 col-12"><input class="form-control" type="text" v-model="item.visit_type"> : نوع ویزیت</div>
                    <div class="col-6 col-lg-3"><input class="form-control" type="checkbox" v-model="item.services"> :  سرویس مشاور</div>
                    <div class="col-6 col-lg-3 text-danger"><input class="form-control" type="checkbox" v-model="item.status"> : تایید مشاور</div>
                    <div class="col-lg-6 col-12 "><input class="form-control" type="text" v-model="item.certificate"> : مدرک</div>
                    <div class="col-12">
                    <div v-if="item.category" class="col-12">دسته ی فعالیت : {{String(categoreis(item.category))}}</div>
                    {{item.created_at}} : تاریخ ثبت
                    </div>
                    <div class="col-12">
                        <div class="row mt-1">
                            <div class="col text-left"><button @click="sendMsg('71212')" class="btn btn-danger mt-3 mb-2">پیام عدم تایید</button></div>
                            <div class="col text-center"><button @click="sendMsg('71211')" class="btn btn-success mt-3 mb-2">پیام تایید</button></div>
                            <div class="col"><button @click="update()" class="btn btn-info mt-3 mb-2">ویرایش مشاور</button></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div class="card">
            <div class="card-header h5">ایجاد تراکنش بازپرداخت</div>
            <div class="card-body row">
                <div class="col mt-4">
                    <button class="btn btn-primary mt-1" @click="sendPayback()">ارسال</button>
                </div>
                <div class="col-lg-4 col-8">
                    <label for="payback">مبلغ به لاتین</label>
                    <input type="number" class="form-control" name="payback" v-model="payback">
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header h5">شناسه مشاور {{item.id}}</div>
            <div v-if="logs" class="card-body row p-4">
                <div class="col-6 col-lg-4 mb-3">جمع مبلغ تماس های مشاور : {{formatMoney(parseInt(( logs.call / 1000) * 50 ))}}</div>
                <div class="col-6 col-lg-4 mb-3">جمع مبلغ پیام های مشاور : {{formatMoney(parseInt((logs.message / 100 ) * 50) || 0)}}</div>
                <div class="col-6 col-lg-4 mb-3">جمع مبلغ خرید های کاربر : {{formatMoney(logs.buy / 10)}}</div>
                <div class="col-6 col-lg-4">جمع مبلغ هدیه های سیستم به کاربر : {{formatMoney(logs.gift || 0)}}</div>
                <div class="col-6 col-lg-4 mb-3">جمع مبلغ پرداختی به مشاور : {{formatMoney(logs.revenue || 0)}}</div>
                <div class="col-6 col-lg-4 mb-3 text-success">مانده مبلغ مشاور : {{formatMoney((parseInt(( logs.call / 1000) * 50 ) + parseInt((logs.message / 100 ) * 50)) - (logs.revenue || 0))}}</div>
                <div class="col-12">
                    <div v-if="logs.list_call" class="row">
                        <div class="col-12 m-2">گزارش تماس ها</div>
                        <div class="col-3">
                            today : {{formatMoney(logs.list_call.today)}}
                        </div>
                        <div class="col-3">
                            week : {{formatMoney(logs.list_call.week)}}
                        </div>
                        <div class="col-3">
                            month : {{formatMoney(logs.list_call.month)}}
                        </div>
                        <div class="col-3">
                            year : {{formatMoney(logs.list_call.year)}}
                        </div>
                    </div>
                    <div v-if="logs.list_message" class="row">
                        <div class="col-12 m-2">گزارش پیام ها</div>
                        <div class="col-3">
                            today : {{formatMoney(logs.list_message.today)}}
                        </div>
                        <div class="col-3">
                            week : {{formatMoney(logs.list_message.week)}}
                        </div>
                        <div class="col-3">
                            month : {{formatMoney(logs.list_message.month)}}
                        </div>
                        <div class="col-3">
                            year : {{formatMoney(logs.list_message.year)}}
                        </div>
                    </div>
                </div>
            </div>

            <div class="card-header h5">تماس های مشاور</div>
            <div v-if="calls.length > 0" class="card-body p-4">
                <div v-for="call in calls" :key="call.id">
                    <div class="mb-3 row border">{{call}}</div>    
                </div>
            </div>

            <div class="card-header h5">پیام های مشاور</div>
            <div v-if="messages.length > 0" class="card-body p-4">
                <div v-for="message in messages" :key="message.id">
                    <div v-if="message.userId" class="mb-4 row border shadow">
                        <div class="col-lg">{{message.userId.username}}</div>
                        <div class="col-lg">{{String([message.userId.first_name,message.userId.last_name].join(' '))}}</div>
                        <div class="col-lg-12">{{message.content}}</div>
                        {{message}}    
                    </div>
                </div>
            </div>
        </div>
            
    </div>
    <div v-else class="col-lg-6 col-10 mx-auto mt-5 p-5 shadow redu20 bg-violet text-danger text-center">
      شما مجوز استفاده از این بخش را ندارید
    </div>
    
  </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'AdminPage',
    data () {
        return { 
            access: '',
            item: '',
            cat: '',
            payback: 0,
            btn: 'ارسال پاسخ',
            logs: '',
            calls: '',
            messages: '',
        }
    },
    mounted() {
        this.$store.state.filter = false
        axios.get('/api/auth/users/me/')
        .then(response => {
            axios.get(`/amount-user/${response.data.id}/`)
            .then(response => {
                this.access = response.data

                axios.get(`adminuserauthor/${this.$route.params.id}/`)
                .then(response => {
                    this.item = response.data
                    axios.get(`AdminShowUserCall?userId=${response.data.userId.id}`).then(response => this.calls = response.data.results ).catch(e => console.table(e.response.data))
                    axios.get(`AdminShowUserMessage?userId=${response.data.userId.id}`).then(response => this.messages = response.data.results ).catch(e => console.table(e.response.data))
                    axios.post('admincallAndMessageLog/', {userId: response.data.userId.id}).then(response => this.logs = response.data ).catch(e => console.table(e.response.data))
                })
                .catch(e => console.table(e.response.data))

                axios.get('/category/')
                .then(response => {
                    this.cat = response.data.results
                })
                .catch(e => console.table(e.response.data))
            })
            .catch(e => console.table(e.response.data))
        })
        .catch(e => console.table(e.response.data))
        .finally(() => this.$store.state.runAnimation = false )
    },
    methods: {
        categoreis(category) {
            let list = []
            for (let index = 0; index < this.cat.length; index++) {
                if ( category.includes(this.cat[index].id) ) {
                    list.push( this.cat[index].title )
                }
            }
            return list
        },
        update() {
            axios.patch(`adminauthor/${this.item.id}/`, {
                uid: this.item.uid,
                call_price: this.item.call_price,
                msg_price: this.item.msg_price,
                status: this.item.status,
                older: this.item.older,
                shaba: this.item.shaba,
                visit_type: this.item.visit_type,
                services: this.item.services,
                category: this.item.category,
                certificate: this.item.certificate,
                oneDay: this.item.oneDay,
                twoDay: this.item.twoDay,
                treeDay: this.item.treeDay,
                fourDay: this.item.fourDay,
                fiveDay: this.item.fiveDay,
                sixDay: this.item.sixDay,
                sevenDay: this.item.sevenDay,
            })
            .then(response => {
                console.log(response)
                alert('انجام شد برای اطمینان از تغییرات بارگذاری مجدد کنید')
            })
            .catch(e => {console.log(e.response.status, e.response.data), alert('مشگل در ارسال اطلاعات تخصص کاربر')})
        },
        sendMsg(bodyId) {
            axios.post('SendAdminMsgToUser/' , { bodyId: bodyId,username: this.item.userId.username,param: "" })
            .then(response => alert( response.data.msg,response.data.errors ) )
            .catch(e => console.table(e.response.data))
        },
        sendPayback() {
            axios.post('admin-transaction/', {userId: this.item.userId.id,type: 'w',amount: this.payback}).then(response => {
                console.log(response)
                axios.get(`adminuserauthor/${this.$route.params.id}/`).then(response => {
                    axios.post('admincallAndMessageLog/', {userId: response.data.userId.id}).then(response => this.logs = response.data )
                })
            })
        },
        formatMoney(number) {
            if (number > 0) {
                return new Intl.NumberFormat('fa').format(number)+' تومان '
            }
        },
    },
}
</script>