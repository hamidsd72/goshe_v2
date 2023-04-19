<template>
    <div class="Logout m-5">
        <h3 class="d-none d-lg-block">برای خروج کلیک کنید</h3>
        <h6 class="d-lg-none">برای خروج کلیک کنید</h6>
        <br>
        <div class="alert alert-danger" v-if="logoutE">{{logoutE}}</div>
        <button class="btn btn-danger" @click="doLogout">خروج</button>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'LogoutPage',
    data () {
        return {
            logoutE: ''
        }
    },
    mounted() {
        this.$store.state.runAnimation = false
    },
    methods: {
        doLogout() {
            axios.post('/api/auth/token/logout/')
                .then(response => {
                    console.log(response)
                    this.$store.commit("logout")
                    this.$router.push("/login")
                })
                .catch(e => {
                    console.log(e.response.data)
                    this.logoutE = e.response.data.detail
                })
        }
    } 
}
</script>