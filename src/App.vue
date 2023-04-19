<template>
  <div id="main" style="direction: rtl;">
    <div v-if=" $route.name != 'Home' ">
      <Navbar />
      <div v-if="!$store.state.pwaCheck" class="col-12 d-lg-none">
        <div id="pwaAlert" class="row mb-2 py-2 bg-light">
            <div class="col-2 col-lg-1 p-0">
                <button class="close" style="float: unset !important;" v-on:click="alert_pwa_toggle">&times;</button>
            </div>
            <div class="col p-0 text-center">
              <router-link to="/" class="text-dark ml-4">نصب اپلیکیشن</router-link>
            </div>
        </div>
      </div>
    </div>

    <div class="routerView pt-3">  
      <router-view/>
    </div>

    <div v-if="this.$store.state.runAnimation" class="layout-ring bg-light">
      <div class="ring">
        گوش شنوا          
        <td></td>
      </div>
    </div>

    <footer v-if=" $route.name != 'Home' ">
      <div class="bg-light">
        <div class="container">
          <div class="row pt-2">

            <!-- <div class="col-lg col-12 body">
              <div class="p-2 mt-1 redu20">
                <h6 class="title pb-3 border-bottom">عضویت در خبرنامه</h6>
                <p class="m-0 content">
                </p>
              </div>
            </div>
            
            <div class="col-lg col-12 body">
              <div class="p-2 mt-1 redu20">
                <h6 class="title pb-3 border-bottom">مجوزهای گوش شنوا</h6>
                <p class="m-0 content">
                </p>
              </div>
            </div> -->
            
            <div class="col-lg col-12 body">
              <div class="p-2 mt-1 redu20">
                <h6 class="title pb-3 border-bottom text-dark">قابلیت های گوش شنوا</h6>
                <div class="row">
                  <div class="col">
                    <p class="m-0 mt-2 text-lg-right"><a href="https://gosheshenava.com/terms/" class="text-dark">قوانین و مقررات</a></p>
                    <p class="m-0 mt-2 text-lg-right" v-if="!$store.state.isAuthenticated"><router-link to="/register" class="text-dark">ثبت نام مشاور</router-link></p>
                  </div>
                    
                  <div class="col">
                    <p class="m-0 mt-2 text-lg-right"><router-link to="/questions" class="text-dark">سوالات متداول</router-link></p>
                    <p class="m-0 mt-2 text-lg-right"><router-link to="/ticket" class="text-dark">پشتیبانی</router-link></p>
                    <p class="m-0 mt-2 text-lg-right"><router-link to="/about" class="text-dark">درباره ما</router-link></p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-lg col-12 body">
              <div class="p-2 mt-1 redu20">
                <h6 class="title pb-3 border-bottom text-dark">درباره گوش شنوا</h6>
                <p class="m-0 content line-h text-dark text-lg-right py-2">
                  گوش شنوا ارائه‌دهنده خدمات مشاوره ی آنلاین و پل ارتباطی میان کاربران با ارائه‌دهندگان خدمات مشاوره روانشناسی و خانواده و همچنین خدمات پزشکی و پرستاری در منزل است. گوش شنوا راهکاری ساده و سریع و ۲۴ ساعته برای دسترسی به خدمات مشاوره ی است. با ورود به سرویس پزشک و مشاور گوش شنوا و مشخص کردن نیاز خود در حوزه پزشکی، روانشناسی یا حقوقی  می‌توانید دسترسی سریع و آسان به خدمات روانشناسی و سلامت را تجربه کنید
                </p>
              </div>
            </div>
    
          </div>
        </div>
      </div>

      <div class="col-12 border-top text-muted py-3 mb-5 mb-lg-0 small">
        کلیه حقوق اپلیکیشن برای سامانه هوشمند گوش شنوا محفوظ می باشد
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
      this.userId = localStorage.getItem("userId")
      this.$store.state.amount = localStorage.getItem("amount")
    },
    methods: {
      alert_pwa_toggle() {
        document.querySelector('#pwaAlert').classList.toggle('d-none')
      },
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
  body{
    background: #f2f2f2 !important;
  }
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: IRANSans;
    font-size: small;
    text-align: center;
    color: #2c3e50;
  }
  select.form-control:not([size]):not([multiple]) {
    height: 40px !important;
  }
  .profile-card-view .avatar {
    max-height: 0px;
  }
  .profile-card-view .avatar .box {
    position: relative;
    top: -90px;
  }
  .profile-card-view .comments {
    max-height: 400px;
    overflow: auto;
  }
  .errors_box {
    position: fixed !important;
    width: 100% !important;
    z-index: 99999 !important;
  }
  .Dashboard .user-avatar {
    width: 120px;
    height: 120px;
  }
  .p-justify p {
    text-align: justify;
  }
  .bg-c-lite-green {
    background: -webkit-gradient(linear, left top, right top, from(#3c0b64b9), to(#3c0b64));
  }
  .bg-transparent {
    background: transparent !important;
  }
  .PwaPage {
    max-width: 560px;
    margin: auto;
  }
  .PwaPage .logo , .about .logo {
    width: 120px;
    height: 120px;
  }
  .pwa-fixed-bottom {
    position: absolute;
    bottom: 0px;
    width: 100%;
    left: 0px;
    z-index: 9;
  }
  .img-circle-28 {
    width: 28px;
    height: 28px;
  }
  .pwa-fixed-bottom .box {
    max-width: 480px;
    margin: auto;
  }
  .img-border-light {
    border-radius:50%;
    box-shadow: 0 0 0 2px #f8f9fa, 1px 1px 5px rgb(0 0 0 / 32%);
    object-fit: cover;
    padding: 1px;
  }
  .img-border-success {
    border-radius:50%;
    box-shadow: 0 0 0 2px #28a745, 1px 1px 5px rgb(0 0 0 / 32%);
    object-fit: cover;
    padding: 1px;
  }
  .img-border-danger {
    border-radius:50%;
    box-shadow: 0 0 0 2px #dc3545, 1px 1px 5px rgb(0 0 0 / 32%);
    object-fit: cover;
    padding: 1px;
  }
  .lh-normal {
    line-height: normal !important;
  }
  .rounded {
    border-radius: 4px !important;
  }
  .border-none {
    border: none !important;
  }
  .NavbarTop img.logo{
    height: 52px;
  }
  .CateguryComponent img {
    max-height: 50px;
    width: auto;
  }
  .search-bar-category span {
    border-radius:3px 0px 0px 3px;
  }
  a {
    text-decoration: none !important;
  }
  .NavbarTop ul{
    padding: 15px;
  }

  .NavbarTop a {
    /* font-weight: bold; */
    font-size: small;
    
    padding: 10px;
    color: #2c3e50;
  }

  .NavbarTop a.router-link-exact-active {
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
    border-radius: 20px !important;
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
    color: #ffc107;
  }
  .border-violet {
    border:1px solid #3c0b64 !important
  }
  .violet {
    color: #3c0b64 !important
  }
  .btn-violet {
    color: white !important;
    background: #3c0b64 !important;
  }
  .btn-violet:hover {
    background: #3c0b64de !important;
  }
  .black {
    color: black;
  }
  .bg-violet {
    background-color: #3c0b64 !important;
  }
  .text-ellipsis,
  .text-nowrap {
      white-space: nowrap!important
  }

  .profile-content {
      padding: 25px;
      border-radius: 20px
  }

  .profile-content:after,
  .profile-content:before {
      content: '';
      display: table;
      clear: both
  }

  .profile-content .tab-content,
  .profile-content .tab-pane {
      background: 0 0
  }

  .profile-left {
      width: 200px;
      float: left
  }

  .profile-right {
      margin-left: 240px;
      padding-right: 20px
  }

  .profile-image {
      height: 175px;
      line-height: 175px;
      text-align: center;
      font-size: 72px;
      margin-bottom: 10px;
      border: 2px solid #E2E7EB;
      overflow: hidden;
      border-radius: 4px
  }

  .profile-image img {
      display: block;
      max-width: 100%
  }

  .profile-highlight {
      padding: 12px 15px;
      background: #FEFDE1;
      border-radius: 4px
  }

  .profile-highlight h4 {
      margin: 0 0 7px;
      font-size: 12px;
      font-weight: 700
  }

  .table.table-profile>thead>tr>th {
      border-bottom: none!important
  }

  .table.table-profile>thead>tr>th h4 {
      font-size: 20px;
      margin-top: 0
  }

  .table.table-profile>thead>tr>th h4 small {
      display: block;
      font-size: 12px;
      font-weight: 400;
      margin-top: 5px
  }

  .table.table-profile>tbody>tr>td,
  .table.table-profile>thead>tr>th {
      border: none;
      padding-top: 7px;
      padding-bottom: 7px;
      color: #242a30;
      background: 0 0
  }

  .table.table-profile>tbody>tr>td.field {
      width: 20%;
      text-align: right;
      font-weight: 600;
      color: #2d353c
  }

  .table.table-profile>tbody>tr.highlight>td {
      border-top: 1px solid #b9c3ca;
      border-bottom: 1px solid #b9c3ca
  }

  .table.table-profile>tbody>tr.divider>td {
      padding: 0!important;
      height: 10px
  }

  .profile-section+.profile-section {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #b9c3ca
  }

  .profile-section:after,
  .profile-section:before {
      content: '';
      display: table;
      clear: both
  }

  .profile-section .title {
      font-size: 20px;
      margin: 0 0 15px
  }

  .profile-section .title small {
      font-weight: 400
  }

  body.flat-black {
      background: #E7E7E7
  }

  .flat-black .navbar.navbar-inverse {
      background: #212121
  }

  .flat-black .navbar.navbar-inverse .navbar-form .form-control {
      background: #4a4a4a;
      border-color: #4a4a4a
  }

  .flat-black .sidebar,
  .flat-black .sidebar-bg {
      background: #3A3A3A
  }

  .flat-black .page-with-light-sidebar .sidebar,
  .flat-black .page-with-light-sidebar .sidebar-bg {
      background: #fff
  }

  .flat-black .sidebar .nav>li>a {
      color: #b2b2b2
  }

  .flat-black .sidebar.sidebar-grid .nav>li>a {
      border-bottom: 1px solid #474747;
      border-top: 1px solid #474747
  }

  .flat-black .sidebar .active .sub-menu>li.active>a,
  .flat-black .sidebar .nav>li.active>a,
  .flat-black .sidebar .nav>li>a:focus,
  .flat-black .sidebar .nav>li>a:hover,
  .flat-black .sidebar .sub-menu>li>a:focus,
  .flat-black .sidebar .sub-menu>li>a:hover,
  .sidebar .nav>li.nav-profile>a {
      color: #fff
  }

  .flat-black .sidebar .sub-menu>li>a,
  .flat-black .sidebar .sub-menu>li>a:before {
      color: #999
  }

  .flat-black .page-with-light-sidebar .sidebar .active .sub-menu>li.active>a,
  .flat-black .page-with-light-sidebar .sidebar .active .sub-menu>li.active>a:focus,
  .flat-black .page-with-light-sidebar .sidebar .active .sub-menu>li.active>a:hover,
  .flat-black .page-with-light-sidebar .sidebar .nav>li.active>a,
  .flat-black .page-with-light-sidebar .sidebar .nav>li.active>a:focus,
  .flat-black .page-with-light-sidebar .sidebar .nav>li.active>a:hover {
      color: #000
  }

  .flat-black .page-sidebar-minified .sidebar .nav>li.has-sub:focus>a,
  .flat-black .page-sidebar-minified .sidebar .nav>li.has-sub:hover>a {
      background: #323232
  }

  .flat-black .page-sidebar-minified .sidebar .nav li.has-sub>.sub-menu,
  .flat-black .sidebar .nav>li.active>a,
  .flat-black .sidebar .nav>li.active>a:focus,
  .flat-black .sidebar .nav>li.active>a:hover,
  .flat-black .sidebar .nav>li.nav-profile,
  .flat-black .sidebar .sub-menu>li.has-sub>a:before,
  .flat-black .sidebar .sub-menu>li:before,
  .flat-black .sidebar .sub-menu>li>a:after {
      background: #2A2A2A
  }

  .flat-black .page-sidebar-minified .sidebar .sub-menu>li:before,
  .flat-black .page-sidebar-minified .sidebar .sub-menu>li>a:after {
      background: #3e3e3e
  }

  .flat-black .sidebar .nav>li.nav-profile .cover.with-shadow:before {
      background: rgba(42, 42, 42, .75)
  }

  .bg-white {
      background-color: #fff!important;
  }
  .p-10 {
      padding: 10px!important;
  }
  .media.media-xs .media-object {
      width: 32px;
  }
  .m-b-2 {
      margin-bottom: 2px!important;
  }
  .media>.media-left, .media>.pull-left {
      padding-right: 15px;
  }
  .media-body, .media-left, .media-right {
      display: table-cell;
      vertical-align: top;
  }
  select.form-control:not([size]):not([multiple]) {
      height: 34px;
  }
  .form-control.input-inline {
      display: inline;
      width: auto;
      padding: 0 7px;
  }


  .timeline {
      list-style-type: none;
      margin: 0;
      padding: 0;
      position: relative
  }

  .timeline:before {
      content: '';
      position: absolute;
      top: 5px;
      bottom: 5px;
      width: 5px;
      background: #2d353c;
      left: 20%;
      margin-left: -2.5px
  }

  .timeline>li {
      position: relative;
      min-height: 50px;
      padding: 20px 0
  }

  .timeline .timeline-time {
      position: absolute;
      left: 0;
      width: 18%;
      text-align: right;
      top: 30px
  }

  .timeline .timeline-time .date,
  .timeline .timeline-time .time {
      display: block;
      font-weight: 600
  }

  .timeline .timeline-time .date {
      line-height: 16px;
      font-size: 12px
  }

  .timeline .timeline-time .time {
      line-height: 24px;
      font-size: 20px;
      color: #242a30
  }

  .timeline .timeline-icon {
      left: 15%;
      position: absolute;
      width: 10%;
      text-align: center;
      top: 40px
  }

  .timeline .timeline-icon a {
      text-decoration: none;
      width: 20px;
      height: 20px;
      display: inline-block;
      border-radius: 20px;
      background: #d9e0e7;
      line-height: 10px;
      color: #fff;
      font-size: 14px;
      border: 5px solid #2d353c;
      transition: border-color .2s linear
  }

  .timeline .timeline-body {
      margin-left: 23%;
      margin-right: 17%;
      background: #fff;
      position: relative;
      padding: 20px 25px;
      border-radius: 6px
  }

  .timeline .timeline-body:before {
      content: '';
      display: block;
      position: absolute;
      border: 10px solid transparent;
      border-right-color: #fff;
      left: -20px;
      top: 20px
  }

  .timeline .timeline-body>div+div {
      margin-top: 15px
  }

  .timeline .timeline-body>div+div:last-child {
      margin-bottom: -20px;
      padding-bottom: 20px;
      border-radius: 0 0 6px 6px
  }

  .timeline-header {
      padding-bottom: 10px;
      border-bottom: 1px solid #e2e7eb;
      line-height: 30px
  }

  .timeline-header .userimage {
      float: left;
      width: 34px;
      height: 34px;
      border-radius: 40px;
      overflow: hidden;
      margin: -2px 10px -2px 0
  }

  .timeline-header .username {
      font-size: 16px;
      font-weight: 600
  }

  .timeline-header .username,
  .timeline-header .username a {
      color: #2d353c
  }

  .timeline img {
      max-width: 100%;
      display: block
  }

  .timeline-content {
      letter-spacing: .25px;
      line-height: 18px;
      font-size: 13px
  }

  .timeline-content:after,
  .timeline-content:before {
      content: '';
      display: table;
      clear: both
  }

  .timeline-title {
      margin-top: 0
  }

  .timeline-footer {
      background: #fff;
      border-top: 1px solid #e2e7ec;
      padding-top: 15px
  }

  .timeline-footer a:not(.btn) {
      color: #575d63
  }

  .timeline-footer a:not(.btn):focus,
  .timeline-footer a:not(.btn):hover {
      color: #2d353c
  }

  .timeline-likes {
      color: #6d767f;
      font-weight: 600;
      font-size: 12px
  }

  .timeline-likes .stats-right {
      float: right
  }

  .timeline-likes .stats-total {
      display: inline-block;
      line-height: 20px
  }

  .timeline-likes .stats-icon {
      float: left;
      margin-right: 5px;
      font-size: 9px
  }

  .timeline-likes .stats-icon+.stats-icon {
      margin-left: -2px
  }

  .timeline-likes .stats-text {
      line-height: 20px
  }

  .timeline-likes .stats-text+.stats-text {
      margin-left: 15px
  }

  .timeline-comment-box {
      background: #f2f3f4;
      margin-left: -25px;
      margin-right: -25px;
      padding: 20px 25px
  }

  .timeline-comment-box .user {
      float: left;
      width: 34px;
      height: 34px;
      overflow: hidden;
      border-radius: 30px
  }

  .timeline-comment-box .user img {
      max-width: 100%;
      max-height: 100%
  }

  .timeline-comment-box .user+.input {
      margin-left: 44px
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
  .vpd-input-group label {
    margin: 0px;
    border-radius: 4px;
  }
  .img-border-glass {
    border-radius:50%;
    box-shadow: 0 0 0 2px #fff, 1px 1px 5px rgb(0 0 0 / 32%);
    object-fit: cover;
  }
  .ShowCategoryComponent .img-circle {
    width: 78px;
    height: 78px;
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
    overflow-x: hidden;
    transition: 0.5s;
  }

  .sidenavRight {
    height: 100%;
    width: 0;
    position: fixed;
    z-index: 1;
    top: 0;
    right: 0;
    overflow-x: hidden;
    transition: 0.5s;
    padding-top: 60px;
  }

  .sidenav a {
    padding: 4px;
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
  .layout-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    z-index: 99;
  }
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
    font-size:22px;
    color:darkblue;
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
  @media screen and (max-width: 640px) {
    .fs-sm-12 {
      font-size: 12px !important;
    }
    .text-sm-small {
      font-size: smaller;
    }
    .fixed-bottom .navbar-brand {
      font-size: 9px;
      font-weight: bold;
      width: 60px;
    }
    .findAuthorByFamilyList div {
      font-size: 11px;
      font-weight: bold;
    }
    .ShowCategoryComponent h6 {
      font-size: 14px;
      padding: 8px 0px 2px;
    }
    .ShowCategoryComponent .stars {
      margin-right: 30%;
      padding-top: 4px;
    }
  }
  @media screen and (min-width: 988px) {
    .routerView {
      min-height: 780px;
    }
    .search-bar-category .input-group {
      height: 44px;
    }
    .search-bar-category .input-group > .form-control {
      height: 44px;
    }
    #main {
      padding-top: 36px;
    }
  }
</style>
