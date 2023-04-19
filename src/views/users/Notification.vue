<template>
  <div class="Notification container mt-5">
    <div class="bg-white p-3 rounded border">
      <div class="col-12 d-none d-lg-block text-right mb-4">
        <router-link to="/dashboard" class="btn btn-danger"><i class="fa fa-close"></i></router-link>
      </div>

      <div class="px-2 px-4 text-right" v-if="notify.length">
        <div class="row">
          <div class="col border p-1 p-lg-2">نوع</div>
          <div class="col border p-1 p-lg-2">عنوان</div>
          <div class="col border p-1 p-lg-2">متن</div>
        </div>
        <div v-for="t in notify" :key="t.id" class="row">
          <div class="col border p-1 p-lg-2" >{{t.type}}</div>
          <div class="col border p-1 p-lg-2" >{{t.title}}</div>
          <div class="col border p-1 p-lg-2" >{{t.content}}</div>
        </div>
      </div>
      <div v-else class="text-danger h6">موردی یافت نشد</div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'NotificationPage',
  components: {
  },
  data() {
    return {
        notify: {},
    }
  },
  mounted() {
    this.$store.state.filter = false

    axios.get(`notify/?userId=${JSON.parse(localStorage.getItem("userId"))}`)
      .then(response => this.notify = response.data.results)
      .catch(e => console.log(e.response.data.status))
      .finally(() => this.$store.state.runAnimation = false )

  },
}
</script>
