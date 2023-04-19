<template>
    <div class="exam exam_show text-dark container pt-lg-5">
        <div class="bg-white p-3 rounded border row">
            <h4 class="col-12 text-right">{{ item }}</h4>
        
            <div class="col-12 text-right pt-3">
                <label for="question">سوال آزمون (الزامی) </label>
                <textarea v-model="question" rows="6" class="form-control"></textarea>
            </div>

            <div class="col-md-6 col-lg-3 text-right multi_answer d-none mt-3">
                <label for="optionA">گزینه الف</label>
                <input type="text" v-model="optionA" class="form-control">
            </div>
            <div class="col-md-6 col-lg-3 text-right multi_answer d-none mt-3">
                <label for="optionB">گزینه ب</label>
                <input type="text" v-model="optionB" class="form-control">
            </div>
            <div class="col-md-6 col-lg-3 text-right multi_answer d-none mt-3">
                <label for="optionC">گزینه ج</label>
                <input type="text" v-model="optionC" class="form-control">
            </div>
            <div class="col-md-6 col-lg-3 text-right multi_answer d-none mt-3">
                <label for="optionD">گزینه د</label>
                <input type="text" v-model="optionD" class="form-control">
            </div>
            
            <div class="col-auto py-4">
                <div class="btn btn-primary btn-file">
                    قراردادن تصویر
                    <input type="file" accept="image/*" @change="processFile($event)" >
                </div>
            </div>
            <div class="col-auto py-4"><button class="btn " :class="type===true ? 'btn-success' : 'btn-secondary'" @click="multyAnswer()">آزمون چهارگزینه ای میباشد</button></div>

            <p class="text-info my-1" v-if="banerName">{{ `تصویر با نام ${banerName} اضافه شد` }}</p>

            <div class="col-12 text-right pb-4">
                <button v-if="question.length < 5" class="btn btn-outline-secondary" disabled>ثبت سوال به آزمون</button>
                <button v-else class="btn btn-outline-success" @click="createExam()">ثبت سوال به آزمون</button>
            </div>

            <div class="col-12">
                <div v-for="item in items" :key="item.id" class="text-right row rounded bg-light mb-2 py-lg-3">
                    <div class="col-lg-auto my-auto text-center">
                        <a :href="item.baner" target="_blank" rel="noopener noreferrer">
                            <img :src="item.baner" alt="baner" style="height: 100px">
                        </a>
                    </div>
                    <div class="col-lg pt-2 pt-lg-0">
                        <h6>{{ item.question }}</h6>
                        <p class="mb-2" v-if="item.optionA !=''">{{ item.optionA }}</p>
                        <p class="mb-2" v-if="item.optionB !=''">{{ item.optionB }}</p>
                        <p class="mb-2" v-if="item.optionC !=''">{{ item.optionC }}</p>
                        <p class="mb-2" v-if="item.optionD !=''">{{ item.optionD }}</p>
                    </div>
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
            item: null,
            items: {},
            question: '',
            optionA: null,
            optionB: null,
            optionC: null,
            optionD: null,
            type: false,
            baner: null,
            banerName: null,
        }
    },
    mounted() {
        axios.get(`question?examId=${this.$route.params.id}`)
        .then(response => {
            this.item       = this.$route.params.slug
            this.items      = response.data.results
            this.next       = response.data.next
            this.previous   = response.data.previous
        })
        .catch(e => console.log(e.response.data))
        .finally(() => this.$store.state.runAnimation = false )

    },
    methods: {
        categoreis(category) {
            let list = []
            for (let index = 0; index < this.cat.length; index++) {
                if ( category.includes(this.cat[index].id) ) {
                    list.push( this.cat[index].title )
                }
            }
            return list
        },
        multyAnswer() {
            let answer_boxs = document.querySelectorAll('.multi_answer')
            answer_boxs.forEach( box => {
                box.classList.toggle('d-none')
            });
            this.type   = !this.type 
        },
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
                this.baner = new File([custom],`${response.data.id}-exam${this.$route.params.id}-${datetime}-${file.name}`)
                this.banerName  = file.name
            })
            .catch(e => console.log(e.response.data))
        },
        createExam() {
            if (this.question.length > 5) {
                this.$store.state.runAnimation = true
                const fd = new FormData();
                if (this.baner) { fd.append('baner', this.baner, this.baner.name,) }
                fd.append('examId', this.$route.params.id,)
                fd.append('question', this.question,)
                fd.append('type', this.type,)
                fd.append('optionA', this.optionA,)
                fd.append('optionB', this.optionB,)
                fd.append('optionC', this.optionC,)
                fd.append('optionD', this.optionD,)
                axios.post('/question/', fd)
                .then(response => {
                    console.log(response.data, response.status)
                    location.reload(); 
                }).catch(e => {
                    this.$store.state.runAnimation = false
                    console.log(e.response.status, e.response.data)
                    alert('در ورود اطلاعات مشگلی وجود دارد')
                })
                .finally(() => this.$store.state.runAnimation = false )
            }
        }
    },

}
</script>


