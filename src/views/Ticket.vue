<template>
  <div class="ticket container text-dark pt-lg-5" >
    <div class="card rounded bg-white mb-4">

        <div class="card-header bg-white ">
            <div class="row">
                <div class="col text-right my-auto">
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">ارسال پیام</button>
                </div>
                <div class="col-auto text-left">
                    <a href="tel:02162999042" class="btn btn-outline-info" >تماس با پشتیبان</a>
                </div>
                <div class="col-auto">
                    <div class="d-none d-lg-block">
                        <router-link to="/dashboard" class="btn btn-danger"><i class="fa fa-close"></i></router-link>
                    </div>
                </div>
            </div>
        </div>

        <div class="card-body bg-white " v-if="items && items.length">
            <div v-for="item in items" :key="item.id" class="rounded mb-4 p-3">
    
                <div v-if="item.userId" class="row text-right">
                    <div class="col rounded">
                        <h1 class="medium">{{item.subject}}</h1>
                        <p class="m-0">{{item.content}}</p>
                        <a v-if="item.baner" :href="item.baner" class="mr-5" target="_blank">مشاهده تصویر الحاقی</a>
                        <div class="text-left">{{item.jpublish}}</div>
                    </div>
                    <div class="col-auto">
                        <img v-if="item.userId && item.userId.avatar" :src="item.userId.avatar" class="img-circle rounded-circle" :alt="item.userId">
                        <img v-else :src="require('@/assets/banner3.jpg')" class="img-circle rounded-circle" :alt="item.userId">
                    </div>
                </div>

                <div v-else class="row text-left">
                    <div class="col-auto">
                        <img :src="require('@/assets/phone.png')" class="img-circle rounded-circle" alt="گوش شنوا">
                    </div>
                    <div class="col rounded text-right">
                        <h1 class="medium pt-2 pr-2">{{item.subject}}</h1>
                        <p class="m-0">{{item.content}}</p>
                        <a v-if="item.baner" :href="item.baner" target="_blank">مشاهده تصویر الحاقی</a>
                        <div class="text-left">{{item.jpublish}}</div>
                    </div>

                </div>
                
            </div>
        </div>

        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h6 class="modal-title" id="exampleModalLabel">ارسال پیام</h6>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    </div>
                    <div class="modal-body">
                        <input type="text" class="form-control text-center" placeholder="موضوع تیکت" v-model="subject">
                        <textarea class="form-control text-center" rows="10" placeholder="توضیحات تیکت" v-model="content"></textarea>
                    </div>
                    <div class="modal-footer">
                        <div class="btn btn-secondary btn-file">
                            الحاق تصویر
                            <input type="file" accept="image/*" @change="processFile($event)" >
                        </div>
                        <button v-if="btn=='...در حال ارسال'" class="btn btn-success mr-4" disabled>...در حال ارسال</button>
                        <button v-else @click="send" class="btn btn-success mr-4">ارسال پیام</button>
                    </div>
                </div>
            </div>
        </div>

    </div>

    
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'TicketPage',
    data() {
        return {
            items: '',
            btn: 'ارسال پیام به پشتیبان',
            subject: '',
            content: '',
            baner: '',
            id: null,
            count: true,
        }
    },
    mounted() {
        this.$store.state.filter = false

        axios.get('api/auth/users/me/')
        .then(response => {
            this.id = response.data.id
            axios.get(`ticket?userId=${response.data.id}`)
            .then(response => {
                if (response.data.results.length) {
                    this.count = false
                    this.items = response.data.results
                }
            })
            .catch(e => console.log(e.response.data))
        })
        .catch(e => console.log(e.response.data))
        .finally(() => this.$store.state.runAnimation = false )

    },
    methods: {
        processFile(event) {
            axios.get('api/auth/users/me/').then(response => {
                var currentdate = new Date(); 
                var datetime = currentdate.getFullYear()
                +''+currentdate.getMonth()
                +''+currentdate.getDay()
                +''+currentdate.getHours()
                +''+currentdate.getMinutes()
                +''+currentdate.getSeconds()
                let file   = event.target.files[0]
                let custom = file.slice(0, file.size)
                this.baner = new File([custom],`${response.data.id}-${datetime}-${file.name}`) 
            })
        },
        send() {
            if (this.subject.length > 5 && this.content.length > 5) {
                this.btn = '...در حال ارسال'
                axios.get('api/auth/users/me/')
                .then(response => {
                    const fd = new FormData();
                    if (this.baner) { fd.append('baner', this.baner, this.baner.name,) }
                    fd.append('userId', response.data.id,)
                    fd.append('subject', this.subject,)
                    fd.append('content', this.content,)
                    axios.post('ticket/', fd)
                    .then(response => {
                        console.log(response)
                        this.subject = ''
                        this.content = ''
                        this.baner   = ''
                        alert('.پیام ارسال شد')
                        location.reload(); 
                    }).catch(e => {
                        console.log(e.response.status, e.response.data)
                        alert('در ورود اطلاعات مشگلی وجود دارد')
                    })
                })
                .catch(e => console.log(e.response.data))
            }else {
                alert('عنوان و بدنه تیکت حداقل ۵ کاراکتر باشد')
            }
        }
    },
}
</script>

