<template>
    <div class="visit text-dark container pt-lg-5">

        <div v-if="alert" id="alert_msg" class="row mb-2 py-3 bg-success text-light">
            <div class="col-2 col-lg-1 p-0">
                <button class="close" style="float: unset !important;" @click="this.alert = !alert">&times;</button>
            </div>
            <div class="col p-0 text-center">
                <h6 class="m-0 p-0">درخواست نوبت ثبت شد</h6>
            </div>
        </div>
        
        <div class="bg-white p-3 rounded border row">
            <h4 class="col text-right">نوبت های ۷ روز آینده</h4>
            <div class="col-auto">
                <button class="btn btn-success" data-toggle="modal" data-target="#usersExamList">رزرو نوبت مشاوره</button>
            </div>

            <div class="col-12 pt-4">
                <div class="row" v-if="items.length">
                        
                    <div v-for="t in items" :key="t.id" class="col-md-6 col-lg-4 col-xl-3 mb-3">
                        <div class="card">
                            <div class="card-header" :class="t.active ? 'text-success' : 'text-warning'">{{t.active ? 'تایید شده' : 'در انتظار تایید'}}</div>
                            <div class="card-body p-1 p-lg-2" >{{t.jpublish}}</div>
                        </div>
                    </div>

                </div>
                <div v-else class="text-center text-danger h6">
                    نوبت رزرو شده ای ندارد
                </div>
            </div>
            
            <!-- Modal -->
            <div class="modal fade" id="usersExamList" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog mt-5">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">رزرو نوبت</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="p-2 col-lg-6 text-right">
                                <label for="visitTime">زمان را انتخاب کنید</label>
                                <date-picker type="datetime" v-model="visitTime" format="YYYY-MM-DD HH:mm" display-format="jYYYY-jMM-jDD"/>
                            </div>
                            <div class="p-2 col-lg-6 text-right" v-if="user">
                                <label for="number">شماره را انتخاب کنید</label>
                                <select v-model="callNumber" class="form-control">
                                    <option :value="user.username" :key="user.username" >{{user.username}}</option>
                                    <option v-for="number in numbers" :value="number.number" :key="number.number" >{{number.number}}</option>
                                </select>
                            </div>

                            <div class="pt-3 row">
                                <div class="col-auto">
                                    <button type="button" class="btn btn-success" @click="getVisit()">ثبت شود</button>
                                </div>
                                <div class="col-auto">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal" id="modalClose123">انصراف</button>
                                </div>
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
import DatePicker from 'vue3-persian-datetime-picker'

export default {
    name: 'visitIndex',
    components: {
        DatePicker,
    },
    data() {
        return {
            user: null,
            visitTime: null,
            numbers: null,
            items: {},
            next: null,
            previous: null,
            callNumber: null,
            alert: false,
        }
    },
    mounted() {
        axios.get('/api/auth/users/me/')
        .then(response => {
            this.user   = response.data
            this.callNumber = response.data.username    
            axios.get(`author-shift-list?authorId=${this.$route.params.id}&myDate=7`)
            .then(response => {
                this.items      = response.data.results
                this.next       = response.data.next
                this.previous   = response.data.previous
            })
            .catch(e => console.log(e.response.data))

            axios.get('numbers/')
            .then(response => {
                if (response.data.results.length) { this.numbers = response.data.results }
            })
        })
        .catch(e => console.log(e.response.data))
        .finally(() => this.$store.state.runAnimation = false )

    },
    methods: {
        getVisit() {
            if (this.visitTime === null || this.callNumber === null) {
                alert('ابتدا زمان و شماره تماس را وارد کنید')
            } else {
                document.querySelector('#modalClose123').click();
                
                this.alert  = false;
                axios.get(`author/${this.$route.params.id}`)
                .then(response => {
                    axios.post('user-register-shift-using-author/',{
                        AuthorId:       this.$route.params.id,
                        AuthorUserId:   response.data.userId.id,
                        userId:         this.user.id,
                        number:         this.callNumber,
                        visitTime:      this.visitTime
                    })
                    .then(response => {
                        if (response.status==201) {
                            axios.get(`author-shift-list?authorId=${this.$route.params.id}&myDate=7`)
                            .then(response => {
                                this.items      = response.data.results
                                this.next       = response.data.next
                                this.previous   = response.data.previous
                                this.alert      = true;
                            })
                            .catch(e => console.log(e.response.data))
                        }
                    })
                    .catch(e => console.log(e.response.data))
                })
                .catch(e => console.log(e.response.data))

            }
        },
    },
}
</script>


