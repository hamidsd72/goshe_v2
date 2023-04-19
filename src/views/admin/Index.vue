<template>
  <div v-if="access.is_superuser" class="admin">
    
    <div class="modal" id="myModal">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <!-- Modal Header -->
                <div class="modal-header">
                    <h6 class="modal-title">پاسخ به کاربر{{userId.userId}}</h6>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <!-- Modal body -->
                <div class="modal-body">
                    <div class="form-group ">
                        <input type="text" class="form-control text-center" placeholder="عنوان پیام" v-model="subject">
                    </div>
                    <div class="form-group">
                    <textarea class="form-control text-center" rows="3" placeholder="توضیحات پیام" v-model="content"></textarea>
                </div>
                    <div class="form-group">
                        <div class="custom-file text-left">
                            <input type="file" class="custom-file-input" accept="image/*" @change="processFile($event)" >
                            <label class="custom-file-label text-center" for="customFile">اگر الحاق دارد, اینجا کلیک کنید</label>
                        </div>
                    </div>
                </div>
                <!-- Modal footer -->
                <div class="modal-footer row">
                  <div class="col"><button @click="completedMsg()" class="btn btn-danger">نادیده گرفتن</button></div>
                  <div class="col"><button @click="sendMsg()" class="btn text-light" style="background-color: #3c0b64;">{{btn}}</button></div>
                </div>
            </div>
        </div>
    </div>

    <div class="d-none d-lg-block">
      <button @click="this.$store.state.section='admin'" class="btn btn-warning text-light fixed-bottom ml-5 mb-5">برگشت به منو</button>
    </div>

    <div class="d-lg-none">
      <button @click="this.$store.state.section='admin'" class="btn btn-warning text-light fixed-top">برگشت به منو</button>
    </div>

    <div class="text-right pb-3 pt-lg-4">
      <button class="btn btn-outline-secondary" @click="lastDays(7)" >هفته گذشته</button>
      <button class="btn btn-outline-secondary" @click="lastDays(30)" >ماه گذشته</button>
    </div>

    <div  class="p-lg-5 text-light text-right">
      <div v-if="$store.state.section=='admin'" class="col-lg-4 col-11 mx-auto shadow redu20 bg-violet p-3 p-lg-5">
          <button class="btn btn-block btn-light " @click="sections('authors')">رفتن به مدیریت مشاوران</button>
          <hr>
          <button class="btn btn-block btn-light " @click="sections('tickets')">رفتن به مدیریت تیکت ها</button>
          <hr>
          <button class="btn btn-block btn-light " @click="sections('messages')">رفتن به مدیریت پیام ها</button>
          <hr>
          <button class="btn btn-block btn-light " @click="sections('Accounts')">رفتن به مدیریت هزینه ها</button>
          <hr>
          <button class="btn btn-block btn-light " @click="sections('dials')">تماس با کاربران</button>
      </div>

      <div v-else-if="$store.state.section=='dials'" class="violet col-lg-6 mx-auto">
       <div class="col-12">

        <div class="row">
          <div class="col-6 col-lg-4">
            <button class="bg-violet text-light p-2 pr-4 pl-4 border" style="border-radius: 10px;" @click="call()">تماس</button>
          </div>
          <div class="col">
            <input type="number" placeholder="شماره رو وارد کن بعد اینتر بزن" class="form-control " v-model="numberToCall">
          </div>
        </div>

       </div>
       
      </div>

      <div v-else-if="$store.state.section=='tickets'" class="text-dark">
        <div v-for="item in tickets" :key="item.id" >

          <div v-if="item.userId" class="row text-right">
              <div class="col-lg-10 col-9 border shadow redu-left mt-2 mb-3">
                  <h1 class="medium pt-2 pr-2"><button class="btn btn-light" @click="toAuthor(item.userId)">{{item.subject}} - {{item.userId}}</button></h1>
                  <h2 class="small">{{item.content}}</h2>
                  <a v-if="item.baner" :href="item.baner" class="mr-5" target="_blank">مشاهده تصویر الحاقی</a>
                  <a v-else class="mr-5" target="_blank"></a>
              </div>
              <div class="col-lg-2 col-3">
                <a href="#" >
                  <img v-if="item.userId" :src="require('@/assets/banner3.jpg')" class="float-left img-big-circle rounded-circle d-none d-lg-block" :alt="item.userId">
                  <img v-if="item.userId" :src="require('@/assets/banner3.jpg')" class="img-circle rounded-circle d-lg-none" :alt="item.userId">
                </a>
              </div>
              <div class="col "><a href="#" @click="answer(item)" data-toggle="modal" data-target="#myModal"  class="border redu20 p-2 text-dark">پاسخ دادن</a></div>
              <div class="col-8 mx-auto">{{item.jpublish}}</div>
          </div>
            
        </div>

        <div class="m-4 text-left">
          <a href="#" class="m-2 border redu20 p-2 shadow text-dark" v-if="p_tickets" @click="tickSwitchPage(p_tickets)">صفحه قبل</a>
          <a href="#" class="m-2 border redu20 p-2 shadow text-dark" v-if="n_tickets" @click="tickSwitchPage(n_tickets)">صفحه بعد</a>
        </div>

      </div>

      <div v-else-if="$store.state.section=='authors'" class="text-dark">

        <div v-for="item in authors" :key="item.id" >
            <div v-if="item" class="card">
              <div v-if="item.userId" class="card-header">آی دی کاربری مشاور {{item.userId.id}}</div>
              <div v-if="item.userId" class="card-body row">
                <div class="col col-lg text-left"><img :src="item.userId.avatar" :alt="item.id" class="img img-big-circle"></div>
                <div class="col col-lg-9 h6">
                  {{item.userId.username}} : شماره موبایل مشاور
                  <br>
                  <br>
                  نام و نام خانوادگی مشاور
                   : {{item.userId.first_name}} {{item.userId.last_name}}
                  <br>
                  <!-- <br>
                  <button class="btn btn-danger" @click="call(item.userId.username)">برای تماس با مشاور کلیک کنید</button> -->
                </div>
              </div>          

              <div class="card-header">آی دی مشاور {{item.id}}</div>
              <div class="card-body row">
                <div class="col-6 col-lg-3">{{item.shaba}} : شماره شبا</div>
                <div class="col-6 col-lg-3">{{item.uid}} : شماره پروانه کسب</div>
                <div class="col-6 col-lg-3">{{item.call_price}} : قیمت هر پیام</div>
                <div class="col-6 col-lg-3">{{item.msg_price}} : قیمت هر دقیقه تماس</div>
                <div class="col-12">{{item.older}} : بایوگرافی</div>
                <div class="col-6 col-lg-3">{{item.oneDay}} : روز اول</div>
                <div class="col-6 col-lg-3">{{item.twoDay}} : روز دوم</div>
                <div class="col-6 col-lg-3">{{item.treeDay}} : روز سوم</div>
                <div class="col-6 col-lg-3">{{item.fourDay}} : روز جهارم</div>
                <div class="col-6 col-lg-3">{{item.fiveDay}} : روز پنجم</div>
                <div class="col-6 col-lg-3">{{item.sixDay}} : روز ششم</div>
                <div class="col-6 col-lg-3">{{item.sevenDay}} : روز هفتم</div>
                <div class="col-6 col-lg-3">{{item.visit_type}} : ویزیت</div>
                <div class="col-6 col-lg-3">{{item.services}} : سرویس</div>
                <div class="col-6 col-lg-3 text-danger">{{item.status}} : تایید</div>
                <div class="col-6 col-lg-3">{{item.certificate}} : مدرک</div>
                <div class="col-6 col-lg-3">{{String(categoreis(item.category))}} : دسته ی فعالیت</div>
                <div class="col-6 col-lg-3">{{item.created_at}} : تاریخ ثبت</div>
              </div>
              
              <div class="card-footer">
                <div class="row text-center m-lg-3">
                  <div class="col"><router-link :to="`/admin/user-author/${item.id}`" class="border redu20 text-dark shadow p-2 pr-2 pl-2 pr-lg-5 pl-lg-5">ویرایش اطلاعات مشاور</router-link></div>
                  <div class="col"><router-link v-if="item.userId" :to="`/admin/user/${item.userId.id}`" class="border redu20 text-dark shadow p-2 pr-2 pl-2 pr-lg-5 pl-lg-5">ویرایش اطلاعات کاربر</router-link></div>
                </div>
              </div>

            </div>
        </div>

        <div class="m-4 text-left">
          <a href="#" class="m-2 border redu20 p-2 shadow text-dark" v-if="p_authors" @click="authSwitchPage(p_authors)">صفحه قبل</a>
          <a href="#" class="m-2 border redu20 p-2 shadow text-dark" v-if="n_authors" @click="authSwitchPage(n_authors)">صفحه بعد</a>
        </div>

      </div>

      <div v-else-if="$store.state.section=='messages'" class="text-dark">

        <div v-for="item in messages" :key="item.id" >
          <div class="card"  v-if="item.userId">
            <div class="card-header">{{[item.userId.id,item.userId.username,item.userId.first_name,item.userId.last_name]}}</div>
            <div class="car-body row p-lg-3">
              <div class="col col-lg-3 text-left"><img class="img-circle" :src="item.userId.avatar" :alt="item.userId.username"></div>
              <div class="col">
                {{item.content}}
                <br>
                <a v-if="item.attach" :href="item.attach">مشاهده پیوست</a>
                <br>
                {{item.created_at}}
              </div>
            </div>
          </div>
        </div>

        <div class="m-4 text-left">
          <a href="#" class="m-2 border redu20 p-2 shadow text-dark" v-if="p_messages" @click="msgSwitchPage(p_messages)">صفحه قبل</a>
          <a href="#" class="m-2 border redu20 p-2 shadow text-dark" v-if="n_messages" @click="msgSwitchPage(n_messages)">صفحه بعد</a>
        </div>

      </div>

      <div v-else-if="$store.state.section=='Accounts'" class="text-dark">
        <div class="card text-dark">
          <div class="card-header h4">بخش حسابداری </div>
          <div v-if="logs" class="card-body">
            <div class="col-12 col-lg-6 mx-auto">
              <div class="row">
                <div class="col-3">
                  <button class="bg-violet text-light p-2 pr-4 pl-4 border" style="border-radius: 10px;" @click="findAuthor()">یافتن</button>
                </div>
                <div class="col">
                  <input id="blah" type="text" placeholder="شماره به لاتین یا فامیلی" class="form-control " v-model="username">
                </div>
                <div v-if="findAuthors" class="col-12">
                  <div v-for="author in findAuthors" :key="author.id" class="col-12">
                    <div v-if="author" class="mt-3">
                      <router-link :to="`/admin/user-author/${author.id}`" class="text-dark">
                        {{String([author.userId.username,author.userId.first_name || '',author.userId.last_name || ''].join(' '))}}
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Logs :logs="logs" />
              
          </div>
        </div>

      </div>
    </div>
    
  </div>
</template>

<script>
import axios from 'axios'
import Logs from '@/components/Logs.vue'

export default {
    name: 'AdminIndex',
    components: {
      Logs,
    },
    data () {
      return { 
        p_tickets: '',
        n_tickets: '',
        tickets: '',

        p_authors: '',
        n_authors: '',
        authors: '',

        messages: '',
        p_messages: '',
        n_messages: '',

        logs: '',

        access: '',
        userId: '',
        cat: '',
        subject: null,
        content: null,
        baner: null,

        btn: 'ارسال پاسخ',

        findAuthors: '',
        username: '',

        numberToCall: '',
      }
    },
    mounted() {
        this.$store.state.filter = false
        this.$store.state.section = 'admin'

        axios.get('/api/auth/users/me/')
        .then(response => {
          axios.get(`amount-user/${response.data.id}/`)
          .then(response => this.access = response.data )
          .catch(e => console.table(e.response.data))
        })
        .catch(e => console.table(e.response.data))
        .finally(() => this.$store.state.runAnimation = false )
    },
    methods: {
      findAuthor() {
        this.findAuthors = []
        axios.post('adminFindAuthorByUsername/',{username: this.username}).then(response => this.findAuthors = response.data )
      },
      lastDays(days) {
        if (this.$store.state.section == 'tickets') {
          axios.get(`admin-view-ticket?lastday=${days}`).then(response => {
            this.tickets = response.data.results
            this.p_tickets = response.data.previous
            this.n_tickets = response.data.next
          })
        } else if (this.$store.state.section == 'authors') {
          axios.get(`adminuserauthor?lastday=${days}`).then(response => {
            this.authors = response.data.results
            this.p_authors = response.data.previous
            this.n_authors = response.data.next
          })
        } else if (this.$store.state.section == 'messages') {
          axios.get(`message?lastday=${days}`).then(response => {
            this.messages = response.data.results
            this.p_messages = response.data.previous
            this.n_messages = response.data.next
          })
        }
      },
      sections(section) {
        this.$store.state.section = section
        if (section == 'tickets') {
          axios.get('admin-view-ticket/').then(response => {
            this.tickets = response.data.results
            this.p_tickets = response.data.previous
            this.n_tickets = response.data.next
          })
        } else if (section == 'authors') {
          axios.get('adminuserauthor?status=0').then(response => {
            this.authors = response.data.results
            this.p_authors = response.data.previous
            this.n_authors = response.data.next
          })
          axios.get('category/')
          .then(response => {
              this.cat = response.data.results
          })
        } else if (section == 'messages') {
          axios.get('message?lastday=7').then(response => {
            this.messages = response.data.results
            this.p_messages = response.data.previous
            this.n_messages = response.data.next
          })
        } else if (section == 'Accounts') {
          axios.post('admincallAndMessageLog/').then(response => {
            this.logs = response.data
          })
        }

      },
      answer(item) {
        this.userId = item
        this.subject = `پاسخ به موضوع : ${item.subject}`
      },
      processFile(event) {
        var currentdate = new Date(); 
        var datetime = currentdate.getFullYear()
        +''+currentdate.getMonth()
        +''+currentdate.getDay()
        +''+currentdate.getHours()
        +''+currentdate.getMinutes()
        +''+currentdate.getSeconds()
        let file   = event.target.files[0]
        let custom = file.slice(0, file.size); 
        this.baner = new File([custom],`admin-${datetime}-${file.name}`);
      },
      sendMsg() { 
        if (this.subject.length > 5 && this.content.length > 5) {
          this.btn = '...در حال ارسال'
          const fd = new FormData();
          if (this.baner) { fd.append('baner', this.baner, this.baner.name,) }
          fd.append('sendTo', this.userId.userId,)
          fd.append('subject', this.subject,)
          fd.append('content', this.content,)

          axios.post('admin-view-ticket/', fd)
          .then(response => {
            console.log(response)
            this.subject  = ''
              this.content = ''
              this.baner   = ''
              alert('.پیام ارسال شد')
          }).catch(e => {
            console.log(e.response.status, e.response.data)
          })
          axios.get(`my-user/${this.userId.userId}/`).then(response => {
            axios.post('SendAdminMsgToUser/' , { bodyId: "72809", username: response.data.username, param: String(`پاسخ به تیکت شماره ${this.userId.id}`) }).then(response => alert( response.data.msg,response.data.errors ) )
          })
          axios.post('admin-ticket/', {userId: this.userId.userId} )
          .then(response => {
            console.log(response)
            location.reload();
          })
        }else {
          alert('عنوان و بدنه تیکت حداقل ۵ کاراکتر باشد')
        }
      },
      completedMsg() { 
        axios.post('admin-ticket/', {userId: this.userId.userId} ).then(response => {
          console.log(response)
          location.reload()
        })
      },
      authSwitchPage(link) {
        axios.get(`${link}`)
        .then(response => {
          this.authors = response.data.results
          this.p_authors = response.data.previous
          this.n_authors = response.data.next
        })
      },
      tickSwitchPage(link) {
        axios.get(`${link}`)
        .then(response => {
          this.tickets = response.data.results
          this.p_tickets = response.data.previous
          this.n_tickets = response.data.next
        })
      },
      msgSwitchPage(link) {
        axios.get(`${link}`)
        .then(response => {
          this.messages = response.data.results
          this.p_messages = response.data.previous
          this.n_messages = response.data.next
        })
      },
      categoreis(category) {
          let list = []
          for (let index = 0; index < this.cat.length; index++) {
              if ( category.includes(this.cat[index].id) ) {
                  list.push( this.cat[index].title )
              }
          }
          return list
      },
      call(number) {
        console.log(number)
        axios.get('/api/auth/users/me/')
        .then(response => {
          axios.post('/adminCallCreate/', {myMobile: String(response.data.username), username: String(this.numberToCall)})
          .then(response => {
            console.log(response.data)
            alert(response.data) 
          })
          .catch(e => alert(e.response.data) )
        })
      },
      toAuthor(userId) {
        axios.get(`userauthor?userId=${userId}`)
        .then(response => {
          if (response.data.results.length) {
            this.$router.push(`/admin/user-author/${response.data.results[0].id}`)            
          }
        })
      }
    },
}
</script>