<template>
    <div class="Author col-lg-6 mx-auto mt-lg-5 m-3 pt-3 pb-3 p-lg-5 bg-white rounded text-dark">

        <h3 class="mb-5">تکمیل اطلاعات کاربری</h3>
        <div class="row text-right" v-if="!first">
            <div v-if="!this.user.avatar" class="col-lg btn btn-block btn-file mb-4" style="color: #3c0b64">
                <img :src="require('@/assets/edit.png')" class="my-img img-radius" alt="User-Profile-Image">
                <br>
                تصویر آواتار
                <input type="file" accept="image/*" @change="setAvatar($event)" >
            </div>

            <div class="col-lg-8">
                <div class="form-group">
                    <label for="last_name">نام خانوادگی کاربر</label>
                    <input type="text" class="form-control" v-model="this.user.last_name"> 
                </div>
                <div class="form-group">
                    <label for="first_name">نام کاربر</label>
                    <input type="text" class="form-control" v-model="this.user.first_name"> 
                </div>
                <div class="form-group">
                    <label for="codeMelly">کدملی کاربر</label>
                    <input type="text" class="form-control name text-left" v-model="this.user.codeMelly"> 
                </div>
            </div>

            <div v-if="error_user.length > 0" class="text-center text-danger col-12 mt-2"><div v-for="error in error_user" :key="error.id">{{error}}</div></div>
            <div class="col-12"><button @click="is_valid_user" class="btn btn-info mt-3">مرحله بعدی</button></div>
        </div>
        <div class="row" v-if="first && !second"> 
            <div class="form-group col-lg-6">
                <label for="category">دسته ی فعالیت</label>
                <select multiple class="form-control" v-model="category">
                    <option v-for="c in cat" :value="c.id" :key="c.id">{{c.title}}</option>
                </select>
            </div>
            <div class="form-group col-lg-6">
                <label for="uid">کد پروانه کسب <small class="text-">(میتونی بعدا وارد کنی)</small></label>
                <input type="text" class="form-control name" onpaste="return false;" placeholder="کد صنفی مشاور" v-model="uid" >
                <div class="d-none d-lg-block mt-4">
                    <label for="shaba">شماره کارت شبا <small class="text-">(میتونی بعدا وارد کنی)</small></label>
                    <input type="text" class="form-control name" onpaste="return false;" placeholder="شماره کارت شبا جهت تصویه" v-model="shaba" >
                </div>
            </div>
            <div class="form-group col-lg-6">
                <label for="certificate">مدرک تحصیلی</label>
                <input type="text" class="form-control" placeholder="مقطع تحصیلی + رشته تحصیلی" v-model="certificate"> 
            </div>
            <div class="form-group col-lg-6">
                <label for="visit_type">نوع ویزیت</label>
                <select class="form-control" v-model="visit_type" >
                    <option value="m">فقط پیام</option>
                    <option value="c">فقط تماس</option>
                    <option value="b">هردو حالت</option>
                </select>
            </div>
            <div class="form-group col name" v-if="visit_type!='m'">
                <label for="call_price">نرخ تماس</label>
                <input type="text" onpaste="return false;" class="form-control" placeholder="به زبان لاتین 1000" v-model="call_price">
                <small class="text-danger">مبلغ به لاتین</small>
            </div>
            <div class="form-group col name" v-if="visit_type!='c'">
                <label for="msg_price">نرخ پیام</label>
                <input type="text" onpaste="return false;" class="form-control" placeholder="به زبان لاتین 100" v-model="msg_price">
                <small class="text-danger">مبلغ به لاتین</small>
            </div>
            <div class="form-group col-12">
                <label for="older">بایوگرافی کوتاه</label>
                <textarea class="form-control" name="older" rows="3" v-model="older" ></textarea>
            </div>
            <div v-if="error_a.length > 0" class="text-center text-danger col-12 mt-2"><div v-for="error in error_a" :key="error.id">{{error}}</div></div>
            <div class="col-12">
                <div class="row">
                    <div class="col-auto"><button @click="this.level='first'" class="btn btn-info mt-3">مرحله قبلی</button></div>
                    <div class="col-auto"><button @click="is_valid_a" class="btn btn-info mt-3 ">مرحله بعدی</button></div>
                </div>
            </div>
        </div>
        <div class="row" v-if="first && second">
        
            <div class="col-12 h4">تنظیم ساعت کاری روزهای هفته<hr></div>
            <div class="col-12 text-right">

                <div class="mb-2">
                    <h5>شنبه ها</h5>
                    <input type="time" class="mr-2 ml-2 redu20 border border-info text-dark" name="onedaylast" v-model="onedaylast" > از ساعت
                    <input type="time" class="mr-2 mb-2 redu20 border border-info text-dark" name="onedayfirst" v-model="onedayfirst" > تا ساعت
                    <hr>
                </div>

                <div class="mb-2">
                    <h5>یکشنبه ها</h5>
                    <input type="time" class="mr-2 ml-2 redu20 border border-info text-dark" name="onedaylast" v-model="twodaylast" >از ساعت
                    <input type="time" class="mr-2 mb-2 redu20 border border-info text-dark" name="onedayfirst" v-model="twodayfirst" > تا ساعت
                    <hr>
                </div>

                <div class="mb-2">
                    <h5>دوشنبه ها</h5>
                    <input type="time" class="mr-2 ml-2 redu20 border border-info text-dark" name="onedaylast" v-model="treedaylast" > از ساعت
                    <input type="time" class="mr-2 mb-2 redu20 border border-info text-dark" name="onedayfirst" v-model="treedayfirst" > تا ساعت
                    <hr>
                </div>

                <div class="mb-2">
                    <h5>سه شنبه ها</h5>
                    <input type="time" class="mr-2 ml-2 redu20 border border-info text-dark" name="onedaylast" v-model="fourdaylast" > از ساعت
                    <input type="time" class="mr-2 mb-2 redu20 border border-info text-dark" name="onedayfirst" v-model="fourdayfirst" > تا ساعت
                    <hr>
                </div>

                <div class="mb-2">
                    <h5>چهارشنبه ها</h5>
                    <input type="time" class="mr-2 ml-2 redu20 border border-info text-dark" name="onedaylast" v-model="fivedaylast" > از ساعت
                    <input type="time" class="mr-2 mb-2 redu20 border border-info text-dark" name="onedayfirst" v-model="fivedayfirst" > تا ساعت
                    <hr>
                </div>

                <div class="mb-2">
                    <h5>پنج شنبه ها</h5>
                    <input type="time" class="mr-2 ml-2 redu20 border border-info text-dark" name="onedaylast" v-model="sixdaylast" > از ساعت
                    <input type="time" class="mr-2 mb-2 redu20 border border-info text-dark" name="onedayfirst" v-model="sixdayfirst" > تا ساعت
                    <hr>
                </div>

                <div class="mb-2">
                    <h4>جمعه ها</h4>
                    <input type="time" class="mr-2 ml-2 redu20 border border-info text-dark" name="onedaylast" v-model="sevendaylast" > از ساعت
                    <input type="time" class="mr-2 mb-2 redu20 border border-info text-dark" name="onedayfirst" v-model="sevendayfirst" > تا ساعت
                    <hr>
                </div>
            </div>

            <div class="col-auto"><button @click="this.level='second'" class="btn btn-info mt-3">مرحله قبلی</button></div>
            <div class="col-auto"><button @click="doAuthor()" class="btn btn-info mt-3">ثبت درخواست</button></div>
        </div>

    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'AuthorPage',
    data() {    
        return {
            anime: false,
            first: false,
            second: false,
            error_a: [],
            error_user: [],
            cat: [],

            user: '',
            avatar: '',

            uid: null,
            shaba: null,
            visit_type: 'b',
            call_price: 0,
            msg_price: 0,
            level: null,
            visits: null,
            older: "",
            certificate: null,
            category: [1],

            onedayfirst: '08:00',
            onedaylast: '08:01',
            twodayfirst: '08:00',
            twodaylast: '08:01',
            treedayfirst: '08:00',
            treedaylast: '08:01',
            fourdayfirst: '08:00',
            fourdaylast: '08:01',
            fivedayfirst: '08:00',
            fivedaylast: '08:01',
            sixdayfirst: '08:00',
            sixdaylast: '08:01',
            sevendayfirst: '08:00',
            sevendaylast: '08:01',
        }
    },
    methods: {
        setAvatar(event) {
            let file   = event.target.files[0]
            let custom = file.slice(0, file.size); 
            this.avatar = new File([custom], this.user.id+'-'+file.name);
        },
        is_valid_user() {
            let access = true
            this.error_user = []
            
            if ( this.user.codeMelly < 100000 ) {
                this.error_user.push("کدملی ۱۰ رقم میباشد")
                access = false
            }
            if ( !this.user.first_name || this.user.first_name.length < 2 ) {
                this.error_user.push("نام خانوادگی معتبر نیست")
                access = false
            }if ( !this.user.last_name || this.user.last_name.length < 2 ) {
                this.error_user.push("نام معتبر نیست")
                access = false
            }
            if (!this.user.avatar) {
                if (this.avatar == '') {
                    this.error_user.push("یک تصویر نمایه وارد کنید")
                    access = false
                }
            }
            this.anime = true
            if (access) {
                const fd = new FormData();
                fd.append('first_name', this.user.first_name,)
                fd.append('last_name', this.user.last_name,)
                fd.append('codeMelly', this.user.codeMelly,)
                if (this.avatar) {
                    fd.append('avatar', this.avatar, this.avatar.name)
                }

                axios.patch(`/my-user/${this.user.id}/`,fd)
                .then(response => {
                    this.anime = false
                    this.first = true
                    console.log(response.data)
                })
            }
            this.anime = false
        },
        is_valid_a() {
            let access = true
            this.error_a = []
            if ( this.category.length == 0 ) {
                this.error_a.push("* یک دسته بندی انتخاب کنید")
                access = false
            }
            if ( !this.certificate || this.certificate.length < 9 ) {
                this.error_a.push("* مدرک تحصیلی حداقل ۹ کاراکتر")
                access = false
            }
            if ( !this.call_price || this.call_price < 1999 ) {
                this.error_a.push("هزینه هر دقیقه تماس حداقل 2000 تومان")
                //  access = false
            }
            if ( !this.msg_price || this.msg_price < 49 ) {
                this.error_a.push("هزینه هر پیام حداقل 50 تومان")
                //  access = false
            }
            if ( !this.older || this.older.length < 50 ) {
                this.error_a.push("* متن بایوگرافی حداقل ۵۰ کاراکتر")
                access = false
            }
            if (access) {
                this.second = true
            }
        },
        doAuthor() {
            this.anime = true
            if ( !this.uid ) { this.uid = 123456789 }
            axios.get('/api/auth/users/me/')
            .then(response => {
                axios.post("/createauthor/", {
                    userId: response.data.id,
                    uid: this.uid,
                    shaba: this.shaba,
                    call_price: this.call_price,
                    msg_price: this.msg_price,
                    level: this.level,
                    visits: this.visits,
                    older: this.older,
                    visit_type: this.visit_type,
                    certificate: this.certificate,
                    category: this.category,
                    oneDay: `${this.onedayfirst},${this.onedaylast}`,
                    twoDay: `${this.twodayfirst},${this.twodaylast}`,
                    treeDay: `${this.treedayfirst},${this.treedaylast}`,
                    fourDay: `${this.fourdayfirst},${this.fourdaylast}`,
                    fiveDay: `${this.fivedayfirst},${this.fivedaylast}`,
                    sixDay: `${this.sixdayfirst},${this.sixdaylast}`,
                    sevenDay: `${this.sevendayfirst},${this.sevendaylast}`,
                    })
                    .then(response => {
                        console.log(response)
                        this.anime = false
                        alert('ثبت نام مشاور با موفقیت انجام شد در انتظار تایید ناظر')
                        this.$router.push("/dashboard")    
                    })
                    .catch(e => {console.log(e.response.status, e.response.data), alert('مشگل در ارسال اطلاعات کاربر')})
            })
        }
    },
    mounted() {
        // $(document).ready(function () {
        //     $('.name').keypress(function (e) {
        //         var regex = new RegExp("^[0-9۰-۹]+$");
        //         var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        //         if (regex.test(str)) {
        //             return true;
        //         }
        //         e.preventDefault();
        //         return false;
        //     }); 
        // })

        axios.get('/api/auth/users/me/').then(response => {

            axios.get(`/my-user/${response.data.id}/`).then(response => {
                this.user = response.data
                if (response.data.first_name && response.data.last_name && response.data.codeMelly && response.data.avatar) {
                    this.first = true
                }
            })
            axios.get(`/userauthor/?userId=${response.data.id}`).then(response => {
                if (response.data.length) { this.$router.push("/dashboard") }
            })
            axios.get('/category/').then(response => this.cat = response.data.results ).catch(e => console.log(e))
        })
        .catch(e => {
            console.log(e)
            this.$store.commit("logout"),this.$router.push("/login")
        })
        .finally(() => this.$store.state.runAnimation = false )
    }
}
</script>

<style scope>
    input {
        text-align: right;
    }
    select {
        text-align: right;
    }
    textarea {
        text-align: right;
    }
</style>

