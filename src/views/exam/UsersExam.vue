<template>
    <div class="exam text-dark container pt-lg-5">
        <div class="bg-white p-3 rounded border row" v-if="exam">
            <h4 class="col-12 text-right">{{ exam.name }}</h4>
            <h6 class="col-12 text-right">{{ `${num2fa(items.length)} سوال دارد` }}</h6>
            <div class="col-12 pt-3">
                <div v-for="item in items" :key="item.id" class="text-right row rounded bg-light mb-2 py-lg-3">
                    <div class="col-lg-auto my-auto text-center">
                        <a :href="item.baner" target="_blank" rel="noopener noreferrer">
                            <img :src="item.baner" alt="baner" style="height: 100px">
                        </a>
                    </div>
                    <div class="col-lg pt-2 pt-lg-0">
                        <h6>{{ item.question }}</h6>
                        <p class="my-3" :class="item.answer=='پاسخ داده نشده' ? 'text-danger' : ''">{{ item.answer }}</p>
                    </div>
                </div>
                <textarea rows="3" class="form-control" v-model="authorAnswer"></textarea>
                <div class="text-right">
                    <button class="btn btn-outline-success mt-3" @click="sendAnswer()">ثبت پاسخ</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'UsersExam',
    components: {
    },
    data() {
        return {
            authorId: null,
            items: {},
            exam: null,
            answersList: null,
            authorAnswer: '',
        }
    },
    mounted() {
        axios.get('/api/auth/users/me/')
        .then(response => {
        
            axios.get(`/userauthor/?userId=${response.data.id}`)
            .then(response => {
                this.authorId = response.data.results[0].id

                    axios.get(`question?examId=${this.$route.params.id}`)
                    .then(response => {
                        this.items      = response.data.results
                        this.next       = response.data.next
                        this.previous   = response.data.previous
                        
                        axios.get(`exam?slug=${this.$route.params.slug}`)
                        .then(response => {
                            this.exam = response.data.results[0]
                        })
                        .catch(e => console.log(e.response.data))
                        
                        axios.post(`answer/question/visit/exam/new`, {examId: this.$route.params.id, userId: this.$route.params.userId})
                        .then(response => {
                            if (response.data.length) {
                                this.answersList = response.data
                                response.data.forEach(answer => {
                                    this.items.forEach( (question, index) => {
                                        this.items[index].answer    = 'پاسخ داده نشده'
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
            })
            .catch(e => console.log(e.response.data))
        })
        .catch(e => console.log(e.response.data))
        .finally(() => this.$store.state.runAnimation = false)
            
    },
    methods: {
        sendAnswer() {
            if (this.authorAnswer.length > 0) {
                this.$store.state.runAnimation = true
                axios.post('/author/answer/to/visit/new/', {
                    userId: this.$route.params.userId,
                    examId: this.$route.params.id,
                    answer: this.authorAnswer
                })
                .then(response => {
                    console.log(response.data.data)
                    this.$router.push(`/exam/${this.authorId}`)
                })
                .catch(e => {
                    alert(e.response.data.error)
                    console.log(e.response.data)
                })
                .finally(() => this.$store.state.runAnimation = false )
            } else {
                alert('پاسخ وارد نشده')
            }
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
