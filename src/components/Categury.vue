<template>
  <div class="CateguryComponent rounded p-3 mb-3 mb-lg-4 bg-white border">
    <router-link :to="`/showcategury/${slug}`">
      <div class="row">
        <div class="col-auto" >
          <img :src="baner" :alt="title">
        </div>
        <div class="col text-right">
          <h6 class="text-dark">{{ title }}</h6>
          <p class="m-0">نمایش همه مشاوران این دسته</p>
        </div>
      </div>
    </router-link>
    </div>
</template>

<script>
export default {
  name: 'CateguryComponent',
  props: {
    id: Number,
    title: String,
    slug: String,
    baner: String,
  },
}
</script>
