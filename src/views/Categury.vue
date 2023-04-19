<template>
  <div v-if="!this.$store.state.runAnimation" class="Category container">
    
    <div class="search search-bar-category pt-1 pt-lg-5 mb-3">
      
      <div class="col-12">
        <div class="bg-white p-3 rounded border row">
          <div class="col-lg text-right">
            <h6 class="text-dark">دسته بندی های مشاوره گوش شنوا</h6>
            <p class="m-0 pb-2 pb-lg-0">مشاوره آنلاین با بهترین متخصصین</p>
          </div>
          <div class="col-lg-8 p-0" style="transition: 0.2s" id="findAuthorByFamilySearchBox" v-on:mouseover="fullBox">
  
              <div class="input-group bg-light rounded  " >
                <input 
                  class="form-control rounded border-none bg-transparent"
                  type="text"
                  v-model="search"
                  v-on:keyup="findAuthorByFamily"
                  placeholder="نام خانوادگی مشاور را وارد کنید"
                >
                <div class="input-group-append  rounded">  
                  <span class="pr-3 pl-3 pt-2 mt-1"><i class="fas fa-search"></i></span>
                </div>
              </div>
              <p class="m-0 pt-2 text-danger search-bar-category-alert d-none">مشاوری با این نام خانوادگی یافت نشد</p>
  
          </div>
        </div>
      </div>
      
      <div v-if="results.length" class="col-xl-7 col-lg-8 mx-auto">
        <div v-for="result in results" :key="result.id">
          <router-link :to="`/profile/${result.id}/${result.userId.first_name}-${result.userId.last_name}`">
            <div class="row bg-light rounded mt-2 text-right findAuthorByFamilyList">

              <div class="col-auto my-auto">
                <div class="py-2">
                  <img class="img-sm-circle img-border-glass rounded-circle" :src="String([$store.state.baseUrl,result.userId.avatar].join(''))" :alt="result.userId.last_name">
                </div>
              </div>
              <div class="col-6 col-lg p-0 my-auto">
                  <div class="float-left small">
                    <div>
                      <span class="badge badge-secondary rounded ml-1 p-1" v-if="result.visit_type=='m' || result.visit_type=='b'">پیام</span>
                      <span class="badge badge-secondary rounded mr-1 p-1" v-if="result.visit_type=='c' || result.visit_type=='b'">تماس</span>
                    </div>
                    <div class="mt-1 mr-3">
                      <span class="badge badge-success rounded p-1">فعال</span>
                    </div>
                  </div>
                  <div class="text-right text-dark">
                    {{`${result.userId.first_name} ${result.userId.last_name}`}}
                    <p class="m-0 text-secondary small"></p>
                  </div>    
              </div>
              <div class="col col-lg-auto text-light my-auto">
                <button class="btn btn-light"><i class="fa fa-angle-left text-success"></i></button>
              </div>

          </div>
          </router-link>
        </div>
      </div>
    </div>

    <div v-if="items.length" class="row">
      <div class="col-lg-6" v-for="item in items" :key="item.id" >
        <Categury :id="item.id" :title="item.title" :slug="item.slug" :baner="item.baner" />
      </div>
    </div>
  </div>
</template>
 
<script>
import axios from 'axios'
import Categury from '@/components/Categury.vue'

export default {
  name: 'CategoryPage',
  components: {
    Categury,
  },
  data() {
    return {
      // items: JSON.parse(localStorage.getItem("items"))
      items: '',
      results: '',
      search: '',
    }
  },
  mounted() {
    this.$store.state.runAnimation = true
    this.$store.state.filter = false

    axios.get('category')
    .then(response => this.items = response.data.results)
    .catch(e => console.table(e.response))
    .finally(() => this.$store.state.runAnimation = false )

  }, methods: {
    findAuthorByFamily() {
      if (this.search.length > 2) {
        // this.$store.state.runAnimation = true
    
        axios.post('find_author_by_last_name_list/', {last_name: this.search})
        .then(response => {
          document.querySelector('.search-bar-category-alert').classList.add('d-none')
          if (response.data.error) {
            console.table(response.data.error)
          } else {
            this.results = response.data
          }
        })
        .catch(e => {
          console.table(e.response.data)
          if (e.response.data.error && e.response.data.error=='Author By This Name Or Family Not Found') {
            document.querySelector('.search-bar-category-alert').classList.remove('d-none');
            this.results = '';
          }
        })
        // .finally(() => this.$store.state.runAnimation = false )

      }
    },
    fullBox() {
      let box = document.querySelector('#findAuthorByFamilySearchBox');
      box.classList.remove('col-lg-8');
      box.classList.add('col-12');
      box.classList.add('pt-3');
    },
  },
}
// let a = [
//           { message: 'روانشناس',slug: 'روانشناس',img: '1.png', description: 'description 1' },
//           { message: 'داخلی',slug: 'داخلی',img: '2.png', description: 'description 2' },
//           { message: 'فیزیولوژی',slug: 'فیزیولوژی',img: '3.png', description: 'description 3' },
//           { message: 'عمومی',slug: 'عمومی',img: '4.png', description: 'description 3' },
//           { message: 'مغز و اعصاب',slug: 'مغز-و-اعصاب',img: '5.png', description: 'description 3' },
//           { message: 'فیزیوتراپ',slug: 'فیزیوتراپ',img: '6.png', description: 'description 3' },
//         ]
// localStorage.setItem("items", JSON.stringify(a))
</script>
