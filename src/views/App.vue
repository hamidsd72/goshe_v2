<template>
  <div id="main" >
    <div id="nav">  
      <Navbar />
    </div>
    <router-view/>

    <footer class="p-5">
      <div class="row pr-lg-5 pl-lg-5 text-dark">
        <!-- desktop -->
        <div class="col-lg col-12 body d-none d-lg-block">
          <div class="p-2 mt-1 redu20">
            <h5 class="title">عضویت در خبرنامه</h5>
            <h6 class="text-light content"></h6>
          </div>
        </div>
        
        <div class="col-lg col-12 body d-none d-lg-block">
          <div class="p-2 mt-1 redu20">
            <h5 class="title">مجوزهای گوش شنوا</h5>
            <h6 class="text-light content">
              <a referrerpolicy="origin" target="_blank" href="https://trustseal.enamad.ir/?id=246276&amp;Code=zlJ2ZNhYaGu6SXWGiyFN"><img referrerpolicy="origin" src="https://Trustseal.eNamad.ir/logo.aspx?id=246276&amp;Code=zlJ2ZNhYaGu6SXWGiyFN" alt="" style="cursor:pointer" id="zlJ2ZNhYaGu6SXWGiyFN"></a>
            </h6>
          </div>
        </div>
        
        <div class="col-lg col-12 body d-none d-lg-block">
          <div class="p-2 mt-1 redu20">
            <h5 class="title">قابلیت های گوش شنوا</h5>
            <h6 class="text-light">
              <div class="mt-3"><a href="https://gosheshenava.com/terms/" class="text-light">قوانین و مقررات</a></div>
              <div v-if="!$store.state.isAuthenticated" class="mt-3"><router-link to="/register" class="text-light">ثبت نام مشاور</router-link></div>
              <div class="mt-3"><router-link to="/questions" class="text-light">سوالات متداول</router-link></div>
              <div class="mt-3"><router-link class="text-light" to="/ticket">پشتیبانی</router-link></div>
              <div class="mt-3"><router-link to="/about" class="text-light">درباره ما</router-link></div>
            </h6>
          </div>
        </div>
        
        <div class="col-lg col-12 body d-none d-lg-block">
          <div class="p-2 mt-1 redu20">
            <h5 class="title">درباره گوش شنوا</h5>
            <h6 class="text-light content line-h">
              گوش شنوا ارائه‌دهنده خدمات مشاوره ی آنلاین و پل ارتباطی میان کاربران با ارائه‌دهندگان خدمات مشاوره روانشناسی و خانواده و همچنین خدمات پزشکی و پرستاری در منزل است. گوش شنوا راهکاری ساده و سریع و ۲۴ ساعته برای دسترسی به خدمات مشاوره ی است. با ورود به سرویس پزشک و مشاور گوش شنوا و مشخص کردن نیاز خود در حوزه پزشکی، روانشناسی یا حقوقی  می‌توانید دسترسی سریع و آسان به خدمات روانشناسی و سلامت را تجربه کنید
            </h6>
          </div>
        </div>
        <!-- mobile -->
        <div class="col-lg col-12 body d-lg-none">
          <div class="p-2 mt-1 redu20">
            <h5 class="title">درباره گوش شنوا</h5>
            <h6 class="text-light text-right line-h">
              گوش شنوا ارائه‌دهنده خدمات مشاوره ی آنلاین و پل ارتباطی میان کاربران با ارائه‌دهندگان خدمات مشاوره روانشناسی و خانواده و همچنین خدمات پزشکی و پرستاری در منزل است. گوش شنوا راهکاری ساده و سریع و ۲۴ ساعته برای دسترسی به خدمات مشاوره ی است. با ورود به سرویس پزشک و مشاور گوش شنوا و مشخص کردن نیاز خود در حوزه پزشکی، روانشناسی یا حقوقی  می‌توانید دسترسی سریع و آسان به خدمات روانشناسی و سلامت را تجربه کنید
            </h6>
          </div>
        </div>
        
        <div class="col-lg col-12 body d-lg-none">
          <div class="p-2 mt-1 redu20">
            <h5 class="title">قابلیت های گوش شنوا</h5>
            <h6 class="text-light">
              <a href="https://gosheshenava.com/terms/" class="text-light">قولنین و مقررات</a>
              <br><br>
              <router-link to="/register" class="text-light">ثبت نام مشاور</router-link>
              <br><br>
              <router-link to="/questions" class="text-light">سوالات متداول</router-link>
              <br><br>
              <router-link class="text-light" to="/ticket">پشتیبانی</router-link>
              <br><br>
              <router-link to="/about" class="text-light">درباره ما</router-link>
            </h6>
          </div>
        </div>
        
        <div class="col-lg col-12 body d-lg-none">
          <div class="p-2 mt-1 redu20 text-center">
            <h5 class="title">مجوزهای گوش شنوا</h5>
            <!-- <h6 class="text-light content"> -->
              <a referrerpolicy="origin" target="_blank" href="https://trustseal.enamad.ir/?id=246276&amp;Code=zlJ2ZNhYaGu6SXWGiyFN"><img referrerpolicy="origin" src="https://Trustseal.eNamad.ir/logo.aspx?id=246276&amp;Code=zlJ2ZNhYaGu6SXWGiyFN" alt="" style="cursor:pointer;" id="zlJ2ZNhYaGu6SXWGiyFN"></a>
            <!-- </h6> -->
          </div>
        </div>
        
        <div class="col-lg col-12 body d-lg-none">
          <div class="p-2 mt-1 redu20">
            <h5 class="title">عضویت در خبرنامه</h5>
            <h6 class="text-light content"></h6>
          </div>
        </div>

        <div class="col-12 black">
          کلیه حقوق مادی و معنوی اپلیکیشن برای سامانه هوشمند گوش شنوا محفوظ می باشد
        </div>

      </div>
    </footer>

    <div v-if="$route.path=='/ticket'" class="m-5 p-5"></div>

    <div class="modal" id="myModal">    
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
              <div class="modal-body">لینک واسط شما {{userId}}</div>
              <div class="modal-footer"><button type="button" class="btn btn-danger" data-dismiss="modal">بستن</button></div>
            </div>
        </div>
    </div>

  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  },
  data() {
    return {
      userId: '',
    }
  },
  watch: {
    $route() {
      this.$store.dispatch("onStart")
      this.$store.commit("onStarted")
    }
  },
  mounted() {
    this.$store.dispatch("onStart")
    this.$store.commit("onStarted")
    // $('document').ready(function() {
    //   $(window).scrollTop(0);
    // });
    this.userId = localStorage.getItem("userId")
    this.$store.state.amount = localStorage.getItem("amount")
  }
}

</script>

<style scope>
@font-face {
    font-family: IRANSans;
    font-weight: 900;
    src:url(./assets/Sans.eot) format("eot"), 
    url(./assets/Sans.woff) format("woff"),
    url(./assets/Sans.ttf) format("ttf");
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: IRANSans;
  font-size: small;
  text-align: center;
  color: #2c3e50;
}

#nav ul{
  padding: 15px;
}

#nav a {
  /* font-weight: bold; */
  font-size: small;
  
  padding: 10px;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.w-250 {
  min-width: 250px;
  max-width: 250px;
}
.h-150 {
  min-height: 150px;
  max-height: 150px;
}
.redu20 {
  border-radius: 20px;
}
.redu-right {
  border-radius: 20px 60px 10px 20px;
}
.redu-left {
  border-radius: 10px 20px 20px 60px;
}
.medium {
  font-size: medium;
}
.large {
  font-size: large;
}
.small {
  font-size: small;
}
.text-zard {
  color: yellow;
}
.violet {
  color: #3c0b64
}
.black {
  color: black;
}
.bg-violet {
  background-color: #3c0b64;
}
span {
  color: #2c3e50;
}
.img {
  width: 100%;
}
.sm-img {
  width: 40%;
}
.logo {
  width: 60px;
}
.small-logo {
  width: 25px;
}
.img-big {
  height: 250px;
}
.img-circle {
    width: 100px;
    height: 100px;
}
.img-sm-circle {
    width: 50px;
    height: 50px;
}
.img-big-circle {
    width: 125px;
    height: 125px;
}
.mt-25 {
  margin-top: 25%;
}
.img-border-glass {
  border-radius:50%;
  box-shadow: 0 0 0 2px #fff, 1px 1px 5px rgb(0 0 0 / 32%);
  object-fit: cover;
}
.btn-file {
  position: relative;
  overflow: hidden;
}
.btn-file input[type=file] {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 100%;
  min-height: 100%;
  font-size: 100px;
  text-align: right;
  filter: alpha(opacity=0);
  opacity: 0;
  outline: none;
  background: white;
  cursor: inherit;
  display: block;
}
/* start navbar */
.sidenavBig {
  height: 100%;
  width: 17%;
  position: fixed;
  z-index: 1;
  padding-top: 6%;
  top: 0%;
  right: 0;
  background-color: #3c0b64;
  transition: 0.5s;
}

.sidenavLeft {
  height: 100%;
  width: 0;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #3c0b64;
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 60px;
}

.sidenavRight {
  height: 100%;
  width: 0;
  position: fixed;
  z-index: 1;
  top: 0;
  right: 0;
  background-color: #3c0b64;
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 60px;
}

.sidenav a {
  padding: 8px 8px 8px 32px;
  text-decoration: none;
  font-size: 16px;
  color: #818181;
  display: block;
  transition: 0.3s;
}

.sidenav a:hover {
  color: #f1f1f1;
}

.sidenav .closebtn {
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 36px;
  margin-left: 50px;
}

.sidenav .closebtnRight {
  position: absolute;
  top: 0;
  left: 25px;
  font-size: 36px;
  margin-right: 50px;
}

@media screen and (max-height: 450px) {
  .sidenav {padding-top: 15px;}
  .sidenav a {font-size: 18px;}
}
/* end navbar */
/* start loading */
.ring
  {
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    width:150px;
    height:150px;
    background:transparent;
    border:3px solid #3c3c3c;
    border-radius:50%;
    text-align:center;
    line-height:150px;
    font-family: IRANSans;
    font-size:20px;
    color:#3c0b64;
    letter-spacing:4px;
    /* text-transform:uppercase; */
    text-shadow:0 0 10px #3c0b64;
    box-shadow:0 0 20px rgba(0,0,0,.5);
  }
  .ring:before
  {
    content:'';
    position:absolute;
    top:-3px;
    left:-3px;
    width:100%;
    height:100%;
    border:3px solid transparent;
    border-top:3px solid #3c0b64;
    border-right:3px solid #3c0b64;
    border-radius:50%;
    animation:animateC 2s linear infinite;
  }
  td
  {
    display:block;
    position:absolute;
    top:calc(50% - 2px);
    left:50%;
    width:50%;
    height:4px;
    background:transparent;
    transform-origin:left;
    animation:animate 2s linear infinite;
  }
  td:before
  {
    content:'';
    position:absolute;
    width:16px;
    height:16px;
    border-radius:50%;
    background:#3c0b64;
    top:-6px;
    right:-8px;
    box-shadow:0 0 20px #3c0b64;
  }
  @keyframes animateC
  {
    0%
    {
      transform:rotate(0deg);
    }
    100%
    {
      transform:rotate(360deg);
    }
  }
  @keyframes animate
  {
    0%
    {
      transform:rotate(45deg);
    }
    100%
    {
      transform:rotate(405deg);
    }
  }
/*  end loading */
</style>
