<template>
    <div> 
        <div class="col-xl-10 col-lg-11 mx-auto p-2 bg-violet redu20">
            <router-link to="/connection" class="float-left ml-4 mt-4 text-light">برگشت</router-link>
            <div class="selected-user text-light text-center"> شما {{`${items.length} `}} پیام دارید </div>
            <div class="chat-container">
                <div style="overflow: auto;max-height: 500px;">
                    <ul class="chat-box chatContainerScroll" v-for="i in items" :key="i.id" >
                        <li v-if="i.userId.id==this.$route.params.id" class="chat-right">
                            <div class="chat-hour text-light">{{i.created_at.substr(0, 10) + ',' + i.created_at.substr(11, 5) }}</div>
                            <div class="chat-text">{{i.content}}<br><a v-if="i.attach" :href="i.attach" target="_blank" >مشاهده پیوست</a></div>
                            <div class="chat-avatar">
                                <img v-if="i.userId.avatar" :src="i.userId.avatar" alt="Retail Admin">
                                <img v-else :src="require('@/assets/logo.png')" alt="Retail Admin">
                                <div v-if="i.userId.first_name=='علی' && i.userId.last_name=='ناییج'" class="chat-name text-success ">مدیر گوش شنوا</div>
                                <div v-else class="chat-name">{{`${i.userId.first_name} ${i.userId.last_name}`}}</div>
                            </div>
                        </li>
                        <li v-else class="chat-left">
                            <div class="chat-avatar">
                                <img v-if="i.userId.avatar" :src="i.userId.avatar" alt="Retail Admin">
                                <img v-else :src="require('@/assets/logo.png')" alt="Retail Admin">
                                <div v-if="i.userId.first_name=='علی' && i.userId.last_name=='ناییج'" class="chat-name text-success ">مدیر گوش شنوا</div>
                                <div v-else class="chat-name">{{`${i.userId.first_name} ${i.userId.last_name}`}}</div>
                            </div>
                            <div class="chat-text">{{i.content}}<br><a v-if="i.attach" :href="i.attach" target="_blank" >مشاهده پیوست</a></div>
                            <div class="chat-hour text-light">{{i.created_at.substr(0, 10) + ',' + i.created_at.substr(11, 5) }}</div>
                        </li>
                    </ul>
                </div>
                
                <div v-if="!sendbtn | !send" ><router-link class="text-light" to="/transaction/create" >ابتدا حساب خود را شارژ کنید</router-link></div>
                <div v-else class="form-group mt-3 mb-0 row">
                    <div class="col-2 col-lg-1 btn btn-block btn-light btn-file pt-4" style="color: #3c0b64">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-paperclip" viewBox="0 0 16 16">
                            <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z"/>
                        </svg>   
                        <input type="file" class="custom-file-input" accept="image/*" @change="processFile($event)" >
                    </div>
                    <div class="col"><textarea class="form-control text-right" rows="2" placeholder="تایپ متن برای ارسال" v-model="content" ></textarea></div>
                    <!-- <button type="button" class="btn btn-outline-secondary col-2 ml-2" data-toggle="modal" data-target="#fileupload">الحاق تصویر</button> -->
                    <div class="col-2 col-lg-1 bg-white rounded text-center">
                        <button v-if="msgSendBtn=='ارسال پیام'" @click="sendMsg()" class="btn btn-block mt-3" style="color: #3c0b64">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89.471-1.178-1.178.471L5.93 9.363l.338.215a.5.5 0 0 1 .154.154l.215.338 7.494-7.494Z"/>
                            </svg>
                        </button>
                    </div>
                    <div v-if="attachName" class="col-12 text-light small">{{`به پیام شما الحاق شد ${attachName} : تصویر با نام`}}</div>

                    <!-- <div class="modal fade" id="fileupload">
                        <div class="modal-dialog modal-xl">
                            <div class="modal-content">
                                <div class="modal-body col-10 mx-auto rounded">
                                    <h4 class="text-right">انتخاب فایل</h4><br>
                                    <div class="custom-file mt4- mb-4">
                                        <input type="file" class="custom-file-input" accept="image/*" @change="processFile($event)" >
                                        <label class="custom-file-label" for="customFile">اینجا کلیک کنید</label>
                                    </div>
                                    <p class="text-right">بعد از انتخاب فایل مورد نظر این فورم را بسته و ادامه دهید</p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">بستن</button>
                                </div>
                                
                            </div>
                        </div>
                    </div> -->
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'Message',
    props: {
        me: '',
        items: {},
        sendbtn: '',
        amount: 0,
        next: '',
        previous: '',
    },
    mounted() {
        axios.post('completedMessage/', {userId: this.$route.params.id}).then(response => console.log(response.data.completedMessage) )
    },
    data() {
        return {
            content: '',
            attach: '',
            price: '',
            send: true,
            msgSendBtn: 'ارسال پیام',
            isAuthor: 'author',
            attachName: '',
        }
    },
    methods: {
        processFile(event) {
            var currentdate = new Date(); 
            var datetime = currentdate.getFullYear()
            +''+currentdate.getMonth()
            +''+currentdate.getDay()
            +''+currentdate.getHours()
            +''+currentdate.getMinutes()
            +''+currentdate.getSeconds()

            $("[data-dismiss=modal]").trigger({ type: "click" });
            let file   = event.target.files[0]
            let custom = file.slice(0, file.size);
            this.attachName = file.name
            this.attach = new File([custom],`${this.me}-${this.$route.params.id}-${this.items.length}-${datetime}-${file.name}`);     
        },
        sendMsg() {
            this.msgSendBtn = '...در حال ارسال'
            if (this.content.length > 9) { 
                axios.get('/api/auth/users/me/')
                .then(response => {
                    if (this.me) {
                        this.isAuthor = 'notAuthor'
                        axios.get(`amount-user/${response.data.id}`)
                        .then(response => {
                            if (response.data.amount >= this.me.msg_price) {
                                this.price = response.data.amount - this.me.msg_price
                                localStorage.setItem("amount", response.data.amount) 
                                this.$store.state.amount = response.data.amount
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
                    fd.append('userId', response.data.id,)
                    fd.append('sendTo', this.$route.params.id,)
                    fd.append('content', this.content,)
                    fd.append('isAuthor', this.isAuthor,)
                    fd.append('amount', this.amount,)

                    axios.post('/send_massege/',fd)
                    .then(response => {
                        console.log(response.data)
                        this.content = ''
                        this.attach  = ''
                        this.msgSendBtn = true
                    }).catch(e => console.log(e.response.data))
                })
            } else {
                alert('برای ارسال پیام حداقل ۱۰ کاراکتر نیاز است')
            }  
        },
    }
}
</script>
