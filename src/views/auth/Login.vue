<template>
    <div class="Login pt-lg-5 container" >
        
        <div class="col-12">
            <div v-if="alert" id="alert_msg" class="row mb-2 py-3 bg-success text-light">
                <div class="col-2 col-lg-1 p-0">
                    <button class="close" style="float: unset !important;" v-on:click="alert_msg_toggle">&times;</button>
                </div>
                <div class="col p-0 text-center">
                    <h6 class="m-0 p-0">کد تایید ارسال شد</h6>
                </div>
            </div>

            <div class="col-lg-6 mx-auto py-3 rounded bg-white mt-lg-4 py-lg-4">
                <div v-if="nextStep" class="col-12 col-lg-10 mx-auto">
                    <div class="text-right border-bottom pb-2 mb-3">
                        <h5>کد ارسال شده را وارد کنید</h5>
                    </div>
                    <div class="mb-3">
                        <div class="form-group ">
                            <input type="text" class="form-control text-left name" :class="{'is-invalid':codeE===true}" placeholder="کد ۶ رقمی را وارد کنید" v-model="code">
                            <div class="text-danger" v-if="codeE">{{codeEM}}</div>
                        </div>
                        <button @click="doLogin" class="btn btn-block btn-success">ورود کد</button>
                    </div>
                    
                    <div v-if="this.timer>=1">
                        ...درخواست مجدد کد تا
                        <span v-if="this.timer>=11" class="text-dark">{{timer}}</span>
                        <span v-else-if="this.timer>=6" class="text-warning">{{timer}}</span>
                        <span v-else class="text-danger">{{timer}}</span>
                        ثانیه
                    </div>
                    <div v-else>
                        <div class="row mt-2 mt-lg-4">
                            <div class="col">
                                <button v-if="alert" @click="resendCreateCode" class="btn btn-sm btn-block btn-light text-info fs-sm-12">ارسال مجدد کد</button>
                                <button v-else @click="resendCreateCode" class="btn btn-sm btn-block btn-light text-info fs-sm-12">در حال ارسال</button>
                            </div>
                            <div class="col">
                                <button v-if="calling" @click="callCreateCode" class="btn btn-sm btn-block btn-light text-info fs-sm-12">ارسال کد صوتی</button>
                                <button v-else class="btn btn-sm btn-block btn-light text-info fs-sm-12">در حال ارسال</button>
                            </div>
                        </div>
                    </div>
                    <br>
                </div>
                <div v-if="!nextStep" class="col-12 col-lg-10 mx-auto">
                    <div class="text-right border-bottom">
                        <h5>ثبت نام یا ورود به ناحیه کاربری</h5>
                        <p class="my-3">گوش شنوا شروع تحقق یک رویاست</p>
                    </div>
                    <div class="form-group text-right pt-3">
                        <label for="usernameInput" >شماره موبایل خود را وارد کنید</label>
                        <div class="input-group bg-light border rounded mt-3">
                            <input type="text" class="form-control text-left bg-transparent border-none name" onpaste="return false;" :class="{'is-invalid':usernameE===true}" placeholder="9128068983" v-model="username">
                            <div class="input-group-prepend rounded"><div class="input-group-text rounded">+98</div></div>
                        </div>
                        <div class="text-danger feedback" >{{usernameEM}}</div>
                    </div>
                    <button v-if="!submited" @click="createCode" class="btn btn-block btn-success mb-2">ورود یا ثبت نام</button>
                </div>
                <div class="form-group form-check">
                    با ورود <a href="https://gosheshenava.com/terms/" class="text-muted" >قوانین و مقررات</a> را می پذیرم
                </div>
            </div>

        </div>

    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'LoginPage',
    data() {
        return {
            password: 'zxcvbnm,./72ZXCVB',
            username: '',
            usernameE: null,
            usernameEM: null,
            codeE: null,
            codeEM: null,
            nextStep: false,
            submited: false,
            code: '',
            calling: true,
            alert: false,
            newUsername: [],
            newCode: [],
            timer: 20,
        }
    },
    methods: {
        alert_msg_toggle() {
            document.querySelector('#alert_msg').classList.toggle('d-none')
        },
        studentUpdate: function () {
            if (this.timer > 0) {
                this.timer -= 1
                setTimeout(this.studentUpdate, 1000);
            }
        },
        doLogin() {
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
                                this.$router.push("/dashboard")
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
                    this.nextStep = true
                    this.alert = true
                    this.alert_msg_toggle
                    this.submited = false
                    this.studentUpdate()
                    axios.post('/create-code/', {username: String(this.newUsername.join(""))})
                    .then(response => {
                        console.log(response)
                    })
                    .catch(e => {
                        if ( e.response.data.errors == "شماره یافت نشد") {
                            axios.post('/api/auth/users/', {password: this.password, username: String(this.newUsername.join(""))})
                            .then(response => {
                                if (response.status == 201) {
                                    axios.post('/create-code/', {username: response.data.username})
                                    .then(response => {
                                        console.log(response)
                                    })
                                    this.nextStep = true 
                                    this.alert = true
                                    this.alert_msg_toggle
                                    this.submited = false
                                    this.studentUpdate()
                                }
                            }).catch(e => {
                                this.usernameE  = true
                                this.usernameEM = e.response.data.username.join(" ")
                                 this.submited = false
                            })
                        }
                    })

                }
            }

        },
        resendCreateCode() {
            this.alert = false
            axios.post('/create-code/', {username: String(this.newUsername.join(""))})
            .then(response => {
                console.log(response)
                this.nextStep = true
                this.alert = true
                this.alert_msg_toggle
                this.timer = 20
                this.studentUpdate()
            })

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
                axios.post('/call-create-code/', {username: String(this.newUsername.join(""))})
                .then(response => {
                    if (response.data[0] == 'ok') {
                        this.calling = false
                        this.timer = 20
                        this.studentUpdate()
                    }
                })
                .catch(e => {
                    console.log(e.response.data)
                    this.usernameEM = e.response.data.errors
                    this.usernameE  = true
                })
            }
        },
    },
    mounted() {
        this.$store.state.filter = false
        this.$store.state.runAnimation = false
    },
}
</script>