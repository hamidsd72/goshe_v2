<template>
    <div class="container">
        <div class="PwaPage pt-lg-4">
            <img :src="require('@/assets/logo.jpg')" class="logo bg-white border logo rounded-circle rounded-circle p-1" alt="کوش شنوا">
            <div class="text-secondary mt-3">
                <h4 class="mb-4 text-center">نصب ورژن PWA اپلیکیشن گوش شنوا</h4>
                <div class="text-right px-lg-5">
                    <h6 class="pt-3 mb-3 border-top">در مرورگر سافاری (ios)</h6>
                    <p class="small-font text-secondary ">
                        <i class="fa-solid fa-arrow-up-from-bracket mx-1"></i>
                        در نوار پایین روی دکمه Share کلیک کنید
                    </p>
                    <p class="small-font text-secondary">
                        <!-- <img src="https://pwa.mci.ir/static/media/add_box_black_24dp.b2e62f60.svg" alt="add"> -->
                        در منوی باز شده در قسمت پایین صفحه گزینه
                    </p>
                    <p class="small-font text-secondary">
                        <i class="fa-regular fa-square-plus mx-1"></i>
                        Add To Home Screen را انتخاب کنید
                    </p>
                    <p class="small-font text-secondary">
                        در مرحله بعد در قسمت بالا روی Add کلیک کنید 
                    </p>
                    <h6 class="pt-3 mb-3 border-top">در مرورگر کروم (android)</h6>
                    <p class="small-font text-secondary">
                        از منو کناری (نوبار) گزینه <br>
                        افزودن به صفحه اصلی (Add To Home Screen) را انتخاب کنید
                    </p>
                </div>

                <div class="pwa-fixed-bottom">
                    <div class="box p-2">
                        <button class="btn btn-block text-light bg-violet" @click="understand()">متوجه شدم</button>  
                    </div>
                </div>
            </div> 
        </div>
    </div>
</template>

<script>
    export default {
        name: 'PwaPage',
        data() {
            return {
                pwaCheck: null,
            }
        },
        mounted() {
            this.$store.state.runAnimation = false
            this.pwaCheck   = localStorage.getItem("pwa")
            if (this.pwaCheck===null) {
                localStorage.setItem("pwa", false)
            }
            if (this.pwaCheck=='true') {
                this.$router.push('/category')
            }
        },
        methods: {
            understand() {
                localStorage.setItem("pwa", true)
                this.$store.state.pwaCheck  = true
                this.$router.push('/category')
            }
        },
    }
</script>

