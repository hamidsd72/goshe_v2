<template>
    <div class="NavbarTop ">
        <!-- desktop navbar -->
        <div class="d-none d-lg-block">
            
            <div class="fixed-top">
                <nav class="navbar navbar-expand-lg bg-white border-bottom p-0">
                    <div class="collapse navbar-collapse" id="nav">
                        
                        <div class="form-inline my-2 my-lg-0">
                            <a href="https://gosheshenava.com" class="mr-3 ml-3" ><img class="logo" :src="require('@/assets/logo.jpg')" ></a>
                            <router-link v-if="!$store.state.pwaCheck" to="/" class="text-dark">اپلیکیشن</router-link>
                            <router-link to="/transaction/create" v-if="$store.state.isAuthenticated" class="text-dark">
                                {{ num2fa(formatMoney( this.$store.state.amount )) }} 
                                <span class="text-success">افزایش</span>
                            </router-link>
                            <router-link to="/uptoauthor" v-if="$store.state.isAuthenticated && (!doctor && !$store.state.doctor)" class="text-success ml-2">ثبت نام مشاور یا پزشک</router-link>
                            <router-link to="/questions" class="text-dark">سوالات متداول</router-link>
                            <router-link to="/ticket" class="violet mr-2">پشتیبانی</router-link>
                            <router-link class="mr-2 text-dark" to="/category">
                                <div class="d-flex">
                                    <p class="text-success m-0 ml-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle-fill" viewBox="0 0 16 16">
                                            <circle cx="8" cy="8" r="8"/>
                                        </svg>
                                    </p>
                                    لیست مشاوران
                                </div>
                            </router-link>
                            <div class="nav-item dropdown">
                                <a v-if="$store.state.isAuthenticated" class="nav-item dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown">منو کاربری</a>
                                <div v-if="$store.state.isAuthenticated" class="dropdown-menu">
                                    <router-link to="/dashboard" class="dropdown-item">ناحیه کاربری</router-link>
                                    <router-link to="/category" class="dropdown-item">لیست مشاوران</router-link>
                                    <router-link to="/connection" class="dropdown-item">مشاوران من</router-link>
                                    <!-- <router-link to="/callLog" class="dropdown-item">تماس ها <small>(لیست سیاه)</small></router-link> -->
                                    <router-link to="/callLog" class="dropdown-item">تماس ها</router-link>
                                    <router-link to="/notification" class="dropdown-item">اعلانات</router-link>
                                    <router-link v-if="doctor || $store.state.doctor" to="/revenue" class="dropdown-item">درآمد من</router-link>
                                    <router-link to="/transaction" class="dropdown-item">صورتحساب</router-link>
                                    <router-link v-if="doctor || $store.state.doctor" :to="`/visits/show/${$store.state.doctor}`" class="dropdown-item">درخواست نوبت</router-link>
                                    <router-link v-if="doctor || $store.state.doctor" :to="`/exam/${$store.state.doctor}`" class="dropdown-item">آزمون ها</router-link>
                                    <router-link to="/create-article/" v-if="doctor || $store.state.doctor" class="dropdown-item">ارسال مقاله</router-link>
                                </div>
                            </div>
                        </div>
    
                        <ul class="navbar-nav mr-auto">
                            <li class="nav-item" v-if="!$store.state.isAuthenticated">
                                <router-link to="/login" class="btn bg-violet text-light px-4">
                                    ورود / ثبت نام
                                    <!-- <font-awesome-icon icon="fa-solid fa-user-secret" /> -->
                                </router-link>
                            </li>
                            <li class="nav-item" v-if="$store.state.isAuthenticated">
                                <router-link to="/logout" class="btn btn-danger text-light px-4">خروج</router-link>
                            </li>
                        </ul>
    
                    </div>
                </nav>
            </div>

        </div>
        <!-- mobile navbar -->
        <div class="d-lg-none">
            <div class="fixed-bottom bg-white">
                <nav class=" navbar">
                    <router-link class="navbar-brand bg-violet text-light redu20" to="/login" v-if="!$store.state.isAuthenticated">ورود</router-link>
                    <div v-if="$store.state.isAuthenticated">
                        <router-link to="#" class="navbar-brand bg-violet text-light redu20" v-if="state" @click="openNavLeft()">فهرست</router-link>
                        <router-link to="#" class="navbar-brand bg-violet text-light redu20" v-else @click="closeNavLeft()">بستن</router-link>
                    </div>
                    <router-link to="/category" class="navbar-brand bg-violet text-light redu20">مشاوران</router-link>
                    <!-- <router-link to="#" v-if="$store.state.filter" @click="openNavRight()" class="navbar-brand bg-violet text-light redu20">فیلتر</router-link> -->
                    <a href="https://gosheshenava.com" class="navbar-brand bg-violet text-light redu20">خانه</a>
                </nav>
            </div>
        </div>

        <div id="left" v-if="$store.state.isAuthenticated" class="sidenavLeft sidenav bg-white">
            <p class="bg-light text-secondary py-3" >{{username || $store.state.username}}</p>
            <div class="navbarSidenav col-11 mx-auto">
                <router-link @click="miniNav()" to="/dashboard" v-if="$store.state.isAuthenticated" class="btn btn-sm btn-light mb-2 border rounded">ناحیه کاربری</router-link>
                <router-link  @click="miniNav()" to="/transaction/create" v-if="$store.state.isAuthenticated" class="btn btn-sm btn-light mb-2 border border-success rounded">افزایش موجودی</router-link>

                <router-link @click="miniNav()" to="/uptoauthor" v-if="!doctor && !$store.state.doctor" class="btn btn-sm btn-light text-warning mb-2 border border-secondary rounded">ثبت نام مشاور</router-link>
                <router-link v-if="doctor || $store.state.doctor" @click="miniNav()" :to="`/visits/show/${$store.state.doctor}`" class="btn btn-sm btn-light mb-2 border border-secondary rounded">درخواست نوبت</router-link>
                <router-link v-if="doctor || $store.state.doctor" @click="miniNav()" :to="`/exam/${$store.state.doctor}`" class="btn btn-sm btn-light mb-2 border border-secondary rounded">آزمون ها</router-link>
                <router-link v-if="doctor || $store.state.doctor" @click="miniNav()" to="/revenue" class="btn btn-sm btn-light mb-2 border border-secondary rounded">درآمد من</router-link>

                <router-link @click="miniNav()" to="/connection" class="btn btn-sm btn-light mb-2 border rounded">مشاوران من</router-link>
                <!-- <router-link @click="miniNav()" to="/callLog" class="btn btn-sm btn-light mb-2 border rounded">تماس ها <small>(لیست سیاه)</small></router-link> -->
                <router-link @click="miniNav()" to="/callLog" class="btn btn-sm btn-light mb-2 border rounded">تماس ها</router-link>
                <router-link @click="miniNav()" to="/notification" class="btn btn-sm btn-light mb-2 border rounded">اعلانات</router-link>
                <router-link @click="miniNav()" to="/transaction" class="btn btn-sm btn-light mb-2 border rounded">صورتحساب</router-link>
                <router-link @click="miniNav()" to="/ticket" class="btn btn-sm btn-light mb-2 border rounded">پشتیبانی</router-link>
                <router-link @click="miniNav()" to="/logout" class="btn btn-sm btn-danger border rounded text-white">خروج از حساب</router-link>
            </div>
        </div>
        
    </div>
</template>

<script>
    export default {
        name: 'NavbarComponent',
        data() {
            return {
                userId: '',
                doctor: '',
                username: '',
                state: true,
            }
        },
        mounted() {
            this.userId   = localStorage.getItem("userId")
            this.doctor   = localStorage.getItem("doctor")
            this.username = localStorage.getItem("username")
        },
        methods: {
            formatMoney(number) {
                let money = (number / 10).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                if (money.length > 0) {
                    return `تومان ${money.substr(1,money.length-4)}`
                }
            },
            openNavLeft() {
                document.getElementById("left").style.width = "250px";
                this.state = false
                // document.getElementById("main").style.marginLeft = "250px";
            },

            closeNavLeft() {
                document.getElementById("left").style.width = "0";
                this.state = true
                // document.getElementById("main").style.marginLeft= "0";
            },

            openNavRight() {
                document.getElementById("right").style.width = "250px";
                // document.getElementById("main").style.marginRight = "250px";
            },
            // miniNav(path) {
            miniNav() {
                document.getElementById("left").style.width = "0";
                this.state = true
            },
            num2fa(element) {
                let faNum   = '';
                element = String(element)
                for (var i = 0; i < element.length; i++) {
                    switch (element[i]) {
                        case '1': faNum = faNum+'۱'; break;
                        case '2': faNum = faNum+'۲'; break;
                        case '3': faNum = faNum+'۳'; break;
                        case '4': faNum = faNum+'۴'; break;
                        case '5': faNum = faNum+'۵'; break;
                        case '6': faNum = faNum+'۶'; break;
                        case '7': faNum = faNum+'۷'; break;
                        case '8': faNum = faNum+'۸'; break;
                        case '9': faNum = faNum+'۹'; break;
                        case '0': faNum = faNum+'۰'; break;
                        default:  faNum = faNum+element[i];break;
                    }
                }
                return faNum
            },
        },
    }
</script>