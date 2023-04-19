<template>
  <div v-if="checkTime()" :class="item.services&&checkTime()?'online':'offline'" class="ShowCategory ShowCategoryComponent  py-2 p-lg-3 mb-2 mt-lg-3 rounded text-right row bg-white" >
    <!-- desktop -->
    <div class="col-lg-auto">
      <div class="text-center">
        <img v-if="item.userId.avatar" :src="item.userId.avatar" alt="avatar" class="img-circle rounded-circle" :class="item.services && checkTime()?'img-border-success':'img-border-danger' ">
        <img v-else :src="require(`@/assets/phone.png`)" alt="avatar" class="img-circle rounded-circle" :class="item.services && checkTime()?'img-border-success':'img-border-danger' ">
      </div>

      <div>
        <div class="d-none d-lg-block">
          <div v-if="item.services && checkTime()" class="text-success my-1 text-center">
            آنلاین
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle-fill" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="8"/>
            </svg>
          </div>
          <div v-else class="text-danger my-1 text-center">
            آفلاین
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle-fill" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="8"/>
            </svg>
          </div>
        </div>
        
        <div class="d-flex stars mb-lg-1">
          <div v-if="counter.stars==0 || counter.stars==5"><Star class="text-zard" /><Star class="text-zard" /><Star class="text-zard" /><Star class="text-zard" /><Star class="text-zard" /></div>
          <div v-else-if="counter.stars==1"><Star class="text-zard" /><Star /><Star /><Star /><Star /></div>
          <div v-else-if="counter.stars==2"><Star class="text-zard" /><Star class="text-zard" /><Star /><Star /><Star /></div>
          <div v-else-if="counter.stars==3"><Star class="text-zard" /><Star class="text-zard" /><Star class="text-zard" /><Star /><Star /></div>
          <div v-else-if="counter.stars==4"><Star class="text-zard" /><Star class="text-zard" /><Star class="text-zard" /><Star class="text-zard" /><Star /></div>
          <div class="mx-1">نظرات</div>
        </div>
      </div>
    </div>

    <div class="col-lg">

      <div class="col-12">
        <h6 v-if="item.userId.first_name" class="mt-lg-1">{{`${item.userId.first_name} ${item.userId.last_name}`}}</h6>
        <h6 v-else class="mt-lg-1">نام شخص وارد نشده</h6>
        <div v-for="cat in category" :key="cat.id" >
            <div v-if="$route.params.slug == cat.slug" >
              <p class="mb-3 mt-lg-3">{{`${item.certificate} ,${cat.title}`}}</p>
            </div>
        </div>
      </div>
        
      <div class="col-12">
        <div class="row mb-2 pt-lg-1">
          <div class="col text-center px-1"><p class="m-0 badge badge-light p-2 p-lg-3 col-12">{{`+${num2fa(counter.count+1)} مشاوره متنی `}}</p></div>
          <div class="col text-center px-1"><p class="m-0 badge badge-light p-2 p-lg-3 col-12">{{`+${num2fa(counter.calls+1)} مشاوره تلفنی `}}</p></div>
        </div>
        
        
        <!-- <p class="m-0">{{` پروانه کسب ${item.uid}`}}</p> -->

      </div>
        
    </div>

    <div class="col-12 my-2">
      <div v-if="item.services && checkTime()">
          <router-link :to="`/profile/${item.id}/${item.userId.first_name}-${item.userId.last_name}`" class="btn py-2 bg-violet text-light btn-block">شروع مشاوره</router-link>
      </div>
      <div v-else>
        <router-link :to="`/profile/${item.id}/${item.userId.first_name}-${item.userId.last_name}`" class="btn py-2 btn-secondary btn-block">شروع مشاوره</router-link>
      </div>
    </div>

  </div>
</template>

<script>
import Star from '@/components/Star.vue'
import axios from 'axios'
export default {
  name: 'ShowCategory',
  components: {
    Star,
  },
  data() {
    return {
      counter: {},
      today: '',
    }
  },
  props: {
    item: {}, 
    category: {},
  },
  mounted() {
    axios.post('countcomment/', { authorId: this.item.id } ).then(response => this.counter = response.data).catch(e => (e.response.data) )
  },
  methods: {
    checkTime() {
        switch (new Date().getDay()) {
          case 0:
            this.today = this.item.twoDay
            break;
          case 1:
            this.today = this.item.treeDay
            break;
          case 2:
            this.today = this.item.fourDay
            break;
          case 3:
            this.today = this.item.fiveDay
            break;
          case 4:
            this.today = this.item.sixDay
            break;
          case 5:
            this.today = this.item.sevenDay
            break;
          case 6:
            this.today = this.item.oneDay
            break;
        }

        let getHour   = new Date().getHours()
        let getMinute = new Date().getMinutes()
        let start     = this.today.split(',')[0]
        let end       = this.today.split(',')[1]

        let startHour = start.split(':')[0]
        let endHour   = end.split(':')[0]
        let startMinu = start.split(':')[1]
        let endMinu   = end.split(':')[1]

        if ( startHour < getHour ) {
            if ( endHour > getHour ) {
                return true
            }
            else if ( endHour == getHour ) {
                if ( endMinu > getMinute ) {
                    return true
                }
            }
        }
        else if ( startHour == getHour ) {
            if ( startMinu < getMinute ) {
                if ( endHour > getHour ) {
                    return true
                }
                else if ( endHour == getHour ) {
                    if ( endMinu < getMinute ) {
                        return true
                    }
                }
            }
        }
        return false

        // if (this.today && this.today.length > 9) {
        //   if ( this.today.substr(0,2) < new Date().getHours() ) {
        //       if ( this.today.substr(6,2) > new Date().getHours() ) {
        //           return true
        //       }
        //       else if ( this.today.substr(6,2) == new Date().getHours() ) {
        //           if ( this.today.substr(9,2) > new Date().getMinutes() ){
        //               return true
        //           }
        //       }
        //   }
        //   else if ( this.today.substr(0,2) == new Date().getHours() ) {
              
        //       if ( this.today.substr(3,2) < new Date().getMinutes() ) {
        //           if ( this.today.substr(6,2) > new Date().getHours() ) {
        //               return true
        //           }
        //           else if ( this.today.substr(6,2) == new Date().getHours() ) {
        //               if ( this.today.substr(9,2) < new Date().getMinutes() ){
        //                   return true
        //               }
        //           }
        //       }
        //   }
        // }
        // return false
    },
    num2fa(element) {
        let faNum   = '';
        element = String(element)
        for (var i = 0; i < element.length; i++) {
            switch (element[i]) {
                case '1': faNum = faNum+'۱'; break;
                case '2': faNum = faNum+'۲'; break;
                case '3': faNum = faNum+'۳'; break;
                case '4': faNum = faNum+'۴'; break;
                case '5': faNum = faNum+'۵'; break;
                case '6': faNum = faNum+'۶'; break;
                case '7': faNum = faNum+'۷'; break;
                case '8': faNum = faNum+'۸'; break;
                case '9': faNum = faNum+'۹'; break;
                case '0': faNum = faNum+'۰'; break;
                default:  faNum = faNum+element[i];break;
            }
        }
        return faNum
    },
  },
}
</script>
