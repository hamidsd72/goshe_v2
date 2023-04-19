<template>
    <div class="connection-component card mb-0 mt-4">
        <div class="card-body bg-light">
            <div class="connection-component-avatar">
                <div class="text-right" :class="counter > 0 ? 'text-success' : 'text-secondary'">پیام {{num2fa(counter)}} جدید</div>
                <img v-if="item.followId.avatar" :src="item.followId.avatar" :alt="item.followId.id" class="img-circle rounded-circle img-border-glass">
                <img v-else :src="require('@/assets/logo.png')" :alt="item.followId.id" class="img-circle rounded-circle img-border-glass">
            </div>

            <div class="details">
                <div v-if="myUser==item.requestUser" >
                    <button class="btn btn-link mt-1" @click="findAuthor(item.followId.id,item.followId.first_name,item.followId.last_name)" >
                        پروفایل {{item.followId.first_name+' '+item.followId.last_name}}
                    </button>

                    <div class="row pt-2">
                        <div v-if="author & author.visit_type=='b' || 'c'" class="col">
                            <div v-if="author && time( author )" >
                                <button v-if="numbers.length" @click="(this.$store.state.file=this.item)" type="button"
                                 class="btn btn-sm btn-success redu20" data-toggle="modal" data-target="#callModal">مشاوره تلفنی</button>
    
                                <a v-else href="#" @click="call(item.followId.id,meUnmber)" class="btn btn-sm btn-success redu20">مشاوره تلفنی</a>
                            </div>
    
                            <div v-else class="btn btn-sm btn-danger redu20" >مشاوره تلفنی</div>
                        </div>
    
                        <div v-if="author && author.visit_type=='b' || 'm'" class="col">
                            <router-link class="btn btn-sm btn-primary redu20" :to="{ name: 'ShowConnection', params: { id: item.followId.id, requestUser: item.requestUser } }" >
                                مشاوره متنی
                            </router-link>
                        </div>
                    </div>
                    
                </div>
                <!-- is_user -> not author -->
                <div v-else class="col mt-3">
                    <h6 class="mb-3">{{ `${item.followId.first_name} ${item.followId.last_name || 'نام کاربر واردنشده'}`}}</h6>
                    <div v-if="item.followId.first_name && item.followId.last_name" >
                        <router-link :to="{ name: 'ShowConnection', params: { id: item.followId.id, requestUser: item.requestUser } }" class="btn btn-sm btn-primary redu20">
                            <span class="text-success" v-if="item.followId.first_name=='علی' && item.followId.last_name=='ناییج'">
                                مدیر گوش شنوا
                            </span>
                            <span v-else class="text-white">کاربر درخواست کننده</span>
                        </router-link>
                    </div>
                    <router-link v-else :to="{ name: 'ShowConnection', params: { id: item.followId.id, requestUser: item.requestUser } }" class="btn btn-sm btn-primary redu20">کاربر درخواست کننده</router-link>
                    <!-- <div class="d-lg-none">
                        <div class="float-right redu20 shadow text-light p-lg-1 pr-2 pr-lg-3 ml-2 ml-lg-3 mt-0 mt-lg-3 small">{{counter}} جدید</div>
                        <div v-if="item.followId.first_name && item.followId.last_name"  class="pt-lg-4">
                            <router-link class="text-light" :to="{ name: 'ShowConnection', params: { id: item.followId.id, requestUser: item.requestUser } }" >
                                <span class="text-success" v-if="item.followId.first_name=='علی' && item.followId.last_name=='ناییج'">
                                    مدیر گوش شنوا
                                </span>
                                <span class="text-light" v-else>مشاورات داده شده به {{item.followId.first_name+' '+item.followId.last_name}}</span>
                            </router-link>
                        </div>
                        <router-link v-else class="text-light" :to="{ name: 'ShowConnection', params: { id: item.followId.id, requestUser: item.requestUser } }" ><br>مشاورات داده شده به این شخض</router-link>
                    </div> -->
                </div>
            </div>
        </div>
    </div>

    <div class="modal text-dark" id="callModal">
        <div class="modal-dialog mt-5 text-center">
            <div class="modal-content">
            <div class="p-3 bg-violet text-light" v-if="$store.state.file.followId">
                <h5 class="text-right m-2 ">تماس با {{String([$store.state.file.followId.first_name,$store.state.file.followId.last_name].join(' '))}}</h5>
            </div>
            <div class="modal-body">
                <div class="m-3"><button class="btn text-light btn-block" style="background-color: #3c0b64;" @click="this.number=this.meUnmber">استفاده از شماره : {{meUnmber}}</button></div>
                <div v-if="numbers.length" class="pr-3 pl-3">
                    <div v-for="num in numbers" :key="num.id">
                        <button class="btn text-light btn-block mb-3" style="background-color: #3c0b64;" @click="this.number=num.number">استفاده از شماره : {{num.subject}}</button>
                    </div>
                </div>
                <h6 v-if="number">تماس از شماره <span>{{String(number)}}</span></h6>
                <h6 v-else>یک شماره انتخاب کنید</h6>
            </div>

            <div class="modal-footer row" v-if="$store.state.file.userId">
                <div class="col text-left"><button type="button" class="btn btn-danger" data-dismiss="modal">انصراف</button></div>
                <div class="col text-right">
                    <button class="btn text-light" style="background-color: #3c0b64;" disabled v-if="!number">مشاوره تلفنی</button>
                    <button @click="call($store.state.file.followId.id,String(number))" class="btn text-light" style="background-color: #3c0b64;" v-else>مشاوره تلفنی</button>
                </div>
            </div>

            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'HeadMessage',
    props: {
        item: null,
        author: null
    },
    data() {
        return {
            user: '',
            myUser: '',
            today: '',
            counter: 0,
            meUnmber: '',
            numbers: '',
            number: null,
        }
    },
    methods: {
        time(item) {
            switch (new Date().getDay()) {
                case 0:
                    this.today = item.twoDay
                break;
                case 1:
                    this.today = item.treeDay
                break;
                case 2:
                    this.today = item.fourDay
                break;
                case 3:
                    this.today = item.fiveDay
                break;
                case 4:
                    this.today = item.sixDay
                break;
                case 5:
                    this.today = item.sevenDay
                break;
                case 6:
                    this.today = item.oneDay
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

            if (this.author.services) {
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
            }
                
            return false
        },
        findAuthor(id,first_name,last_name) {
            axios.get(`createauthor?userId=${id}`).then(response => this.$router.push(`/profile/${response.data.results[0].id}/${first_name}${last_name}`))
        },
        call(userId,mobile) {
            axios.post('call_create/', {"userNember": mobile, "userIdAuthor": userId})
            .then(response => alert("وضعیت مکالمه : "+response.data.type+" موجودی اولیه : "+response.data.FirstCredit+" هزینه هر دقیقه مشاوره : "+response.data.AmountPerMin) )
            .catch(e => alert(e.response.data.msg) )
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
    mounted() {
        axios.get('/api/auth/users/me/')
        .then(response => {
            this.myUser = response.data.id
            this.meUnmber = response.data.username
        })
        axios.post('newestFromUserMessage/', {userId: this.item.followId.id}).then(response => this.counter = response.data.messageNotSee )
        axios.get('numbers/').then(response => { if (response.data.results.length) { this.numbers = response.data.results } })
    },
}
</script>
