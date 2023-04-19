<template>
    <div class="exam text-dark container pt-lg-5">
        <div class="bg-white p-3 rounded border row">
            <h4 class="col text-right">آزمون های من</h4>
            <div class="col-auto" v-if="doctor"><router-link v-if="doctor.id==$route.params.id" to="/exam/create" class="btn btn-success">ایجاد آزمون</router-link></div>

            <div class="col-12 pt-4">
                <div v-if="items.length">
                    <div v-for="item in items" :key="item.id" class="text-right row rounded bg-light mb-2 py-lg-3">
                        <div class="col my-auto">
                            <h6>{{ item.name }}</h6>
                            <p class="m-0">
                                {{ `${showCountUsersExam(item.id)[0]} شرکت کننده ` }}
                                <span v-if="showCountUsersExam(item.id)[1] > 0" class="bg-warning rounded px-2">{{ `${showCountUsersExam(item.id)[1]} در انتظار پاسخ` }}</span>
                            </p>
                        </div>
                        <div class="col-auto" v-if="doctor && doctor.id==$route.params.id">
                            <button v-if="showCountUsersExam(item.id)[1] > 0" class="btn btn-info ml-3" data-toggle="modal" data-target="#usersExamList">لیست شرکت کنندگان</button>
                            <router-link :to="`/exam/${item.id}/${item.name}`" class="btn btn-primary">مدیریت آزمون</router-link>
                        </div>
                        <div class="col-auto" v-else>
                            <router-link :to="`/exam/visit/${item.id}/${item.slug}`" class="btn btn-info">نمایش آزمون</router-link>
                        </div>
                    </div>
                </div>
                <div v-else class="text-center text-danger h6">
                    آزمونی یافت نشد
                </div>
            </div>
            
            <!-- Modal -->
            <div class="modal fade" id="usersExamList" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog mt-5">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">نمایش آزمون کاربران</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            </button>
                        </div>
                        <div class="modal-body">
                            <div v-for="userExam in usersExam" :key="userExam.id">
                                <div class="text-right rounded" v-if="userExam.authorAnswer===null || userExam.authorAnswer==''">
                                    <div class="float-left">
                                        <button class="btn btn-info" v-if="userExam.examId" @click="goToUsersExam(userExam.examId.id, userExam.examId.slug, userExam.userId.id)">نمایش آزمون</button>
                                    </div>
                                    <p class="m-0" v-if="userExam.userId.first_name || userExam.userId.last_name">{{ userExam.userId.first_name+' '+userExam.userId.last_name }}</p>
                                    <p class="m-0" v-else>نام کاربر وارد نشده</p>
                                    <hr>
                                </div>
                            </div>
                            <div class="text-right">
                                <button type="button" class="btn btn-secondary mx-3" data-dismiss="modal" id="modalClose">انصراف</button>
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
export default {
    name: 'ExamIndex',
    components: {
    },
    data() {
        return {
            usersExam: null,
            doctor: null,
            price:  0,
            subject: '',
            items: {},
            next: null,
            previous: null,
        }
    },
    mounted() {
        axios.get('/api/auth/users/me/')
        .then(response => {
        
            axios.get(`/userauthor/?userId=${response.data.id}`)
            .then(response => {
                this.doctor = response.data.results[0]

                axios.get(`/users/exam?authorId=${response.data.results[0].id}`)
                .then(response => {
                    if (response.data.results.length) {
                        this.usersExam  = response.data.results
                    }
                })
                .catch(e => console.log(e.response))
            })
            .catch(e => console.log(e.response))

        })
        .catch(e => console.log(e.response.data))

        axios.get(`exam?authorId=${this.$route.params.id}`)
        .then(response => {
            this.items      = response.data.results
            this.next       = response.data.next
            this.previous   = response.data.previous
        })
        .catch(e => console.log(e.response.data))
        .finally(() => this.$store.state.runAnimation = false )

    },
    methods: {
        showCountUsersExam(id) {
            let count   = 0
            let answer  = 0
            if (this.usersExam) {
                this.usersExam.forEach(element => {
                    if(element.examId.id===id) {
                        if(element.authorAnswer===null) {
                            answer += 1
                        }
                        count += 1
                    }
                });
            }
            count   = count>0 ? count : 'بدون'
            return [count, answer]
        },
        goToUsersExam(examId, slug, userId) {
            document.querySelector('#modalClose').click()
            this.$router.push(`/users/exam/visit/${examId}/${slug}/${userId}`)
        },
    },
}
</script>


