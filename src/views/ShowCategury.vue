<template>
  <div v-if="!this.$store.state.runAnimation" class="ShowCategury container pt-lg-5">

    <div class="col-12 p-2 p-lg-3 rounded bg-white text-right">
      <h6 class="mb-2 lh-normal text-dark">لیست بهترین مشاورهای {{cat()}} در گوش شنوا</h6>
      <p class="col-8 p-0 d-none d-lg-block small">
        با گوش شنوامی‌توانید ۲۴ ساعته و از همه جای دنیا مشاوره پزشکی و مشاوره روانشناسی بگیرید. گوش شنوابه صورت تخصصی و با حفظ حریم خصوصی، اقدام به ارایه مشاوره آنلاین و مشاوره تلفنی و مشاوره ویدئویی در زمینه‌ی مشاوره اضطراب و استرس کرده است.
        به راحتی با مشاوران خود صحبت کنید
      </p>
    </div>
    
    <div class="search search-bar-category">
      
      <div class="col-12 bg-white p-3 mt-2 mt-lg-3 rounded">
          <div class="input-group bg-light rounded " >
            <input 
              class="form-control rounded border-none bg-transparent"
              type="text"
              v-model="search"
              v-on:keyup="findAuthorByFamily"
              placeholder="نام خانوادگی مشاور را وارد کنید"
            >
            <div class="input-group-append  rounded">  
              <span class="pr-3 pl-3 pt-2 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </span>
            </div>
          </div>
          <p class="m-0 pt-2 text-danger search-bar-category-alert d-none">مشاوری با این نام خانوادگی یافت نشد</p>
      </div>
    
      <div v-if="results.length" class="col-xl-7 col-lg-8 mx-auto">
        <div v-for="result in results" :key="result.id">
          <router-link :to="`/profile/${result.id}/${result.userId.first_name}-${result.userId.last_name}`">
            <div class="row bg-light rounded my-2 mb-lg-0 text-right findAuthorByFamilyList">

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
                    <div class="pt-1">
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

    <div class="col-12">
      <div class="row">
  
        <div class="col-lg-4 text-dark p-0 pl-lg-4 pt-lg-3">

          <div class="bg-white mt-1 py-3 rounded d-none d-lg-block">
            <label for="categoryInput" class="pb-2">نمایش لیست مشاوران</label>
            <div class="form-check col-11 mx-auto pb-1">
              <router-link to="/category" class="btn btn-outline-info btn-block" >نمایش لیست مشاوران</router-link>
            </div>
          </div>

          <div class="bg-white mt-2 py-3 rounded">
            <label for="categoryInput" >نوع ارتباط</label>
            <div class="col-11 mx-auto">

              <div class="row p-2 border rounded optradio_m">
                <div class="col text-right">مشاوره متنی</div>
                <div class="col-2 pl-2"><input type="radio" class="form-check-input" name="optradio" @click="refreshCategory('m')"></div>
              </div>
              <div class="row p-2 border rounded mt-2 optradio_c">
                <div class="col text-right">مشاوره تلفنی</div>
                <div class="col-2 pl-2"><input type="radio" class="form-check-input" name="optradio" @click="refreshCategory('c')"></div>
              </div>
              <div class="row border-violet violet p-2 rounded mt-2 optradio_b">
                <div class="col text-right">تلفنی و متنی</div>
                <div class="col-2 pl-2"><input type="radio" class="form-check-input" name="optradio" @click="refreshCategory('b')" checked></div>
              </div>

            </div>
          </div>
          
        </div>

        <div class="col-lg p-0">
          
          <div class="ShowCateguryBox rounded my-lg-1">
            <div v-for="item in items" :key="item.id" class="col-12">
              <ShowCategory :item="item" :category="category" />
            </div>

            <div v-if="previous || next" class="my-4">
              <a href="#" class="m-2 border redu20 p-2 shadow text-dark" v-if="previous" @click="switchPage(previous)">صفحه قبل</a>
              <a href="#" class="m-2 border redu20 p-2 shadow text-dark" v-if="next" @click="switchPage(next)">صفحه بعد</a>
            </div>
          </div>
          
        </div>
          
        <div id="accordion" class="text-right my-3  ">
          <div class="card mb-0">
            <a class="card-link" data-toggle="collapse" href="#collapseOne">
              <div class="card-header text-dark">
                آیا هزینه برقراری تماس تلفنی هم برای من محسوب می‌شود؟ آیا باید هزینه‌ تماس را روی قبض تلفن خود بپردازم؟
              </div>
            </a>
            <div id="collapseOne" class="collapse show" data-parent="#accordion">
              <div class="card-body">
                خیر. پس از زدن دکمه تماس توسط شما گوش شنوا بلافاصله با تلفن همراه‌تان تماس می‌گیرد و شما را به مشاور مورد نظر متصل می‌کند. بنابراین، برای مشاوره تلفنی گرفتن، گوش شنوا با شماره تلفن شما تماس می‌گیرد و هزینه تماس‌ برقرار شده توسط گوش شنوا پرداخت می‌شود و کاربران تنها حق مشاوره را می‌پردازند. بنابراین هیچ هزینه‌ای در قبض تلفن کاربران و مشاوران منظور نمی‌شود.
              </div>
            </div>
          </div>

          <div class="card mb-0">
            <a class="collapsed card-link" data-toggle="collapse" href="#collapseTwo">
              <div class="card-header text-dark">
                پزشکان و مشاوران چگونه می توانند خود را در سایت شما ثبت نام کنند؟
              </div>
            </a>
            <div id="collapseTwo" class="collapse" data-parent="#accordion">
              <div class="card-body">
                پزشکان به راحتی می توانند با ثبت نام و اخذ نام کاربری نسبت به تکمیل فرم مربوطه اقدام کنند. اطلاعات وارد شده بعد از تایید توسط واحد مسئول قابل نمایش بر روی سایت است.
              </div>
            </div>
          </div>

          <div class="card mb-0">
            <a class="collapsed card-link" data-toggle="collapse" href="#collapseThree">
              <div class="card-header text-dark">
                نمی دانم برای مشاوره با چه پزشک / روانشناسی باید صحبت کنم؟
              </div>
            </a>
            <div id="collapseThree" class="collapse" data-parent="#accordion">
              <div class="card-body">
                در صورتی که در انتخاب مشاور خود تردید دارید، می‌توانید توضیحات پروفایل پزشکان و مشاوران گوش شنوا را مطالعه کنید. نظرات دیگر کاربران می‌تواند به شما در انتخاب مشاور کمک کند.
              </div>
            </div>
          </div>

          <div class="card mb-0">
            <a class="collapsed card-link" data-toggle="collapse" href="#collapseFour">
              <div class="card-header text-dark">
                آیا امکان برگشت وجه حساب کاربری وجود دارد؟
              </div>
            </a>
            <div id="collapseFour" class="collapse" data-parent="#accordion">
              <div class="card-body">
                خیر ، مبلغی که در حساب کاربری می باشد صرفا به خاطر این است که شما در سامانه هوشمند گوش شنوا با مشاوران صحبت کنید.
              </div>
            </div>
          </div>

          <div class="card mb-0">
            <a class="collapsed card-link" data-toggle="collapse" href="#collapseFive">
              <div class="card-header text-dark">
                نام کاربری خود را فراموش کردم و نمیدانم با کدام مشاور صحبت کردم!
              </div>
            </a>
            <div id="collapseFive" class="collapse" data-parent="#accordion">
              <div class="card-body">
                برای این مورد در سامانه امکانی فراهم شده است تا شما به راحتی بتوانید به راحتی با مشاوران که صحبت داشته اید را جستجو کنید و نام کاربری هر فرد شماره موبایل او می باشد.
              </div>
            </div>
          </div>
        </div> 

      </div>
    </div>

  </div>
</template> 

<script>
import axios from 'axios'
import ShowCategory from '@/components/ShowCategory.vue' 
export default {
    name: 'ShowCategury',
    components: {
        ShowCategory,
    },
    data() {
        return {
          status: true,
          items: {},
          category: {},
          itemNotFounf: true,
          previous: '',
          next: '',
          onlineAuthor: 0,
          myCategory: this.$route.params.slug,
          types: [
            {slug: 'b', content: 'هر دو'},
            {slug: 'c', content: 'تماس'},
            {slug: 'm', content: 'پیام'},
          ],
          results: '',
          search: '',
        }
    },
    methods: {
      refreshCategory(type) {

        let inp_m = document.querySelector('.optradio_m');
        let inp_c = document.querySelector('.optradio_c');
        let inp_b = document.querySelector('.optradio_b');
        
        inp_m.classList.remove('violet');
        inp_c.classList.remove('violet');
        inp_b.classList.remove('violet');

        inp_m.classList.remove('border-violet');
        inp_c.classList.remove('border-violet');
        inp_b.classList.remove('border-violet');

        inp_m.classList.remove('border');
        inp_c.classList.remove('border');
        inp_b.classList.remove('border');

        if (type==='m') {
          inp_m.classList.add('border-violet');
          inp_m.classList.add('violet');
          inp_m.classList.remove('border');
        } if (type==='c') {
          inp_c.classList.add('border-violet');
          inp_c.classList.add('violet');
          inp_c.classList.remove('border');
        } if (type==='b') {
          inp_b.classList.add('border-violet');
          inp_b.classList.add('violet');
          inp_b.classList.remove('border');
        }

        if (type==='b') {
          axios.get(`author/?services=1&status=1&category=${this.$route.params.slug}`)
          .then(response => {
            this.items = response.data.results
            this.previous = response.data.previous
            this.next = response.data.next
          }).catch(e => {
              console.table(e.response.data)
          })
        } else {
          axios.get(`author/?services=1&status=1&visit_type=${type}&category=${this.$route.params.slug}`)
          .then(response => {
            this.items = response.data.results
            this.previous = response.data.previous
            this.next = response.data.next
          }).catch(e => {
              console.table(e.response.data)
          })
        }

      },
      switchPage(link) {
        axios.get(`${link}`)
        .then(response => {
          this.items    = response.data.results
          this.previous = response.data.previous
          this.next     = response.data.next
        })
        .catch(e => {
            console.table(e.response.data)
        })
      },
      checkStatus() {
        // document.getElementById("right").style.width = "0";
        this.status = !this.status
        let offlineItems = document.querySelectorAll('.offline')

        if (this.status===false) {
          offlineItems.forEach( offlineItem => {
            offlineItem.classList.add('d-none')
          })
        } else {
          offlineItems.forEach( offlineItem => {
            offlineItem.classList.remove('d-none')
          })
        }

      },
      openNavRight() {
        document.getElementById("right").style.width = "250px";
      },
      closeNavRight() {
        document.getElementById("right").style.width = "0";
      },
      cat() {
        for (let index = 0; index < this.category.length; index++) {
          if (this.category[index].slug == this.$route.params.slug) {
            return this.category[index].title
          }
        }
      },
      findAuthorByFamily() {
        if (this.search.length > 2) {
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
        }
        
      }
    },
    mounted() {
      this.$store.state.runAnimation = true
      // $('document').ready(function() {
      //   $(window).scrollTop(0);
      // });
      this.$store.state.filter = true
      axios.get(`author/?services=1&status=1&category=${this.$route.params.slug}`)
        .then(response => {
          this.items = response.data.results
          this.previous = response.data.previous
          this.next = response.data.next
          if (response.data.results[0]) {
            this.itemNotFounf = false 
          }
        })
        .catch(e => {
            console.table(e.response.data)
        })
      axios.get('category/')
        .then(response => {
          this.category = response.data.results

          response.data.results.forEach( ele => {
            if ( ele.slug == this.$route.params.slug ) {
              this.$store.state.consolationCategory = ele.title
            }
          })

        })
        .catch(e => {
            console.table(e.response.status)
        })
        .finally(() => this.$store.state.runAnimation = false)
    },
    // doEdit() {
      //   let index  = this.items.findIndex( item => item.slug == this.$route.params.slug)
      //   this.items[index] = {
      //     message: this.message,
      //     slug: this.message.replaceAll(" ", "-").toLowerCase(),
      //     description: this.description,
      //     img: this.img,
      //   }
      //   let database = JSON.stringify(this.items)
      //   localStorage.setItem('items', database)
      //   this.item = this.items[index]
      //   this.edit = false
      //   this.$router.push(`/showcategury/${this.items[index].slug}`)
      // },
      // doRemove() {
      //   let index  = this.items.findIndex( item => item.slug == this.$route.params.slug)
        
      //   this.items.splice(index, 1)

      //   let database = JSON.stringify(this.items)
      //   localStorage.setItem('items', database)
        
      //   this.$router.push("/categury")
      // }
}
</script>

