<template>
    <div class="logs row">
        <div class="col-12 mb-5 h5 ">جمع ۴۸٪ مبلغ تماس های مشاوران</div>
            
        <div v-if="logs.call" class="col-lg"><div class="bg-white text-dark border shadow redu20 p-3 p-lg-5 h5">امروز {{ parseInt( ( logs.call.today * 48 ) / 1000 ) }} تومان</div></div>
        <div v-if="logs.call" class="col-lg"><div class="bg-white text-dark border shadow redu20 p-3 p-lg-5 h5">هفته {{ parseInt( ( logs.call.week * 48 ) / 1000 ) }} تومان</div></div>
        <div v-if="logs.call" class="col-lg"><div class="bg-white text-dark border shadow redu20 p-3 p-lg-5 h5">ماه {{ parseInt( ( logs.call.month * 48 ) / 1000 ) }} تومان</div></div>
        <div v-if="logs.call" class="col-lg"><div class="bg-white text-dark border shadow redu20 p-3 p-lg-5 h5">سال {{ parseInt( ( logs.call.year * 48 ) / 1000 ) }} تومان</div></div>

        <div class="col-12 mb-5 mt-4 h5 ">جمع مبلغ پیام های مشاوران</div>

        <div v-if="logs.message" class="col-lg"><div class="bg-white text-dark border shadow redu20 p-3 p-lg-5 h5">امروز {{ logs.message.today || 0 }} تومان</div></div>
        <div v-if="logs.message" class="col-lg"><div class="bg-white text-dark border shadow redu20 p-3 p-lg-5 h5">هفته {{ logs.message.week || 0 }} تومان</div></div>
        <div v-if="logs.message" class="col-lg"><div class="bg-white text-dark border shadow redu20 p-3 p-lg-5 h5">ماه {{ logs.message.month || 0 }} تومان</div></div>
        <div v-if="logs.message" class="col-lg"><div class="bg-white text-dark border shadow redu20 p-3 p-lg-5 h5">سال {{ logs.message.year || 0 }} تومان</div></div>

        <div class="col-12 mb-5 mt-4 h5 ">جمع مبلغ پرداختی به مشاوران</div>

        <div v-if="logs.revenue" class="col-lg"><div class="bg-white text-dark border shadow redu20 p-3 p-lg-5 h5">امروز {{ logs.revenue.today || 0 }} تومان</div></div>
        <div v-if="logs.revenue" class="col-lg"><div class="bg-white text-dark border shadow redu20 p-3 p-lg-5 h5">هفته {{ logs.revenue.week || 0 }} تومان</div></div>
        <div v-if="logs.revenue" class="col-lg"><div class="bg-white text-dark border shadow redu20 p-3 p-lg-5 h5">ماه {{ logs.revenue.month || 0 }} تومان</div></div>
        <div v-if="logs.revenue" class="col-lg"><div class="bg-white text-dark border shadow redu20 p-3 p-lg-5 h5">سال {{ logs.revenue.year || 0 }} تومان</div></div>

        <div class="col-12 mb-5 mt-4 h5 ">جمع مبلغ خرید های کاربران</div>
        
        <div v-if="logs.buy" class="col-lg"><div class="bg-white text-dark border shadow redu20 p-3 p-lg-5 h5">امروز {{ logs.buy.today / 10 }} تومان</div></div>
        <div v-if="logs.buy" class="col-lg"><div class="bg-white text-dark border shadow redu20 p-3 p-lg-5 h5">هفته {{ logs.buy.week / 10 }} تومان</div></div>
        <div v-if="logs.buy" class="col-lg"><div class="bg-white text-dark border shadow redu20 p-3 p-lg-5 h5">ماه {{ logs.buy.month / 10 }} تومان</div></div>
        <div v-if="logs.buy" class="col-lg"><div class="bg-white text-dark border shadow redu20 p-3 p-lg-5 h5">سال {{ logs.buy.year / 10 }} تومان</div></div>

        <div class="col-12 mb-5 mt-4 h5 ">جمع مبلغ هدیه به کاربران</div>
        
        <div v-if="logs.gift" class="col-lg"><div class="bg-white text-dark border shadow redu20 p-3 p-lg-5 h5">امروز {{ logs.gift.today || 0 }} تومان</div></div>
        <div v-if="logs.gift" class="col-lg"><div class="bg-white text-dark border shadow redu20 p-3 p-lg-5 h5">هفته {{ logs.gift.week || 0 }} تومان</div></div>
        <div v-if="logs.gift" class="col-lg"><div class="bg-white text-dark border shadow redu20 p-3 p-lg-5 h5">ماه {{ logs.gift.month || 0 }} تومان</div></div>
        <div v-if="logs.gift" class="col-lg"><div class="bg-white text-dark border shadow redu20 p-3 p-lg-5 h5">سال {{ logs.gift.year || 0 }} تومان</div></div>
        
    </div>
</template>

<script>
    export default {
        name: 'LogPage',
        props: {
            logs: null
        }
    }
</script>
