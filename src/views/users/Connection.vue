<template>
  <div class="Connection container pt-lg-5">
    <div class="bg-white p-3 rounded mb-4">
      <div class="col-12 d-none d-lg-block text-right mb-4">
        <router-link to="/dashboard" class="btn btn-danger"><i class="fa fa-close"></i></router-link>
      </div>

      <div v-if="itemNotFound" >
        <div class="px-lg-5 pb-4 border-bottom">
          <div class="input-group bg-light rounded">
              <input class="form-control rounded border-none bg-transparent" placeholder="(بزودی) جستجو">
              <div class="input-group-btn">
                <button type="button" class="btn btn-info"><i class="fas fa-search"></i></button>
              </div>
          </div>
        </div>

        <div class="row">
          <div v-for="item in items" :key="item.id" class="col-lg-4">
            <HeadMessage v-if="item.followId" :item="item" :author="author(authors,item.followId.id)" />
          </div>
        </div>

        <div class="mt-5 text-left" v-if="previous || next">
          <a href="#" class="m-2 border redu20 p-2 shadow text-dark" v-if="previous" @click="switchPage(previous)">صفحه قبل</a>
          <a href="#" class="m-2 border redu20 p-2 shadow text-dark" v-if="next" @click="switchPage(next)">صفحه بعد</a>
        </div>

      </div>
      <div v-else class="text-danger h6">موردی یافت نشد</div>

    </div>
  </div>
</template>

<script>
import axios from 'axios'
import HeadMessage from '@/components/HeadMessage.vue'

export default {
  name: 'ConnectionPage',
  components: {
    HeadMessage,
  },
  data() {
      return {
          items: '',
          itemNotFound: false,
          idS: [],
          authors: '',
          next: '',
          previous: '',
      }
  },
  mounted() {
    this.$store.state.filter = false

    axios.get('api/auth/users/me/')
      .then(response => {
        axios.get(`follower/?userId=${response.data.id}`)
          .then(response => {
            this.items = response.data.results
            this.next = response.data.next
            this.previous = response.data.previous
            if (response.data.results.length) {
              this.itemNotFound = true
            }
            for (let index = 0; index < this.items.length; index++) {
              if (this.items[index].requestUser) {
                this.idS.push(this.items[index].followId.id)
              }
              axios.post('find_author_list/', {list: this.idS})
                .then(response => this.authors = response.data)
                .catch(e => console.log(e.response.data))
            }
          })
          .catch(e => console.log(e.response))
      })
      .catch(e => console.log(e.response.data))
      .finally(() => this.$store.state.runAnimation = false )

  },
  methods: {
    author(items, userId) {
      for (let index = 0; index < items.length; index++) {
        if (items[index].userId == userId) {
          return items[index]
        }        
      }
      return false
    },
    switchPage(link) {
      axios.get(link)
      .then(response => {
        console.log(response)
        this.items = response.data.results
        this.next = response.data.next
        this.previous = response.data.previous
        if (response.data.results.length) {
          this.itemNotFound = true
        }
        for (let index = 0; index < this.items.length; index++) {
          if (this.items[index].requestUser) {
            this.idS.push(this.items[index].followId.id)
          }
          axios.post('find_author_list/', {list: this.idS})
          .then(response => this.authors = response.data )
          .catch(e => console.log(e.response.data))
        }
      })
      .catch(e => console.log(e.response))
    }
  },
}
</script>
