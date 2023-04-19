<template>
    <div class="Register text-light">
        <div v-if="alert" class="alert alert-warning alert-dismissible fade show" role="alert">
            <a class="float-right h1" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></a> 
            <h6 class="violet text-center mt-2 ml-5">کد تایید به شماره ارسال شد</h6>
        </div>

        <div v-if="nextStep" class="d-lg-none shadow redu20 bg-violet p-5 m-3">
            <h6 class="mb-4">کد ارسال شده را وارد کنید</h6>
            <div class="mt-lg-4 mb-4">
                <div v-if="this.timer>=1" class="form-group">
                    <input type="text" class="form-control text-left name" :class="{'is-invalid':codeE===true}" placeholder="کد ۶ رقمی را وارد کنید" v-model="code">
                    <div class="text-danger" v-if="codeE">{{codeEM}}</div>
                </div>
                <button @click="doAuthor" v-if="this.timer>=1" class="btn btn-block btn-light" style="color:#3c0b64;">ورود کد</button>
            </div>
            <div v-if="this.timer>=1" class="h5">
                ...اعتبار کد تا
                <span v-if="this.timer>=11" class="text-light">{{timer}}</span>
                <span v-else-if="this.timer>=6" class="text-warning">{{timer}}</span>
                <span v-else class="text-danger">{{timer}}</span>
                ثانیه
            </div>
            <div v-else>
                <div class="mb-3">اگر کد را دریافت نکردید از روش های زیر استفاده کنید</div>
                <div class="row">
                    <div class="col text-left ">
                        <button v-if="alert" @click="resendCreateCode" class="btn btn-sm btn-light" style="color:#3c0b64;">ارسال مجدد کد</button>
                        <button v-else @click="resendCreateCode" class="btn btn-sm btn-light" style="color:#3c0b64;">در حال ارسال</button>
                    </div>
                    <div class="col text-right ">
                        <button v-if="calling" @click="callCreateCode" class="btn btn-sm btn-light" style="color:#3c0b64;">ارسال کد صوتی</button>
                        <button v-else class="btn btn-sm btn-light" style="color:#3c0b64;">در حال ارسال</button>
                    </div>
                </div>
            </div>
            <br>
        </div>
 
        <div class="col-xl-8 col-lg-10 mx-auto mt-lg-4 mb-lg-4">

            <div class="row m-2 pt-4 pb-4 pt-lg-5 pb-lg-5 shadow redu20 bg-text-dark">
            
                <div class="col-lg d-none d-lg-block pt-4 pb-4">
                    <img src="https://my.mihanwebhost.com/templates/mwh/images/pagesIcon/login-01-01.svg" class="img" alt="">
                </div>

                <div class="col-lg-7 mt-lg-4 pt-lg-4 pb-lg-4">

                    <div v-if="nextStep" class="col-12 col-lg-10 mx-auto d-none d-lg-block pt-5">
                        <h5 class=" mb-4">کد ارسال شده را وارد کنید</h5>
                        <div class="mt-lg-4 mb-4">
                            <div class="form-group " v-if="this.timer>=1">
                                <input type="text" class="form-control text-left name" :class="{'is-invalid':codeE===true}" placeholder="کد ۶ رقمی را وارد کنید" v-model="code">
                                <div class="text-danger" v-if="codeE">{{codeEM}}</div>
                            </div>
                            <button @click="doAuthor" v-if="this.timer>=1" class="btn btn-block btn-light" style="color:#3c0b64;">ورود کد</button>
                        </div>
                        <div v-if="this.timer>=1" class="h5">
                            ...اعتبار کد تا
                            <span v-if="this.timer>=11" class="text-light">{{timer}}</span>
                            <span v-else-if="this.timer>=6" class="text-warning">{{timer}}</span>
                            <span v-else class="text-danger">{{timer}}</span>
                            ثانیه
                        </div>
                        <div v-else>
                            <div class="mb-3">اگر کد را دریافت نکردید از روش های زیر استفاده کنید</div>
                            <div class="row">
                                <div class="col text-left ">
                                    <button v-if="alert" @click="resendCreateCode" class="btn btn-sm btn-light" style="color:#3c0b64;">ارسال مجدد کد</button>
                                    <button v-else @click="resendCreateCode" class="btn btn-sm btn-light" style="color:#3c0b64;">در حال ارسال</button>
                                </div>
                                <div class="col text-right ">
                                    <button v-if="calling" @click="callCreateCode" class="btn btn-sm btn-light" style="color:#3c0b64;">ارسال کد صوتی</button>
                                    <button v-else class="btn btn-sm btn-light" style="color:#3c0b64;">در حال ارسال</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="!nextStep" class="col-12 col-lg-10 mx-auto">

                        <h4 class="d-none d-lg-block text-right border-bottom" style="color: #fdfefe;">
                            ثبت نام مشاور
                            <div class="mt-3 h6">گوش شنوا شروع تحقق یک رویاست</div>
                        </h4>
                        <h5 class="d-lg-none text-right pt-4" style="color: #fdfefe;">
                            ثبت نام مشاور
                            <h6 class="mt-2">گوش شنوا شروع تحقق یک رویاست</h6>
                        </h5>

                        <div class="form-group text-right mb-lg-4 mt-4">
                            <label for="usernameInput">شماره موبایل خود را وارد کنید</label>
                            <div class="input-group mb-2 mt-2 mt-lg-4">
                                <div class="input-group-prepend">
                                <div class="input-group-text">+98</div>
                                </div>
                                <input type="text" class="form-control text-left name" onpaste="return false;" :class="{'is-invalid':usernameE===true}" placeholder="موبایل مثل 9128068983" v-model="username">
                            </div>
                            <div class="text-danger" v-if="usernameE">{{usernameEM}}</div>
                        </div>

                        <div><button v-if="!submited" @click="createCode" class="btn btn-block btn-light  mb-2" style="color:#3c0b64;">ثبت مشاور</button></div>
                    </div>
                    <div class="form-group form-check">
                        با ثبت نام <a href="https://gosheshenava.com/terms/" class="text-light" >قوانین و مقررات</a> را می پذیرم
                    </div>

                </div>

            </div> 
        </div>

    </div>
</template> 

<script>
import axios from 'axios'

export default {
    name: 'RegisterPage',
    data() {
        return {
            password: 'zxcvbnm,./72ZXCVB',
            username: '',
            newUsername: [],
            usernameE: null,
            usernameEM: null,
            codeE: null,
            codeEM: null,
            submited: false,
            nextStep: false,
            code: '',
            calling: true,
            alert: false,
            newCode: [],
            timer: 91,
        }
    },
    methods: {
        studentUpdate: function () {
            if (this.timer > 0) {
                this.timer -= 1
                setTimeout(this.studentUpdate, 1000);
            }
        },
        doAuthor() {
            if (this.code.length < 6 || this.code.length > 6) {
                this.codeE = true
                this.codeEM = "کد باید ۶ شماره باشد"
                if (this.code.length == 0) {
                    this.codeEM = "فیلد کد اجباری هست"
                } 
            } else {
                this.codeE   = false
                this.codeEM  = ''
                this.newCode = []
                for (let index = 0; index < this.code.length; index++) {
                    switch (this.code[index]) {
                        case '۰':
                            this.newCode.push('0')
                            break;
                        case '۱':
                            this.newCode.push('1')
                            break;
                        case '۲':
                            this.newCode.push('2')
                            break;
                        case '۳':
                            this.newCode.push('3')
                            break;
                        case '۴':
                            this.newCode.push('4')
                            break;
                        case '۵':
                            this.newCode.push('5')
                            break;
                        case '۶':
                            this.newCode.push('6')
                            break;
                        case '۷':
                            this.newCode.push('7')
                            break;
                        case '۸':
                            this.newCode.push('8')
                            break;
                        case '۹':
                            this.newCode.push('9')
                            break;
                        default:
                            this.newCode.push(this.code[index])
                    }
                }
                axios.post('/get-code/', {code: String(this.newCode.join("")), username: String(this.newUsername.join(""))})
                .then(response => {
                    if (response.data.allow) {
                        axios.post('/api/auth/token/login/', {password: this.password, username: String(this.newUsername.join(""))})
                        .then(response => {
                            if (response.status == 200) {
                                this.$store.commit("login", response.data.auth_token)
                                this.$router.push("/uptoauthor")
                            }
                        })
                    }
                    else { this.codeE = true ,this.codeEM = "کد اشتباه است ,لطفا دقت کنید ,دفعات ارسال کد ۴ بار میباشد" }
                })
                .catch(e => this.codeEM = e.response.data, this.codeE = true )
            }
        },
        createCode() {
            if (this.username.length < 10 || this.username.length > 10) {
                this.usernameE = true
                this.usernameEM = "موبایل باید ۱۰ شماره باشد"
                if (this.username.length == 0) {
                    this.usernameEM = "فیلد موبایل اجباری هست"
                }
            } else {
                this.submited   = true
                this.usernameE  = false
                this.usernameEM = ""
                this.newUsername = []
                for (let index = 0; index < this.username.length; index++) {
                    switch (this.username[index]) {
                        case '۰':
                            this.newUsername.push('0')
                            break;
                        case '۱':
                            this.newUsername.push('1')
                            break;
                        case '۲':
                            this.newUsername.push('2')
                            break;
                        case '۳':
                            this.newUsername.push('3')
                            break;
                        case '۴':
                            this.newUsername.push('4')
                            break;
                        case '۵':
                            this.newUsername.push('5')
                            break;
                        case '۶':
                            this.newUsername.push('6')
                            break;
                        case '۷':
                            this.newUsername.push('7')
                            break;
                        case '۸':
                            this.newUsername.push('8')
                            break;
                        case '۹':
                            this.newUsername.push('9')
                            break;
                        default:
                            this.newUsername.push(this.username[index])
                    }
                }
                if (String(this.newUsername.join(""))[0] != 9) {
                    this.usernameE = true
                    this.usernameEM = "موبایل نامعتبر, شماره باید با 9 شروع شود"
                } else {
                    axios.post('/api/auth/users/', {password: this.password, username: String(this.newUsername.join(""))})
                    .then(response => {
                        if (response.status == 201) {
                            axios.post('/create-code/', {username: this.username})
                                .then(response => {
                                    console.log(response)
                                    this.nextStep = true 
                                    this.alert = true
                                    this.submited = false
                                    this.studentUpdate()
                                })
                                .catch(e => this.usernameEM = e.response.data.errors, this.usernameE = true )
                        }
                    }).catch(e => {
                        this.usernameE  = true
                        this.submited = false
                        this.usernameEM = e.response.data.username.join(" ")
                    })
                }
            }

        },
        callCreateCode() {
            if (this.username.length < 10 || this.username.length > 10) {
                this.usernameE = true
                this.usernameEM = "موبایل باید ۱۰ شماره باشد"
                if (this.username.length == 0) {
                    this.usernameEM = "فیلد موبایل اجباری هست"
                }
            } else {
                this.usernameE = false
                this.usernameEM = ""
                axios.post('/call-create-code/', {username: this.username})
                    .then(response => {
                        if (response.data[0] == 'ok') {
                            this.calling = false
                            this.timer = 91
                            this.studentUpdate()
                        }
                    }).catch(e => this.usernameEM = e.response.data.errors, this.usernameE = true )
            }

        },
        resendCreateCode() {
            this.alert = false
            axios.post('/create-code/', {username: String(this.newUsername.join(""))})
            .then(response => {
                console.log(response)
                this.nextStep = true
                this.alert = true
                this.timer = 91
                this.studentUpdate()
            })

        },
    },
    mounted() {
        // $('document').ready(function() {
        //     $(window).scrollTop(0);
        // });

        this.$store.state.filter = false

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
    },
}
</script>