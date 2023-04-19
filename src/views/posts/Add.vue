<template>

    <div class="Add">
        <div v-if="error" class="alert alert-danger">مشگل در ارسال اطلاعات</div>
        <form class="col-lg-6 col-10 mx-auto mt-5" @submit.prevent="doAdd">
            <div class="form-group">
                <label for="subject">عنوان مقاله</label>
                <input type="text" class="form-control" name="subject" placeholder="" v-model="subject">
            </div>
            <div class="form-group">
                <label for="content">محتوا مقاله</label>
                <textarea class="form-control" name="content" rows="8" v-model="content"></textarea>
            </div>
            <div class="form-group">
                <label for="baner">تصویر برای مقاله</label>
                <input type="text" class="form-control" name="baner" placeholder="" v-model="baner">
            </div>
            <div class="form-group">
                <label for="baner">دسته بندی مقاله</label>
                <input type="text" class="form-control" name="baner" placeholder="" v-model="baner">
            </div>
            <button type="submit" class="btn btn-primary mt-3">تایید و ارسال</button>
        </form>
    </div>  

</template>

<script>
import axios from 'axios'
export default {
    name: 'Add',
    date() {
        return {
            subject: '',
            content: '',
            baner: '',
            category: '',
            error: false,
        }
    },
    methods: {
        doAdd() {
            let item = {
                title: this.message,
                slug: this.message.replaceAll(" ", "-").toLowerCase(),
                description: this.description,
                img: this.img
            }

            axios.post('/item/', item)
                .then(response => {
                    this.$router.push(`/showcategury/${item.slug}`)
                })
                .catch(e => {
                    console.log(e.response.status, e.response.data)
                    this.error  = true
                })
                
        }
    }
}
</script>
