<template>
    <div class="exam exam_show text-dark container pt-lg-5">
        <div class="bg-white p-3 rounded border row" v-if="exam">
            <h4 class="col-12 text-right">{{ exam.name }}</h4>
            <h6 class="col-12 text-right">{{ `${num2fa(items.length)} سوال دارد` }}</h6>
            <div class="col-12 pt-3" v-if="active">
                <div v-for="item in items" :key="item.id" class="text-right row rounded bg-light mb-2 py-lg-3">
                    <div class="col-lg-auto my-auto text-center">
                        <a :href="item.baner" target="_blank" rel="noopener noreferrer">
                            <img :src="item.baner" alt="baner" style="height: 100px">
                        </a>
                    </div>
                    <div class="col-lg pt-2 pt-lg-0">
                        <h6>{{ item.question }}</h6>
                        <div v-if="!item.answer">
                            <div v-if="myExam.authorAnswer===null">
                                <div class="row my-4" :id="`answer${item.id}`" v-if="item.type">
                                    <div class="col-lg" v-if="item.optionA !=''">
                                        <button class="btn btn-sm btn-info btn-block" :class="`optionA${item.id}`" @click="setAnswer(item.id,item.optionA,'optionA')">{{ item.optionA }}</button>
                                    </div>
                                    <div class="col-lg" v-if="item.optionB !=''">
                                        <button class="btn btn-sm btn-info btn-block" :class="`optionB${item.id}`" @click="setAnswer(item.id,item.optionB,'optionB')">{{ item.optionB }}</button>
                                    </div>
                                    <div class="col-lg" v-if="item.optionC !=''">
                                        <button class="btn btn-sm btn-info btn-block" :class="`optionC${item.id}`" @click="setAnswer(item.id,item.optionC,'optionC')">{{ item.optionC }}</button>
                                    </div>
                                    <div class="col-lg" v-if="item.optionD !=''">
                                        <button class="btn btn-sm btn-info btn-block" :class="`optionD${item.id}`" @click="setAnswer(item.id,item.optionD,'optionD')">{{ item.optionD }}</button>
                                    </div>
                                    <div class="col-12">
                                        <textarea :class="`answer${item.id}`" rows="3" class="form-control d-none"></textarea>
                                        <button :id="`btn${item.id}`" class="btn btn-outline-success mt-3 d-none" @click="sendAnswer(item.id)">تایید پاسخ</button>
                                    </div>
                                </div>
    
                                <div v-else :id="`answer${item.id}`">
                                    <textarea :class="`answer${item.id}`" rows="3" class="form-control" v-on:keyup="setTextAnswer(item.id)"></textarea>
                                    <button :id="`btn${item.id}`" class="btn btn-outline-success mt-3 d-none" @click="sendAnswer(item.id)">تایید پاسخ</button>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <p class="my-3">{{ item.answer }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12 text-right pt-4" v-if="exam">
                <div v-if="myExam">
                    <p class="my-3">{{ myExam.authorAnswer }}</p>
                    <div v-if="!active">
                        <!-- پرداخت -->
                        <div v-if="this.$store.state.amount">
                            <button class="btn btn-outline-success" v-if="this.$store.state.amount >= exam.amount" @click="payJoinedExam()">پرداخت و ثبت پاسخ</button>
                            <div v-else>
                                <p class="my-3">موجودی جهت شرکت در آزمون کافی نیست</p>
                                <router-link to="/transaction/create" class="btn btn-outline-info">افزایش موجودی</router-link>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <button class="btn btn-outline-success" @click="joinToExam()">شرکت در آزمون</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'ExamShow',
    components: {
    },
    data() {
        return {
            items: {},
            answer: false,
            myExam: null,
            exam: null,
            active: false,
            answersList: null,
        }
    },
    mounted() {
        axios.get(`question?examId=${this.$route.params.id}`)
        .then(response => {
            this.items      = response.data.results
            this.next       = response.data.next
            this.previous   = response.data.previous
            
            axios.get(`visit/exam?examId=${this.$route.params.id}`)
            .then(response => {
            if (response.data.results.length) {
                this.myExam = response.data.results[0]
                    if (response.data.results[0].active===true) {
                        this.active = true
                    }
                }
            })
            .catch(e => console.log(e.response.data))

            axios.get(`exam?slug=${this.$route.params.slug}`)
            .then(response => {
                this.exam = response.data.results[0]
            })
            .catch(e => console.log(e.response.data))
            
            axios.post(`answer/question/visit/exam`, {examId: this.$route.params.id})
            .then(response => {
                if (response.data.length) {
                    this.answersList = response.data
                    response.data.forEach(answer => {
                        this.items.forEach( (question, index) => {
                            if(answer.questionId === question.id) {
                                this.items[index].answer    = answer.answer
                            }
                        });
                    });
                }
            })
            .catch(e => console.log(e.response.data))
        })
        .catch(e => console.log(e.response.data))
        .finally(() => this.$store.state.runAnimation = false)

    },
    methods: {
        sendAnswer(id) {
            let examId  = this.$route.params.id
            let answer  = document.querySelector(`.answer${id}`).value
            if (answer.length > 0) {
                document.querySelector(`#btn${id}`).classList.add('d-none')
                this.$store.state.runAnimation = true
                axios.post('/answer/visit/new/', {
                    examId:     examId,
                    questionId: id,
                    answer:     answer
                })
                .then(response => {
                    console.log(response.data)
                })
                .catch(e => {
                    alert(e.response.data.error)
                    console.log(e.response.data)
                })
                .finally(() => this.$store.state.runAnimation = false )
            } else {
                alert('پاسخ این سوال وارد نشده')
            }
        },
        payJoinedExam() {
            this.$store.state.runAnimation = true
            let examId  = this.$route.params.id
            axios.post('/payment-exam/', {
                examId:     examId,
                questionId: this.myExam.id
            })
            .then(response => {
                if(response.data.amount) {
                    this.active = true
                }
                console.log(response.data)
            })
            .catch(e => {
                alert(e.response.data.error)
                console.log(e.response.data)
            })
            .finally(() => this.$store.state.runAnimation = false )
        },
        joinToExam() {
            axios.get('/api/auth/users/me/')
            .then(response => {
                this.$store.state.runAnimation = true
                let userId  = response.data.id
                let examId  = this.$route.params.id
                axios.post('/create/visit/exam/', {
                    examId: examId,
                    userId: userId,
                })
                .then(response => {
                    this.myExam = response.data
                })
                .catch(e => console.log(e.response.status, e.response.data))
            })
            .catch(e => console.log(e.response.status, e.response.data))
            .finally(() => this.$store.state.runAnimation = false )
        },
        setTextAnswer(id) {
            let answer  = document.querySelector(`.answer${id}`).value;
            if (answer.length > 0) {
                document.querySelector(`#btn${id}`).classList.remove('d-none')
            } else {
                document.querySelector(`#btn${id}`).classList.add('d-none')
            }
            // let answers     = document.querySelectorAll('.answer');
            // this.answer     = true;
            // answers.forEach( element => {
            //     if ( element.value==='' ) {
            //         this.answer = false;
            //     }
            // });


            // if (this.answerList.length) {
            //     this.answerList.forEach( (element, index) => {
            //         if(element.id === id) {
            //             this.answerList.splice(index, 1)
            //         }
            //     });
            // }
            // this.answerList.push({id: id , answer: document.querySelector(`#answer${id}`).value })
        },
        setAnswer( id , answer , className) {
            let optionAItem = document.querySelector(`.optionA${id}`)
            let optionBItem = document.querySelector(`.optionB${id}`)
            let optionCItem = document.querySelector(`.optionC${id}`)
            let optionDItem = document.querySelector(`.optionD${id}`)
            optionAItem.classList.remove('btn-success')
            optionBItem.classList.remove('btn-success')
            optionCItem.classList.remove('btn-success')
            optionDItem.classList.remove('btn-success')

            optionAItem.classList.add('btn-info')
            optionBItem.classList.add('btn-info')
            optionCItem.classList.add('btn-info')
            optionDItem.classList.add('btn-info')

            let selectedBtn = document.querySelector(`.${className}${id}`)
            selectedBtn.classList.remove('btn-info')
            selectedBtn.classList.add('btn-success')

            document.querySelector(`.answer${id}`).value    = answer
            document.querySelector(`#btn${id}`).classList.remove('d-none')

            // if (this.answerList.length) {
            //     this.answerList.forEach( (element, index) => {
            //         if(element.id === id) {
            //             this.answerList.splice(index, 1)
            //         }
            //     });
            // }

            // this.answerList.push({id: id , answer: answer})

            // let answers2    = document.querySelectorAll('.answer');
            // this.answer     = true;
            // answers2.forEach( element => {
            //     if ( element.value==='' ) {
            //         this.answer = false;
            //     }
            // });
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
