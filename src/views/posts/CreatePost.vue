<template>
    <div class="CreatePost container pt-lg-5">
        <div class="bg-white rounded card text-right">
            <div class="card-header">
                <div class="d-none d-lg-block float-left mt-1">
                    <router-link to="/dashboard" class="btn btn-danger"><i class="fa fa-close"></i></router-link>
                </div>
                <h5 class="p-2">ارسال مقاله</h5>
            </div>
            <div class="card-body p-3 px-lg-4">
                <div class="form-group">
                    <label for="subject">عنوان مقاله</label>
                    <input type="text" class="form-control" name="subject" placeholder="" v-model="subject">
                </div>
                <div class="form-group">
                    <label for="content">محتوا مقاله</label>
                    <textarea class="form-control" name="content" rows="12" v-model="content"></textarea>
                </div>
                <div class="custom-file text-left">
                    <input type="file" class="custom-file-input " accept="image/*" @change="processFile($event)" >
                    <label class="custom-file-label " for="customFile">تصویر برای مقاله</label>
                </div>
                <button @click="sendMsg" class="btn btn-success mt-3">ارسال مقاله</button>
            </div>
        </div>
    </div> 

</template>

<script>
import axios from 'axios'
export default {
    name: 'CreatePost',
    date () {
        return {
            subject: '',
            content: '',
            attach: '',
            animations: false,
        }
    },
    mounted() {
        this.$store.state.runAnimation = false
    },
    methods: {
        processFile(event) {
            this.animations = true
            var currentdate = new Date(); 
            var datetime = currentdate.getFullYear()
            +''+currentdate.getMonth()
            +''+currentdate.getDay()
            +''+currentdate.getHours()
            +''+currentdate.getMinutes()
            +''+currentdate.getSeconds()

            let file   = event.target.files[0]
            let custom = file.slice(0, file.size);
            axios.get('api/auth/users/me/')
            .then(response => {
                axios.get(`createauthor/?userId=${response.data.id}`)
                .then(response => this.attach = new File([custom],`${response.data.results[0].id}-${datetime}-${file.name}`))
                .catch(e => console.log(e))
            })
            .catch(e => console.log(e))
        },
        sendMsg() {
            this.animations = true
            if ( this.subject && this.content && this.attach && this.subject.length > 9 && this.content.length > 99 ) {
                axios.get('api/auth/users/me/')
                .then(response => {
                    axios.get(`createauthor/?userId=${response.data.id}`)
                        .then(response => {

                        const fd = new FormData();
                        fd.append('baner', this.attach, this.attach.name,)
                        fd.append('AuthorId', response.data.results[0].id,)
                        fd.append('subject', this.subject,)
                        fd.append('category', response.data.results[0].category,)
                        fd.append('content', this.content,)
                        axios.post('post/',fd)
                        .then(response => {
                            console.log(response)
                            this.subject = ''
                            this.content = ''
                            this.attach  = ''
                            this.animations = false

                        }).catch(e => {
                            alert('مشگل در ارسال اطلاعات');
                            console.log(e.response.data)
                        })

                    }).catch(e => console.log(e))
                }).catch(e => console.log(e))
                
            } else {
                alert('عنوان مقاله حداقل ۱۰ کاراکتر و متن مقاله حداقل ۱۰۰ کاراکتر باشد و یک تصویر مناسب نیز داشته باشد')
            }    
        }
    }
}
</script>
