<template>
    <div class="exam exam_create text-dark container pt-lg-5">
        <div class="bg-white p-3 rounded border row">
            <h4 class="col-12 text-right">ایجاد آزمون جدید</h4>
            <p class="col-12 text-right pb-4">لطفا برای ایجاد آزمون عنوان و مبلغ پرداختی را وارد کنید</p>
        
            <div class="col-lg-6 text-right">
                <label for="name">عنوان آزمون (الزامی) </label>
                <input type="text" v-model="name" class="form-control" placeholder="آزمون تست هوش">
            </div>
            <div class="col-lg-6 text-right">
                <label for="amount">هزینه شرکت در آزمون (الزامی) تومان </label>
                <input type="number" v-model="amount" class="form-control" placeholder="5000">
            </div>
            
            <div class="col-12 text-right py-4">
                <button v-if="name==='' || amount < 1" class="btn btn-outline-secondary" disabled>ثبت آزمون</button>
                <button v-else class="btn btn-outline-success" @click="createExam()">ثبت آزمون</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'ExamCreate',
    components: {
    },
    data() {
        return {
            user: null,
            doctor: null,
            amount:  0,
            name: '',
        }
    },
    mounted() {
        axios.get('/api/auth/users/me/')
        .then(response => {
            this.user = response.data

            axios.get(`/userauthor/?userId=${response.data.id}`)
            .then(response => this.doctor = response.data.results[0])
            .catch(e => console.log(e.response.data))

        })
        .catch(e => console.log(e.response.data))
        .finally(() => this.$store.state.runAnimation = false )
    },
    methods: {
        createExam() {
            var currentdate = new Date(); 
            var datetime = currentdate.getFullYear()
            +''+currentdate.getMonth()
            +''+currentdate.getDay()
            +''+currentdate.getHours()
            +''+currentdate.getMinutes()
            +''+currentdate.getSeconds()

            if (this.name.length > 5) {
                this.$store.state.runAnimation = true
                const fd = new FormData();
                fd.append('amount', this.amount,)
                fd.append('authorId', this.doctor.id,)
                fd.append('name', this.name,)
                fd.append('slug', this.doctor.id+datetime,)
                fd.append('userId', this.user.id,)
                axios.post('/exam/', fd)
                .then(response => {
                    console.log(response.data)
                    this.$router.push(`/exam/${response.data.id}/${response.data.name}`)
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


