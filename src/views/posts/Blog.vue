<template>
    <div class="Blog text-dark container">
        <!-- <img class="img img-big shadow d-none d-lg-block" style="border-radius: 0px 0px 20px 20px;" :src="require('@/assets/banner5.jpg')" alt="مقالات و دانستنی های گوش شنوا"> -->
        <div v-if="itemFound" class="ring">
            بارگذاری
            <td></td>
        </div>
        <div class="row">
            <div v-for="item in items" :key="item.id" class="text-right col-lg-4">
                <Posts :item='item' :category='categoreis(item.category)' />
            </div>
        </div>
    </div>  
</template>

<script>
import axios from 'axios'
import Posts from '@/components/Post.vue'
export default {
    name: 'BlogPage',
    components: {
        Posts,
    },
    data() {
        return {
            itemFound: true,
            items: {},
            cat: {},
        }
    },
    mounted() {
        // $('document').ready(function() {
        //     $(window).scrollTop(0);
        // });
        axios.get('/blog/')
        .then(response => {
            if (response.data.results.length) {
                this.items = response.data.results
                this.itemFound = false
            }
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


