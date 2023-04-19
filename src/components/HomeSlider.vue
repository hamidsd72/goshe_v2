<template>
    <div class="col-lg-4 my-1">
        <!-- <img :src="img" alt="logo" class="rounded img"> -->
        <img :src="require('@/assets/'+img)" alt="logo" class="redu20 img">
    </div>
</template>

<script>
    export default {
        name: 'HomeSlider',
        props: {
            img: {
                type: String,
                required: false,
                default: require('@/assets/logo.png'),
            }
        }
    }
</script>
