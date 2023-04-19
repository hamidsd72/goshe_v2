<template>
  <div class="Posts p-3 shadow">
    <img :src="item.baner" class="img h-150" :alt="item.subject">
    <h1 class="d-none d-lg-block large">{{item.subject}}</h1>
    <h1 class="d-lg-none medium">{{item.subject}}</h1>
    <router-link :to="{ name: 'ShowBlog', params: { id: item.id, slug: item.slug, subject: item.subject } }" class="text-dark">
    <!-- <router-link :to="`/blog/${item.id}/${item.slug}`" class="text-dark"> -->
    <p class="line-h" v-html="item.content.substr(100,99)+'...ادامه مطلب'"></p></router-link>
    <!-- <p class="line-h">{{item.content.substr(0,99)+'... '}}<br><router-link :to="`/blog/${item.id}/${item.slug}`" class="">ادامه مطلب</router-link></p> -->
    <p v-if="item.AuthorId.userId.last_name=='ناییج' && item.AuthorId.userId.first_name=='علی'" class="text-muted text-left">{{item.jpublish}}<br> نویسنده : مدیریت گوش شنوا</p>
    <p v-else class="text-muted text-left">{{item.jpublish}}<br> نویسنده : {{item.AuthorId.userId.first_name+' '+item.AuthorId.userId.last_name}}</p>
    <p class="text-right"> دسته {{String(category).replace(',',' و ')}}</p>
  </div> 
</template>
 
<script>
export default {
  name: 'PostPage',
  props: {
    item: null,
    category: null,
  },
  
}
</script>

