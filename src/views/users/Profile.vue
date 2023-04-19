<template>
  <div v-if="!this.$store.state.runAnimation" class="Profile container my-3 pt-lg-4">

    <Profiles :item="item"
              :category="category"
              :comment="comment"
              :numbers="numbers"
              :itemNotFounf="itemNotFounf"
              :allow="allow"
              :follow="follow"
              :meUnmber="meUnmber"
              :auth_user="auth_user"
              :amount="amount"
              :activeCallLog="activeCallLog"
              />        

  </div>
</template>

<script>
import axios from 'axios'
import Profiles from '@/components/Profile.vue'

export default {
  name: 'ProfilePage',
  components: {
    Profiles,
  },
  data() {
    return {
        item: {},
        category: {},
        comment: {},
        numbers: {},
        meUnmber: '',
        itemNotFounf: true,
        allow: true,
        follow: false,
        auth_user: null,
        amount: null,
        activeCallLog: 0,
    }
  },
  mounted() {
    this.$store.state.runAnimation = true
    this.$store.state.filter = false
    // دسته بندی ها
    axios.get('/category/').then(response => {
      this.category = response.data.results
    })
    // مشاور این صفحه
    axios.get(`author/${this.$route.params.id}`)
      .then(response => {
        axios.get(`ActiveCallLog?authorId=${this.$route.params.id}`).then(response => {
          this.activeCallLog = response.data.results.length
        })
        .catch(e => console.log(e.response.status) )
        this.item = response.data
        this.itemNotFounf = false
        let userId = response.data.userId.id
        // نظرات درباره این مشاور
        axios.get(`/comment/?authorId=${response.data.userId.id}`).then(response => this.comment = response.data.results )
          // کاربر نشست
        axios.get('/api/auth/users/me/')
          .then(response => {
            if (response.data.id == userId) { this.allow = false }
            this.auth_user= response.data.id
            this.meUnmber = response.data.username
            // اگر مشاور فالوو شد بود
            axios.get(`/createfollower/?userId=${response.data.id}&followId=${userId}`)
              .then(response => {
                if (response.data.results.length) { this.follow = true }
              })
            axios.get(`/comment/?userId=${response.data.id}&?authorId=${userId}`)
              .then(response => { 
                console.table(response)
                // if (response.data.results.length) { this.allow = false }
              })
            axios.get('numbers/')
              .then(response => {
                if (response.data.results.length) { this.numbers = response.data.results }
              })
            axios.get(`amount-user/${response.data.id}/`)
            .then(response => {
                localStorage.setItem("amount", response.data.amount) 
                this.$store.state.amount = response.data.amount
                this.amount = response.data.amount
            })
          })
          .catch(e => console.log(e.response.status))
      })
      .catch(e => console.log(e.response.status) )
      .finally(() => this.$store.state.runAnimation = false )
  },
}
</script>
