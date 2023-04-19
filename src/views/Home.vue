<template>
  <div class="p-3">
    <div class="Home text-center text-dark pr-1 pl-1 p-lg-5">
      <div class="modal mt-lg-5" id="support">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-body">
              <a href="/ticket" class="text-dark" >
                ارسال پیام پشنیبانی (تیکت)
                <br>
                <p v-if="!$store.state.isAuthenticated" class="text-dark">ابتدا وارد حساب خود شوید</p>
              </a>
              <hr>
              <a href="tel:02162999042" class="text-dark" >پشتیبانی تلفنی (فقط ساعات اداری)</a>
              <hr>
              02162999042
            </div>
          </div>
        </div>
      </div>

      <header class="row">
        <div class="col-xl-5 col-lg-6">
          <img :src="require('@/assets/qq.jpeg')" class="img" alt="مشاوره انلاین روانشناسی خانواده">
          <div class="d-lg-none">
            <router-link class="bg-violet btn-block text-light p-2 pr-3 pl-3 h6" style="border-radius:25px;" to="/category">
                <p class="text-success">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle-fill" viewBox="0 0 16 16">
                        <circle cx="8" cy="8" r="8"/>
                    </svg>
                  </p>
                نمایش لیست مشاوران
            </router-link>
            
            <div class="input-group mt-4">

              <div class="input-group">
                <div class="input-group-append">
                  <span class="bg-violet pr-3 pl-3 text-light shadow" style="border-radius:20px 0px 0px 20px;">
                    <div class="mt-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                      </svg>
                    </div>
                  </span>
                </div>
                <input 
                  class="form-control "
                  style="border-radius:0px 20px 20px 0px;color:#3c0b64;border: 2px solid #3c0b64;"
                  type="text"
                  v-model="search"
                  v-on:keyup="findAuthorByFamily()"
                  placeholder="یافتن مشاور"
                >
              </div>

              <div v-if="results.length" class="col-12 small">
                <div class="row bg-violet shadow text-right text-light mt-1" v-for="result in results" :key="result.id" style="border-radius: 30px;">
                  <div class="col-3 text-light mt-4">
                    <div v-if="result.visit_type=='b'">{{result.call_price}} تماس {{result.msg_price}} پیام</div>
                    <div v-else-if="result.visit_type=='m'">{{result.msg_price}} پیام</div>
                    <div v-else-if="result.visit_type=='c'">{{result.call_price}} تماس</div>
                  </div>
                  <div class="col mt-2">
                    <router-link :to="`/profile/${result.id}/${result.userId.first_name}-${result.userId.last_name}`" class="text-light btn btn-sm" style="color: #3c0b64;">
                      <div class="small">
                        {{`${result.userId.first_name} ${result.userId.last_name}`}}
                        <div v-if="result.visit_type=='b'">مشاوره بصورت تماس و پیام</div>
                        <div v-else-if="result.visit_type=='m'">مشاوره بصورت پیام</div>
                        <div v-else-if="result.visit_type=='c'">مشاوره بصورت تماس</div>
                      </div>
                    </router-link>
                  </div>
                  <div class="col-2 pt-1 pb-1"><img class="img-sm-circle img-border-glass rounded-circle" :src="String(['http://176.97.218.214:8000',result.userId.avatar].join(''))" :alt="result.userId.last_name"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col d-none d-lg-block h6 content">
          <div class="search mr-5 ml-5">
            <div class="input-group">
              <div class="input-group-append">  
                <span class="bg-violet pr-3 pl-3 text-light " style="border-radius:25px 0px 0px 25px;">
                  <svg style="margin-top: 11px;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                  </svg>
                </span>
              </div>
              <input 
                class="form-control form-control-lg"
                type="text"
                style="border-radius:0px 25px 25px 0px;"
                v-model="search"
                v-on:keyup="findAuthorByFamily()"
                placeholder="نام یا نام خانوادگی مشاور مورد نظر را وارد کنید"
              >
            </div>
            <div v-if="results.length" class="col-10 ml-5" style="position: absolute;padding-right: 44px;">
              <div v-for="result in results" :key="result.id">
                <div class="row shadow bg-violet text-light mt-1" style="border-radius: 50px;">
                  <div class="col-4 text-light mt-5">
                    <div v-if="result.visit_type=='b'">{{result.call_price}} تماس {{result.msg_price}} پیام</div>
                    <div v-else-if="result.visit_type=='m'">{{result.msg_price}} پیام</div>
                    <div v-else-if="result.visit_type=='c'">{{result.call_price}} تماس</div>
                  </div>
                  <div class="col mt-3">
                    <router-link :to="`/profile/${result.id}/${result.userId.first_name}-${result.userId.last_name}`" class="btn text-light" style="color: #3c0b64;">
                      <div class="mb-3">{{`${result.userId.first_name} ${result.userId.last_name}`}}</div>
                      <div v-if="result.visit_type=='b'">مشاوره بصورت تماس و پیام</div>
                      <div v-else-if="result.visit_type=='m'">مشاوره بصورت پیام</div>
                      <div v-else-if="result.visit_type=='c'">مشاوره بصورت تماس</div>
                    </router-link>
                  </div>
                  <div class="col-3"><div class="pt-1 pb-1"><img class="img-circle img-border-glass rounded-circle" :src="String(['http://176.97.218.214:8000',result.userId.avatar].join(''))" :alt="result.userId.last_name"></div></div>                    
                
                </div>
              </div>
            </div>
          </div>
          <div class="d-none d-xl-block">  
            <h3 class="mt-4 mb-1">  : با اپلیکیشن گوش شنوا</h3>
            <h5 class="line-h pt-3 ml-5 mr-5">
              مشاوره آنلاین و تلفنی با سامانه هوشمند گوش شنوا
              با سامانه گوش شنوا می‌توانید ۲۴ساعته و از همه جای دنیا از پزشکان و روانشناسان با تجربه و مجرب ما مشاوره بگیرید
              مشاوره خانواده ، مشاوره کودک ، مشاوره قبل از ازدواج ، مشاوره تحصیلی ، مشاوره جنسی و مشاوره حقوقی خانواده  از دیگر خدمات سامانه هوشمند گوش شنوا است
              همچنین اگر حیوان خانگی دارید، می توانید از دامپزشکان مشاوره بگیرید.
              بعد از ورود به سرویس دکتر و مشاورسامانه  گوش شنوا، شماره موبایل خود را وارد کنید و به صورت ناشناس و امن از صدها مشاور، روانشناس و پزشک با تخصص‌های متفاوت مشاوره بگیرید
              اگر نیاز به پرستار کودک و یا پرستاری سالمند دارید به راحتی می توانید درخواست خود را ثبت کنید
              تهیه آنلاین نسخه‌ی دارو، خدمت دیگر است که به شما این امکان را میدهد که بدون مراجعه به داروخانه داروهای خود را تهیه کنید
            </h5>
          </div>
          <div class="d-xl-none">  
            <h5 class="mt-4 mb-3">  : با اپلیکیشن گوش شنوا</h5>
            <div class="line-h small">
              مشاوره آنلاین و تلفنی با سامانه هوشمند گوش شنوا
              با سامانه گوش شنوا می‌توانید ۲۴ساعته و از همه جای دنیا از پزشکان و روانشناسان با تجربه و مجرب ما مشاوره بگیرید
              مشاوره خانواده ، مشاوره کودک ، مشاوره قبل از ازدواج ، مشاوره تحصیلی ، مشاوره جنسی و مشاوره حقوقی خانواده  از دیگر خدمات سامانه هوشمند گوش شنوا است
              همچنین اگر حیوان خانگی دارید، می توانید از دامپزشکان مشاوره بگیرید.
              بعد از ورود به سرویس دکتر و مشاورسامانه  گوش شنوا، شماره موبایل خود را وارد کنید و به صورت ناشناس و امن از صدها مشاور، روانشناس و پزشک با تخصص‌های متفاوت مشاوره بگیرید
              اگر نیاز به پرستار کودک و یا پرستاری سالمند دارید به راحتی می توانید درخواست خود را ثبت کنید
              تهیه آنلاین نسخه‌ی دارو، خدمت دیگر است که به شما این امکان را میدهد که بدون مراجعه به داروخانه داروهای خود را تهیه کنید
            </div>
          </div>
        </div>
        
      </header>

      <div class="row">
        <div class="col-12 mt-4 mb-3 h4">
          چطور مشاوره آنلاین بگیرم؟ 
          <div class="h6 mt-3">راهنمای قدم به قدم تا شروع گفتگو با مشاور</div>
        </div>
        <!-- desktop -->
        <div class="d-none d-lg-block col">
          <div class="border redu20 pt-3 pb-3">
            <div class="col-5 mx-auto mb-2"><img :src="require(`@/assets/44.jpeg`)" class="img p-2 redu20" ></div>
            <div class="col-12">از متخصص مشاوره بگیرید</div>
          </div>
        </div>

        <div class="d-none d-lg-block col">
          <div class="border redu20 pt-3 pb-3">
            <div class="col-5 mx-auto mb-2"><img :src="require(`@/assets/11.jpeg`)" class="img p-2 redu20" ></div>
            <div class="col-12">هزینه مشاور خود را پرداخت کنید</div>
          </div>
        </div>

        <div class="d-none d-lg-block col">
          <div class="border redu20 pt-3 pb-3">
            <div class="col-5 mx-auto mb-2"><img :src="require(`@/assets/33.jpeg`)" class="img p-2 redu20" ></div>
            <div class="col-12">شماره موبایل خود را وارد کنید</div>
          </div>
        </div>
        
        <div class="d-none d-lg-block col">
          <div class="border redu20 pt-3 pb-3">
            <div class="col-5 mx-auto mb-2"><img :src="require(`@/assets/b.png`)" class="img p-2 redu20" ></div>
            <div class="col-12">مشاور خود را انتخاب کنید</div>
          </div>
        </div>
        <!-- mobile -->
        <div class="d-lg-none col-10 mx-auto mb-2 pt-2 pb-2 shadow border redu20">
          <div class="col-4 mx-auto mb-2"><img :src="require(`@/assets/b.png`)" class="img p-2 redu20" ></div>
          <div class="col-12">مشاور خود را انتخاب کنید</div>
        </div>

        <div class="d-lg-none col-10 mx-auto mb-2 pt-2 pb-2 shadow border redu20">
          <div class="col-4 mx-auto mb-2"><img :src="require(`@/assets/33.jpeg`)" class="img p-2 redu20" ></div>
          <div class="col-12">شماره موبایل خود را وارد کنید</div>
        </div>

        <div class="d-lg-none col-10 mx-auto mb-2 pt-2 pb-2 shadow border redu20">
          <div class="col-4 mx-auto mb-2"><img :src="require(`@/assets/11.jpeg`)" class="img p-2 redu20" ></div>
          <div class="col-12">هزینه مشاور خود را پرداخت کنید</div>
        </div>

        <div class="d-lg-none col-10 mx-auto mb-2 pt-2 pb-2 shadow border redu20">
          <div class="col-4 mx-auto mb-2"><img :src="require(`@/assets/44.jpeg`)" class="img p-2 redu20" ></div>
          <div class="col-12">از متخصص مشاوره بگیرید</div>
        </div>

      </div>

      <div class="pr-lg-4 pl-lg-4 row">
        <router-link to="/category" class="black h4 text-center col-12 mt-3">نمایش همه تخصص ها</router-link>
        
        <div class="col-12 text-right mr-5 h5 ">مشاوره آنلاین با بهترین پزشک متخصص</div>
        <div class="col-12 text-right mr-5 h6">مشاوره پزشکی‌ آنلاین و تلفنی با <br> صدها پزشک متخصص و متعهد</div>
        <!-- <carousel :autoplay="3000" :wrap-around="true" :items-to-show="4" class="d-none d-lg-block">
          <slide v-for="item in items" :key="item.id">
            <div class="mr-1 ml-1">
              <Categury :id="item.id" :title="item.title" :slug="item.slug" :baner="item.baner" />
            </div>
          </slide>

          <template #addons>
            <navigation class="navigation"/>
          </template>
        </carousel>

        <div class="d-lg-none container">
          <carousel :autoplay="3000" :wrap-around="true" :items-to-show="1.5" >
            <slide v-for="item in items" :key="item.id">
              <Categury :id="item.id" :title="item.title" :slug="item.slug" :baner="item.baner" />
            </slide>
          </carousel>
        </div> -->

      </div>

      <div class="p-lg-4 pt-lg-5 row">  
        <div class="col-12 text-right mr-5 h5">مشاوره آنلاین با بهترین روانشناس</div>
        <div class="col-12 text-right mr-5 h6">مشاوره تلفنی با بهترین روانشناس کودک، بهترین روانشناس خانواده و صدها مشاور آنلاین دیگر</div>
        <!-- <carousel :autoplay="3000" :wrap-around="true" :items-to-show="4" class="d-none d-lg-block">
          <slide v-for="item in seconditems" :key="item.id">
            <div class="mr-1 ml-1">
              <Categury :id="item.id" :title="item.title" :slug="item.slug" :baner="item.baner" />
            </div>
          </slide>

          <template #addons>
            <navigation class="navigation"/>
          </template>
        </carousel>

        <div class="d-lg-none container">
          <carousel :autoplay="3000" :wrap-around="true" :items-to-show="1.5" >
            <slide v-for="item in seconditems" :key="item.id">
              <Categury :id="item.id" :title="item.title" :slug="item.slug" :baner="item.baner" />
            </slide>
          </carousel>
        </div> -->

      </div>
      
      <div class="row">
        <div class="col-12 h4 mt-4 black text-center">چرا<span class="text-dark"> گوش شنوا ؟</span></div>
        <div class="col-lg col-12 m-1">
          <div class="pr-4 pr-lg-0 pl-4 pl-lg-0">
            <div class="row border redu20 shadow pt-4 pb-4">
              <div class="col-9">
                <h5>حفظ حریم شخصی</h5>
                ما در مشاوره روانشناسی گوش شنوا به خوبی از اطلاعات شما محافظت می کنیم
              </div>
              <div class="col"><img :src="require(`@/assets/c.png`)" class="img redu20" alt="حفظ حریم شخصی کاربران"></div>
            </div>
          </div>
        </div>
        <div class="col-lg col-12 m-1">
          <div class="pr-4 pr-lg-0 pl-4 pl-lg-0">
            <div class="row border redu20 shadow pt-4 pb-4">
              <div class="col-9">
                <h5>در هر زمان و مکان</h5>
                در هر زمان از شبانه روز حتی ایام تعطیل به طور مستقیم با مشاوران گفتگو کنید
              </div>
              <div class="col"><img :src="require(`@/assets/a.png`)" class="img redu20" alt="دسنرسی در هر مکان و زمان"></div>
            </div>
          </div>
        </div>
        <div class="col-lg col-12 m-1">
          <div class="pr-4 pr-lg-0 pl-4 pl-lg-0">
            <div class="row border redu20 shadow pt-4 pb-4">
              <div class="col-9">
                <h5>مشاوره متخصصان و متعهد</h5>
                مشاوره سلامتی با بهترین مشاوران ایران و مورد تایید گوش شنوا
              </div>
              <div class="col"><img :src="require(`@/assets/b.png`)" class="img redu20" alt="مشاوره با متخصصین متعهد"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="pr-lg-4 pl-lg-4 row mb-4 mb-lg-5">
        <div class="col-12 mt-4 h4">
          <a href="https://gosheshenava.com/%d9%85%d8%ac%d9%84%d9%87-%d8%b3%d9%84%d8%a7%d9%85%d8%aa/" class="black">مجله سلامت گوش شنوا</a>
        </div>

        <div class="col-12 text-right mr-5 h5 ">مطالب روانشناسی و دانستنی‌های پزشکی</div>
        <div class="col-12 text-right mr-5 h6">بروزترین مقالات روانشناسی و بروزترین مطالب علمی پزشکی</div>
        <!-- <carousel :autoplay="3000" :wrap-around="true" :items-to-show="4" class="col-12 d-none d-lg-block">
          <slide v-for="item in letestBlog" :key="item.id">
            <div class="  ">
              <img class="w-250 h-150 redu20 " :src="item.baner" :alt="item.subject">
              <router-link :to="{ name: 'ShowBlog', params: { id: item.id, slug: item.slug, subject: item.subject } }" class="violet h6">
                <div v-if="item.subject.length >= 30">...{{item.subject.substr(0,30)}}</div>
                <div v-else>{{item.subject}}</div>
              </router-link>
            </div>
          </slide>

          <template #addons>
            <navigation class="navigation"/>
          </template>
        </carousel>

        <div class="d-lg-none container">
          <carousel :autoplay="3000" :wrap-around="true" :items-to-show="1.5" >
            <slide v-for="item in letestBlog" :key="item.id">
              <div class="p-1 redu20 shadow">
              <img class="w-250 h-150 redu20 " :src="item.baner" :alt="item.subject">
              <router-link :to="{ name: 'ShowBlog', params: { id: item.id, slug: item.slug, subject: item.subject } }" class="violet h6">
                <div v-if="item.subject.length >= 30">...{{item.subject.substr(0,30)}}</div>
                <div v-else>{{item.subject}}</div>
              </router-link>
            </div>
            </slide>
          </carousel>
        </div> -->
      </div>

    </div>
    
    <hr class="bg-violet ">
    <div class="row p-2 p-lg-4 text-dark " style="border-radius: 50px;">
      <div class="col-4 d-none d-lg-block">
        <button class="btn btn-light btn-block text-light pt-2 pb-2 ml-2 h5" style="background-color: #3c0b64;border-radius: 20px;" data-toggle="modal" data-target="#support">درخواست پشتیبانی</button>
      </div>
      <div class="col mt-lg-2">
        <a href="tel:02162999042" class="violet h5 d-none d-lg-block text-right mr-5" >021-62999042</a>
        <a href="tel:02162999042" class="violet d-lg-none" >021-62999042</a>
      </div>
      <div class="d-lg-none col-6">نیاز به راهنمایی دارید؟</div>
      <div class="d-none d-lg-block col-5 h5 mt-2">نیاز به راهنمایی دارید؟</div>
      <div class="col-12 d-lg-none mt-3">
        <button class="btn btn-light btn-block text-light pt-2 pb-2 ml-2 h5" style="background-color: #3c0b64;border-radius: 20px;" data-toggle="modal" data-target="#support">درخواست پشتیبانی</button>
      </div>
    </div>
    <hr class="bg-violet mb-5" >  
  
  </div>
</template>

<script>
import axios from 'axios'
// import HomeSlider from '@/components/HomeSlider.vue'
// import HelloWorld from '@/components/HelloWorld.vue'
// import Categury from '@/components/Categury.vue'

import 'vue3-carousel/dist/carousel.css';
// import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';

export default {
  name: 'HomePage',
  components: {
    // Carousel,
    // Slide,
    // Pagination,
    // Navigation,
    // HelloWorld,
    // HomeSlider,
    // Categury,
  },
  data() {
    return {
      items: '',
      seconditems: '',
      letestBlog: '',
      search: '',
      results: '',
    }
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
    },
    findAuthorByFamily() {
      if (this.search.length > 2) {
        axios.post('find_author_by_last_name_list/', {last_name: this.search})
        .then(response => {
          if (response.data.error) {
            console.log(response.data.error)
          } else {
            this.results = response.data
          }
        })
      }
    }
  },
  mounted() {
    // $('document').ready(function() {
    //   $(window).scrollTop(0);
    // });
    this.$store.state.filter = false

    axios.get('category?category=1')
    .then(response => {
      this.items = response.data.results
    })
    .catch(e => {
        console.log(e.response.data)
    })

    axios.get('category?category=2')
    .then(response => {
      this.seconditems = response.data.results
    })
    .catch(e => {
        console.log(e.response.data)
    })

    axios.get('letest-blog?letest=1')
    .then(response => {
      this.letestBlog = response.data.results
    })
  }
}
</script>

<style scope>
  .navigation {
    background-color: #3c0b64;
  }
  .head {
    font-weight: bold;
    text-align: right;
    margin-top: 5%;
  }
  .body {
    margin-bottom: 2%;
  }
  .title {
    padding: 3%;
    font-weight: bold;
  }
  .content {
    margin-top: 1%;
    text-align: justify;
    text-align-last: right;
  }
  .line-h {
    line-height: 1.9;
  }
  footer {
    background-color: rgb(86 55 55 / 80%);
  }
</style>