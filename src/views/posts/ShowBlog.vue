<template>
    <div class="ShowBlog container text-dark">

        <div class="row ">

            <div class="col mt-4 d-none d-lg-block">
                <div class="col-12 mb-5 text-left d-none d-lg-block">
                    <router-link to="/blog" >بازگشت به مقالات</router-link>                
                </div>
                <div class="p-2 border redu20 text-right shadow ">
                    <h6 class="mt-2 mr-2">مطالب مرتبط</h6>
                    <hr class="text-dark">

                    <div class="col-12">
                        <div v-for="item in letestBlog" :key="item.id" class="row border redu20 mb-2">
                            <div class="col-4"><img class="img-circle rounded" :src="item.baner" :alt="item.subject"></div>
                            <h1 class="col mt-4 medium">
                                <a :href="`/blog/${item.id}/${item.slug}`" class="text-dark">{{item.subject}}</a>
                            </h1>
                        </div>
                    </div>

                </div>
            </div>
            
            <div class="col-lg-8">
                
                <div class="mt-3 mb-3 bg-violet border redu20 p-lg-3 p-2">
                    <router-link class=" text-light  h6" to="/category">
                        <h7 class="text-success"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle-fill" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8"/></svg></h7>
                        لیست مشاوران
                    </router-link>
                </div>

                <div v-if="itemFound" class="ring">
                    بارگذاری
                    <td></td>
                </div>
                
                <div class="mt-3 p-3 p-lg-5 border redu20 text-right shadow">
                    <div class="col-12 mb-5 mb-lg-0">
                        <h1 class="d-none d-lg-block large" >{{item.subject}}</h1>
                        <h6 class="float-left">
                            <div v-if="item.stars & item.stars==1"><Star class="text-zard" /><Star /><Star /><Star /><Star /></div>
                            <div v-else-if="item.stars & item.stars==2"><Star class="text-zard" /><Star class="text-zard" /><Star /><Star /><Star /></div>
                            <div v-else-if="item.stars & item.stars==3"><Star class="text-zard" /><Star class="text-zard" /><Star class="text-zard" /><Star /><Star /></div>
                            <div v-else-if="item.stars & item.stars==4"><Star class="text-zard" /><Star class="text-zard" /><Star class="text-zard" /><Star class="text-zard" /><Star /></div>
                            <div v-else><Star class="text-zard" /><Star class="text-zard" /><Star class="text-zard" /><Star class="text-zard" /><Star class="text-zard" /></div>
                        </h6>
                        <h1 class="d-lg-none medium">{{item.subject}}</h1>
                        <p class="text-muted">{{item.jpublish}}
                            <br class="mb-1">
                            <span v-if="author=='علی ناییج'">مدیریت گوش شنوا</span>
                            <span v-else>{{author}}</span>
                        </p>
                        <p class="text-right"> دسته {{String(categoreis(category)).replace(',',' و ')}}</p>
                        <img class="img" :src="item.baner" :alt="item.subject">
                        <div class="m-lg-3 d-none d-lg-block" style="line-height: 2;text-align: justify;text-align-last: right;" v-html="item.content"></div>
                        <div class="text-center d-lg-none" v-html="item.content"></div>
                    </div>
                </div>
            </div>

            <div class="col-12 mt-4 mb-5 d-lg-none">
                <div class="p-4 border redu20 text-right shadow ">
                    <h6 >مطالب مرتبط</h6>
                    <br>
                    <!-- <hr class="text-dark"> -->

                    <div v-for="item in letestBlog" :key="item.id" class="row border redu20 mt-2 p-1">
                        <div class="col-3"><img class="img-sm-circle rounded " :src="item.baner" :alt="item.subject"></div>
                        <h1 class="col mt-2 medium">
                            <a :href="`/blog/${item.id}/${item.slug}`" class="text-dark">{{item.subject}}</a>
                        </h1>
                    </div>

                </div>
            </div>

        </div>
    </div>  
</template>

<script>
import axios from 'axios'
import Star from '@/components/Star.vue'

export default {
    name: 'ShowBlog',
    components: {
        Star
    },
    data() {
        return {
            itemFound: true,
            item: {},
            author: '',
            cat: {},
            category: '',
            letestBlog: '',
        }
    },
    mounted() {
        // $('document').ready(function() {
        //     $(window).scrollTop(0);
        // });
        axios.get(`blog/${this.$route.params.id}/`)
        .then(response => {
            this.itemFound = false
            this.item = response.data
            this.author = `${response.data.AuthorId.userId.first_name} ${response.data.AuthorId.userId.last_name}`
            this.category = response.data.category
            axios.get(`letest-blog?category=${response.data.category[0]}`)
            .then(response => {
                this.letestBlog = response.data.results
            })
        })
        .catch(e => {
            console.log(e.response.data)
        })

        axios.get('/category/')
        .then(response => {
            this.cat = response.data.results
        })
        .catch(e => {
            console.log(e.response.data)
        })
    },
    methods: {
        categoreis(category) {
            let list = []
            for (let index = 0; index < this.cat.length; index++) {
                if ( category.includes(this.cat[index].id) ) {
                    list.push( this.cat[index].title )
                }
            }
            return list
            
        }
    },

}
</script>

<style scope>
    .h-250 {
        max-height: 250px;
    }
</style>

