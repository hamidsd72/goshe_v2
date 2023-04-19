<template>
  <div class="questions pt-lg-4 my-3 container">
    
    <h5 class="text-right black"><span class="text-dark">سوالات متداول</span> کاربران</h5>
    <p>لطفا سوالات زیر را بخوانید و اگر پاسخ خودتان را پیدا نکردید، با ما در ارتباط باشید</p>
    
    <div class="my-3">
        <button class="btn redu20 mx-2" :class="table ? 'btn-dark' : 'btn-info'" @click="this.table=true">پرسش های متداول مشاوران</button>
        <button class="btn redu20 mx-2" :class="table ? 'btn-info' : 'btn-dark'" @click="this.table=false">پرسش های متداول کاربران</button>
    </div>

    <div v-if="table" id="accordion" class="text-right">

        <div class="card mb-0">
            <a class="card-link" data-toggle="collapse" href="#collapseOne">
            <div class="card-header h6">
چطور میتوانم به عنوان پزشک یا مشاور در گوش شنوا مشاوره دهم
            </div>
            </a>
            <div id="collapseOne" class="collapse show" data-parent="#accordion">
            <div class="card-body">
عضویت شما در گوش شنوا مستلزم تایید صلاحیت و مدارک شماست. در صورتی که عضو سازمان نظام پزشکی و یا سازمان نظام روانشناسی هستید میتوانید از طریق صفحه ثبت نام، اطلاعاتتان را ثبت کنید تا با شما تماس گرفته شود            </div>
            </div>
        </div>

        <div class="card mb-0">
            <a class="collapsed card-link" data-toggle="collapse" href="#collapseTwo">
            <div class="card-header h6">
آیا شماره تلفن ما در معرض دید کاربر قرار می گیرد
            </div>
            </a>
            <div id="collapseTwo" class="collapse" data-parent="#accordion">
            <div class="card-body">
خیر، گوش شنوا با حفظ حریم شخصی به عنوان واسط بین کاربر و مشاور دهنده تماس ها را برقرار می کند. شماره شما نزد گوش شنوا محفوظ است و مشاور نیز به هیچ عنوان حق دادن شماره شخصی خود را ندارد            </div>
            </div>
        </div>

        <div class="card mb-0">
            <a class="collapsed card-link" data-toggle="collapse" href="#collapseThree">
            <div class="card-header h6">
آیا امکان این وجود دارد که هر ساعتی که خواستیم در دسترس باشیم
            </div>
            </a>
            <div id="collapseThree" class="collapse" data-parent="#accordion">
            <div class="card-body">
بله. در ابتدای روند عضویت در گوش شنوا روزها و ساعاتی که می توانید پاسخگو و در دسترس باشید را اعلام می کنید            </div>
            </div>
        </div>

        <div class="card mb-0">
            <a class="collapsed card-link" data-toggle="collapse" href="#collapseFour">
            <div class="card-header h6">
آیا می توانیم در وضعیت اضطراری خود را از دسترس خارج کنیم و یا در دسترس باشیم
            </div>
            </a>
            <div id="collapseFour" class="collapse" data-parent="#accordion">
            <div class="card-body">
بله . تغییر وضعیت شما از حالت آنلاین به آفلاین به سادگی امکان پذیر است            </div>
            </div>
        </div>

        <div class="card mb-0">
            <a class="collapsed card-link" data-toggle="collapse" href="#collapseFive">
            <div class="card-header h6">
آیا امکان حذف پروفایل پزشک؟ مشاور روانشناس بعد از ثبت نام وجود دارد
            </div>
            </a>
            <div id="collapseFive" class="collapse" data-parent="#accordion">
            <div class="card-body">
بله، در هر زمان که بخواهید می توانید با اعلام به اگوش شنوا پروفایل خود را حذف کنید</div>
            </div>
        </div>

        <div class="card mb-0">
            <a class="collapsed card-link" data-toggle="collapse" href="#collapseSix">
            <div class="card-header h6">
آیا عضویت در گوش شنوا برای پزشک/مشاور روانشناس هزینه ای دارد
            </div>
            </a>
            <div id="collapseSix" class="collapse" data-parent="#accordion">
            <div class="card-body">
خیر، عضویت به عنوان پزشک و مشاور روانشناس در این مجموعه رایگان است</div>
            </div>
        </div>

    </div>

    <div v-else id="accordion" class="text-right">
            
        <div class="card mb-0">
            <a class="card-link" data-toggle="collapse" href="#collapseOne">
            <div class="card-header h6">
                آیا برای دانلود و نصب گوش شنوا باید هزینه‌ای پرداخت کنم؟
            </div>
            </a>
            <div id="collapseOne" class="collapse show" data-parent="#accordion">
            <div class="card-body">
                خیر. دانلود، نصب و به روز رسانی گوش شنوا رایگان است ولی برای مشاوره‌ پزشکی و مشاوره روانشناسی باید حق مشاوره را پرداخت کنید
            </div>
            </div>
        </div>

        <div class="card mb-0">
            <a class="collapsed card-link" data-toggle="collapse" href="#collapseTwo">
            <div class="card-header h6">
                آیا هزینه برقراری تماس تلفنی هم برای من محسوب می‌شود؟ آیا باید هزینه‌ تماس را روی قبض تلفن خود بپردازم؟
            </div>
            </a>
            <div id="collapseTwo" class="collapse" data-parent="#accordion">
            <div class="card-body">
                خیر. پس از زدن دکمه تماس توسط شما گوش شنوا بلافاصله با تلفن همراهتان تماس می‌گیرد و شما را به مشاور مورد نظر متصل می‌کند.
                 بنابراین، برای مشاوره تلفنی گرفتن، گوش شنوا با شماره تلفن شما تماس می‌گیرد و هزینه تماس‌ برقرار شده توسط گوش شنوا 
                پرداخت می‌شود و کاربران تنها حق مشاوره را می‌پردازند. بنابراین هیچ هزینه ای در قبض تلفن کاربران و مشاوران منظور نمی‌شود
            </div>
            </div>
        </div>

        <div class="card mb-0">
            <a class="collapsed card-link" data-toggle="collapse" href="#collapseThree">
            <div class="card-header h6">
                نمی دانم برای مشاوره با چه پزشک / روانشناسی باید صحبت کنم؟
            </div>
            </a>
            <div id="collapseThree" class="collapse" data-parent="#accordion">
            <div class="card-body">
                در صورتی که در انتخاب مشاور خود تردید دارید، می توانید
                 توضیحات پروفایل پزشکان و مشاوران گوش شنوا را مطالعه کنید. نظرات دیگر کاربران می تواند به شما در انتخاب مشاور کمک کند
            </div>
            </div>
        </div>

        <div class="card mb-0">
            <a class="collapsed card-link" data-toggle="collapse" href="#collapseFour">
            <div class="card-header h6">
                در صورت بروز مشکل در نصب و استفاده از گوش شنوا باید چه کاری انجام بدهم؟
            </div>
            </a>
            <div id="collapseFour" class="collapse" data-parent="#accordion">
            <div class="card-body">
                در صورت بروز هرگونه مشکل می‌توانید با شماره تلفن پشتیبانی گوش شنوا 02162999042 تماس بگیرید
            </div>
            </div>
        </div>

    </div> 

  </div>
</template>

<script>
export default {
    name: 'QuestionPage',
    mounted() {
        this.$store.state.filter = false
        this.$store.state.runAnimation = false
    },
    data() {
        return {
            table: false
        }
    },
}
</script>