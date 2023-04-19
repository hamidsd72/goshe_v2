<template>

    <div class="Callback container mt-5 text-dark">

            <!-- <router-link to="/dashboard">رفتن به داشبورد</router-link> -->
  
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'CallbackPage',
    mounted() {
        axios.post('payment_verify/', {id: this.$route.params.id})
            .then(response => {
            if (response.data.authorLink) {
                this.$router.push(response.data.authorLink)
            } else {
                this.$router.push("/dashboard")
            }
        })
        .catch(e => console.log(e.response.data))
        .finally(() => this.$store.state.runAnimation = false )

    },
}
</script>
