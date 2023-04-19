<template>
    <div class="ShowConnection container pt-lg-5">
        <div class="bg-white p-3 rounded border ShowConnectionCard">
            <div class="col-12 d-none d-lg-block text-right mb-4">
                <router-link to="/connection" class="btn btn-secondary">برگشتن</router-link>
            </div>

            <div v-if="items.length" class="selected-user text-light text-center"> تعداد {{`${items.length} `}} پیام در این گفتگو وجود دارد </div>
            <div v-else class="selected-user text-secondary text-center">برای شروع یک پیام ارسال کنید</div>

            <div class="chat-box chatContainerScroll mb-4 col-12" v-for="i in items" :key="i.id" >
                <div :class="i.userId.id==this.$route.params.requestUser ? 'ml-auto' : 'mr-auto'" class="col-10 bg-light rounded">
                    <div class="row py-2">

                        <div v-if="i.userId.id==this.$route.params.requestUser" class="col-auto">
                            <img class="img-circle rounded-circle img-border-glass" v-if="i.userId.avatar" :src="i.userId.avatar" alt="Retail Admin">
                            <img class="img-circle rounded-circle img-border-glass" v-else :src="require('@/assets/logo.png')" alt="Retail Admin">
                        </div>

                        <div class="col">
                            <!-- <p class="text-left m-0">{{i.created_at.substr(0, 10) + ',' + i.created_at.substr(11, 5) }}</p> -->
                            <div class="text-right">{{ (i.userId.first_name=='علی' && i.userId.last_name=='ناییج') ? 'مدیر گوش شنوا' : `${i.userId.first_name} ${i.userId.last_name}`}}</div>
                            <p class="text-right m-0">{{i.content}}<br><a v-if="i.attach" :href="i.attach" target="_blank" >مشاهده پیوست</a></p>
                        </div>

                        <div v-if="i.userId.id!=this.$route.params.requestUser" class="col-auto">
                            <img class="img-circle rounded-circle img-border-glass" v-if="i.userId.avatar" :src="i.userId.avatar" alt="Retail Admin">
                            <img class="img-circle rounded-circle img-border-glass" v-else :src="require('@/assets/logo.png')" alt="Retail Admin">
                        </div>

                    </div>
                </div>
            </div>

            <div v-if="previous || next" class="container text-right">
                <a href="#" class="m-2 border redu20 p-2 shadow text-dark" v-if="previous" @click="switchPage(previous)">صفحه قبل</a>
                <a href="#" class="m-2 border redu20 p-2 shadow text-dark" v-if="next" @click="switchPage(next)">صفحه بعد</a>
            </div>
            
            <div class="col-12 p-2">
                <div v-if="!sendbtn | !send" ><router-link to="/transaction/create" >ابتدا حساب خود را شارژ کنید</router-link></div>
                <div v-else >
                    <textarea class="form-control text-right" rows="4" placeholder="نوشتن پیام برای ارسال" v-model="content" ></textarea>

                    <div class="pt-3 text-right">
                        <div v-if="msgSendBtn==true" class="btn btn-secondary btn-file ml-4">
                            الحاق تصویر
                            <input type="file" class="custom-file-input" accept="image/*" @change="processFile($event)" >
                        </div>

                        <button v-if="msgSendBtn==true" @click="sendMsg()" class="btn btn-success">ارسال پیام </button>
                        <button v-else class="btn btn-success" disabled>...ارسال</button>
                    </div>

                    <div v-if="attachName" class="pt-3 text-info">{{`به پیام شما الحاق شد ${attachName} : تصویر با نام`}}</div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ShowConnection',
  data() {
    return {
      me: '',
      items: '',
      next: '',
      previous: '',
      sendbtn: true,
      amount: 0,
      content: '',
      attach: '',
      price: '',
      send: true,
      msgSendBtn: true,
      isAuthor: 'author',
      attachName: '',
    }
  },
  created() {
    axios.get(`userauthor?userId=${this.$route.params.id}`)
    .then(response => {
        if (response.data.results.length > 0) {
            this.me = response.data.results[0]
            if (this.$route.params.id != this.$route.params.requestUser) {
                this.amount = response.data.results[0].msg_price
                axios.get('api/auth/users/me/')
                .then(response => {
                    axios.get(`amount-user/${response.data.id}`)
                    .then(response => {
                        if (response.data.amount < this.me.msg_price) {
                            this.sendbtn = false
                        }
                    })
                })
            }
        }
    })
    .catch(e => console.table(e.response))
    this.studentUpdate();
  },
  mounted() {
    axios.post('completedMessage/', {userId: this.$route.params.id})
    .then(response => console.log(response.data.completedMessage) )
    .catch(e => console.table(e.response))
    .finally(() => this.$store.state.runAnimation = false )
  },
  methods: {
    switchPage(link) {
        axios.get(`${link}`)
        .then(response => {
          this.items    = response.data.results
          this.next     = response.data.previous
          this.previous = response.data.next
        })
    },
    studentUpdate: function () {
        if (this.$route.params.id) {
            axios.get('api/auth/users/me/')
            .then(response => {
                axios.get(`message/?userId=${response.data.id}&followId=${this.$route.params.id}`)
                  .then(response => {
                        this.items    = response.data.results
                        this.next     = response.data.next
                        this.previous = response.data.previous
                  })
                  .catch(e => console.log(e.response.data.status) )
                })
                setTimeout(this.studentUpdate, 5000);
        }
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
        this.attachName = file.name
        this.attach = new File([custom],`${this.$route.params.id}-${this.$route.params.requestUser}-${this.items.length}-${datetime}-${file.name}`);
    },
    sendMsg() {
        this.msgSendBtn = false
        if (this.content.length > 4) { 
            axios.get('api/auth/users/me/')
            .then(response => {
                if (this.$route.params.id != this.$route.params.requestUser) {
                    this.isAuthor = 'notAuthor'
                    axios.get(`amount-user/${response.data.id}`)
                    .then(response => {
                        if (response.data.amount >= (this.me.msg_price * 10)) {
                            this.price = response.data.amount - (this.me.msg_price * 10)
                            localStorage.setItem("amount", this.price) 
                            this.$store.state.amount = this.price
                            if (this.price < this.me.msg_price) {
                                this.send = false
                            }
                        }
                    })
                }
                const fd = new FormData();
                if (this.attach) {
                    fd.append('attach', this.attach, this.attach.name,)
                }
                fd.append('username', response.data.username,)
                fd.append('userId', response.data.id,)
                fd.append('sendTo', this.$route.params.id,)
                fd.append('content', this.content,)
                fd.append('isAuthor', this.isAuthor,)
                fd.append('amount', this.amount,)

                axios.post('send_massege/',fd)
                .then(response => {
                    console.log(response.data)
                    this.content    = ''
                    this.attach     = ''
                    this.attachName = ''
                    this.msgSendBtn = true

                    axios.post('notification-for-users', {
                        "userId": this.$route.params.id,
                        "bodyId": "74630",
                    })
                    .then(response => console.log(response.data))
                    .catch(e => console.log(e.response))
                }).catch(e => console.log(e.response.data))
            })
        } else {
            this.msgSendBtn = true
            alert('برای ارسال پیام حداقل ۵ کاراکتر نیاز است')
        }
    },
  },
}
</script>
