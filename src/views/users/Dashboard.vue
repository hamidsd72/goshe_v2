<template>
  <div class="Dashboard pt-lg-5 pb-3">

    <div v-if="this.msgNotSee > 0" class="alert alert-warning alert-dismissible fade show" role="alert">
        <a class="float-right h1" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></a>
        <router-link to="/connection" ><h6 class="violet text-center ml-5">تعداد {{msgNotSee}} پیام خوانده نشده دارید. برای دیدن کلیک کنید</h6></router-link>
    </div>

    <div class="errors_box alert alert-danger alert-dismissible d-none">
        <button type="button" class="close" @click="document.querySelector('.errors_box').classList.add('d-none');">&times;</button>
        <strong>خطا!</strong> 
        <p class="errors_list"></p>
    </div>

    <div class="container">

        <div v-if="doctor.length" class="alert alert-warning pt-0 pb-3 mb-0">
            <a href="#" class="violet " data-toggle="modal" data-target="#duc">
                {{checkName(user)}}
                <br>
                برای ارسال مدارک کلیک کنید
            </a>
            <div class="modal fade" id="duc">
                <div class="modal-dialog">
                    <div class="modal-content">
                    
                        <div class="modal-header"><h6 class="close modal-title ">ارسال مدارک تایید هویت</h6></div>
                        
                        <div class="modal-body">
                            <div class="form-group mb-3">
                                <label for="name">نوع مدرک ارسالی را انتخاب کن</label>
                                <select class="form-control mb-2" id="view_type" v-model="documentTitle">
                                    <option value="تصویر سلفی">تصویر سلفی</option>
                                    <option value="کارت ملی">کارت ملی</option>
                                    <option value="شناسنامه">شناسنامه</option>
                                    <option value="پروانه کار">پروانه کار</option>
                                </select>
                            </div>
                            <div class="custom-file mt4- mb-4">
                                <input v-if="documentTitle" type="file" class="custom-file-input" accept="image/*" @change="sendDocuments($event)" >
                                <label class="custom-file-label" for="customFile">برای انتخاب تصویر اینجا کلیک کنید</label>
                            </div>
                        </div>
                        
                        <div class="modal-footer"><button type="button" id="closeModalDuc" class="btn btn-secondary closeModal" data-dismiss="modal">انصراف</button></div>
                        
                    </div>
                </div>
            </div>
        </div>

        <div class="modal text-dark" id="numberModal">
            <div class="modal-dialog">
                <div class="modal-content">

                <div class="modal-body">
                    <h5 class="text-right mt-1 m-3">ثبت شماره جدید</h5>
                    <label for="subject">عنوان برای شماره</label>
                    <input type="text" class="form-control mb-2" :class="{'is-invalid':numberCreateError}" name="subject" placeholder="شماره رایتل من" v-model="subjectNumber">
                    <label for="number">شماره موبایل</label>
                    <input type="text" class="form-control name mb-1" :class="{'is-invalid':numberCreateError}" name="number" placeholder="9121231234" v-model="numberNumber">
                    <div class="text-danger" v-if="numberCreateError">{{numberCreateError}}</div>                    
                    <small class="text-muted">فرمت شماره 9121231234 و به لاتین باشد</small>
                </div>

                <div class="modal-footer row">
                    <div class="col text-left"><button type="button" class="btn btn-danger closeModal" data-dismiss="modal">انصراف</button></div>
                    <div class="col text-right">
                        <button @click="numberCreate()" class="btn text-light" style="background-color: #3c0b64;">ثبت شماره</button>
                    </div>
                </div>

                </div>
            </div>
        </div>

        <div class="user-card-full" >

            <div class="col-12 text-right ">
                <div class="row rounded border bg-white">
                    <div class="col-12 border-bottom">
                        <div class="d-none d-lg-block">
                            <div class="text-right row py-3">
                                <div class="col-auto"><router-link to="/transaction" class="btn btn-block btn-info rounded">صورتحساب</router-link></div>
                                <div v-if="doctor.length" class="col-auto"><router-link to="/revenue" class="btn btn-block btn-info rounded">درآمد من</router-link></div>
                                <!-- <div class="col-auto"><router-link to="/callLog" class="btn btn-block btn-info rounded">تماس ها <small>(لیست سیاه)</small></router-link></div> -->
                                <div class="col-auto"><router-link to="/callLog" class="btn btn-block btn-info rounded">تماس ها </router-link></div>
                                <div class="col-auto"> <router-link to="/notification" class="btn btn-block btn-info rounded">اعلانات</router-link></div>
                                <div class="col-auto"><router-link to="/connection" class="btn btn-block btn-info rounded">مشاوران من</router-link></div>
                                <div class="col-auto"> <router-link v-if="doctor[0]" :to="`/visits/show/${$store.state.doctor}`" class="btn btn-block btn-info rounded">درخواست نوبت 
                                    {{ usersVisits > 0 ? usersVisits : '' }}</router-link></div>
                                <div class="col-auto"><router-link v-if="doctor[0]" :to="`/exam/${$store.state.doctor}`" class="btn btn-block btn-info rounded">آزمون ها</router-link></div>
                            </div>
                        </div>
                    </div>
    
                    <div class="col-lg-3 bg-c-lite-green user-profile rounded">
                        <div class="mt-2 mb-2">
                        </div>
                        <div class="card-block text-center">
                            <div class="pt-2">
                                <div class="text-center">
                                    <img v-if="user.avatar" :src="user.avatar" class="user-avatar rounded-circle img-border-light" alt="User-Profile-Image">
                                    <img v-else :src="require('@/assets/edit.png')" class="my-img img-radius img-border-light" alt="User-Profile-Image">
                                    <h6 class="text-light pt-3">{{user.first_name+' '+user.last_name}}</h6>
                                    <!-- <h6 class="text-light pt-1">{{`شناسه کاربری : ${num2fa(user.id)}`}}</h6> -->
                                    <h6 class="text-light pt-1">{{num2fa(user.username)}}</h6>
                                </div>

                                <div v-if="imageAvatar" class="btn btn-light btn-block btn-file rounded mt-3">
                                    ارسال تصویر نمایه
                                    <input v-if="imageAvatar" type="file" accept="image/*" @change="setAvatar($event)" >
                                </div>

                                <button data-toggle="modal" data-target="#numberModal" class="btn btn-light btn-block my-3 rounded text-dark">افزودن شماره</button>

                                <button type="button" class="btn btn-block mb-3 rounded text-dark" :class="edit ? 'btn-success' : 'btn-light'" @click="edit=!edit">ویرایش اطلاعات</button>

                                <div class="modal fade" id="fileupload">
                                    <div class="modal-dialog modal-xl">
                                        <div class="modal-content">
                                            <div class="modal-body col-10 mx-auto rounded">
                                                <h6 class="text-right">انتخاب فایل</h6><br>
                                                <div class="custom-file mb-4">
                                                    <input v-if="imageAvatar" type="file" class="custom-file-input" accept="image/*" @change="setAvatar($event)" >
                                                    <label class="custom-file-label" for="customFile">اینجا کلیک کنید</label>
                                                </div>
                                            </div>
                                            
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary closeModal" data-dismiss="modal">بستن</button>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div class="col-lg">
                        <div v-if="!edit" class="card-block">
                            <h6 class="text-right border-bottom m-0 py-2 my-2">شماره های من</h6>

                            <div v-if="numbers" class="row mt-3 mb-3">
                                <div class="col-lg-4 col-6 text-right" v-for="number in numbers" :key="number.id">
                                    <div class="card rounded">
                                        <div class="card-header rounded m-1 p-2 bg-violet text-light">عنوان شماره : {{number.subject}}</div>
                                        <div class="card-body text-dark p-2 px-3">{{num2fa(number.number)}}</div>
                                    </div>
                                </div>
                            </div>
    
                            <h6 class="text-right border-bottom m-0 pb-2 mb-2">کاربر</h6>
                            <div class="row">
                                <div class="col-lg-6">
                                    <h6 class="my-1 mt-4">نام کامل</h6>
                                    <p class="m-0">{{user.first_name +' '+ user.last_name || 'هنوز وارد نشده' }}</p>
                                </div>
                                <div class="col-lg-6">
                                    <h6 class="my-1 mt-4">اعتبار</h6>
                                    <p class="m-0">{{num2fa(formatMoney( parseInt(amount) ))}}</p>
                                </div>
                            </div>
                            
                            <div v-if="is_doctor" class="row">
                                <div class="col-lg-6">
                                    <h6 class="my-1 mt-4">شماره پروانه صنفی (uid)</h6>
                                    <p class="m-0" v-if="doctor[0].uid==123456789">وارد نشده</p>
                                    <p class="m-0" v-else>{{doctor[0].uid}}</p>
                                </div>
    
                                <div class="col-lg-6">
                                    <h6 class="my-1 mt-4">تخصص</h6>
                                    <div v-for="c in doctor[0].category" :key="c.id">
                                        <div v-for="cat in category" :key="cat.id">
                                            <p class="m-0" v-if="c == cat.id">{{cat.title}}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <h6 class="text-right border-bottom m-0 pb-2 mb-2">بایوگرافی</h6>
                                    <p class="m-0">{{doctor[0].older}}</p>
                                </div>
                            </div>
                            <div v-if="is_doctor" class="row">
                                <div class="col-12">
                                    <h6 class="text-right border-bottom m-0 pb-2 mb-2 mt-4">اطلاعات</h6>
                                </div>
                                <div class="col-6 col-lg-3">
                                    <h6 class="my-1 mt-4">مدرک تحصیلی</h6>
                                    <p class="m-0">{{doctor[0].certificate}}</p>
                                </div> 
                                <div class="col-6 col-lg-3">
                                    <h6 class="my-1 mt-4">نوع ویزیت</h6>
                                    <p class="m-0" v-if="doctor[0].visit_type=='c'">فقط تماس</p>
                                    <p class="m-0" v-if="doctor[0].visit_type=='m'">فقط پیام</p>
                                    <p class="m-0" v-if="doctor[0].visit_type=='b'">پیام و تماس</p>
                                </div>
                                <div class="col-6 col-lg-3">
                                    <h6 class="my-1 mt-4">{{doctor[0].msg_price}} تومان</h6>
                                    <p class="m-0">قیمت پیام</p>
                                </div>
                                <div class="col-6 col-lg-3">
                                    <h6 class="my-1 mt-4">{{doctor[0].call_price}} تومان</h6>
                                    <p class="m-0"> قیمت تماس</p>
                                </div>
                                
                                <div v-if="is_doctor" class="col-12">
                                    <h6 class="text-right border-bottom m-0 pb-2 mb-2 mt-4">ساعت کاری</h6>
                                    <div class="row">
    
                                        <div class="col-lg-6 mb-3 text-center">
                                            <div class="bg-light rounded p-1">
                                                <h6 class="bg-violet text-light p-1 px-2 rounded">شنبه ها</h6>
                                                <p class="m-0 pb-1 px-2 text-dark">{{onedayfirst}} الی {{onedaylast}}</p>
                                            </div>
                                        </div>
    
                                        <div class="col-lg-6 mb-3 text-center">  
                                            <div class="bg-light rounded p-1">
                                                <h6 class="bg-violet text-light p-1 px-2 rounded">یکشنبه ها</h6>
                                                <p class="m-0 pb-1 px-2 text-dark">{{twodayfirst}} الی {{twodaylast}}</p>
                                            </div>
                                        </div>
    
                                        <div class="col-lg-6 mb-3 text-center">
                                            <div class="bg-light rounded p-1">
                                                <h6 class="bg-violet text-light p-1 px-2 rounded">دوشنبه ها</h6>
                                                <p class="m-0 pb-1 px-2 text-dark">{{treedayfirst}} الی {{treedaylast}}</p>
                                            </div>
                                        </div>
    
                                        <div class="col-lg-6 mb-3 text-center">
                                            <div class="bg-light rounded p-1">
                                                <h6 class="bg-violet text-light p-1 px-2 rounded">سه شنبه ها</h6>
                                                <p class="m-0 pb-1 px-2 text-dark">{{fourdayfirst}} الی {{fourdaylast}}</p>
                                            </div>
                                        </div>
    
                                        <div class="col-lg-6 mb-3 text-center">
                                            <div class="bg-light rounded p-1">
                                                <h6 class="bg-violet text-light p-1 px-2 rounded">چهارشنبه ها</h6>
                                                <p class="m-0 pb-1 px-2 text-dark">{{fivedayfirst}} الی {{fivedaylast}}</p>
                                            </div>
                                        </div>
    
                                        <div class="col-lg-6 mb-3 text-center">
                                            <div class="bg-light rounded p-1">
                                                <h6 class="bg-violet text-light p-1 px-2 rounded">پنج شنبه ها</h6>
                                                <p class="m-0 pb-1 px-2 text-dark">{{sixdayfirst}} الی {{sixdaylast}}</p>
                                            </div>
                                        </div>
    
                                        <div class="col-12 mb-3 text-center">
                                            <div class="bg-light rounded p-1">
                                                <h6 class="bg-violet text-light p-1 px-2 rounded">جمعه ها</h6>
                                                <p class="m-0 pb-1 px-2 text-dark">{{sevendayfirst}} الی {{sevendaylast}}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>  
                                
                            </div>
                        </div>
                        <div v-else class="card-block pb-4">
                            <h6 class="text-right border-bottom m-0 py-2 mb-2"><a class="text-dark" data-toggle="collapse" href="#user" >ویرایش اطلاعات کاربر</a></h6>
                            <div id="user" class="col-12 collapse show">
                                <div class="row">
                                    <div class="form-group col-6">
                                        <label for="name">کدملی</label>
                                        <input type="text" class="form-control text-right name" placeholder="کدملی" v-model="user.codeMelly" required >
                                    </div>
                                    <div class="form-group col-6">
                                        <label for="name">تاریخ تولد</label>
                                        <date-picker v-model="user.birthDay"></date-picker>
                                    </div>
                                    <div class="form-group col-lg-6 col-12">
                                        <label for="name">نام خانوادگی</label>
                                        <input type="text" class="form-control text-right" placeholder="نام خانوادگی" v-model="user.last_name" required >
                                    </div>
                                    <div class="form-group col-lg-6 col-12">
                                        <label for="name">نام</label>
                                        <input type="text" class="form-control text-right" placeholder="نام کوچک" v-model="user.first_name" required >
                                    </div>
                                    <div class="form-group col-6">
                                        <label for="name">استان</label>
                                        <input type="text" class="form-control text-right" placeholder="استان" v-model="user.province" required >
                                    </div>
                                    <div class="form-group col-6">
                                        <label for="name">شهر</label>
                                        <input type="text" class="form-control text-right" placeholder="شهر" v-model="user.city" required >
                                    </div>
                                    <div class="form-group col-12">
                                        <label for="name">آدرس</label>
                                        <textarea rows="3" class="form-control text-right" v-model="user.address" ></textarea>
                                    </div>
                                </div>
                            </div>
    
                            <h6 v-if="is_doctor" class="text-right border-bottom m-0 py-2 mb-2"><a class="text-dark" data-toggle="collapse" href="#doctor" >ویرایش اطلاعات مشاور</a></h6>
                            <div id="doctor" class="col-12 collapse show">
                                <div v-if="is_doctor" class="row">
                                    <div class="form-group col-2">
                                        <label for="services">سرویس</label>
                                        <input type="checkbox" class="form-control mt-2" id="services" v-model="doctor[0].services">
                                    </div>
                                    <div class="form-group col-10">
                                        <label for="old">بایوگرافی</label>
                                        <textarea class="form-control" name="old" id="old" v-model="doctor[0].older" rows="4" ></textarea>
                                    </div>
                                    <div class="form-group col-lg-6">
                                        <label for="visit_type">مدرک تحصیلی</label>
                                        <input type="text" class="form-control" v-model="doctor[0].certificate">
                                    </div>
                                    <div class="form-group col-lg-6">
                                        <label for="services">شماره پروانه صنفی</label>
                                        <input type="text" class="form-control" id="uid" v-model="doctor[0].uid">
                                    </div>
                                    <div class="form-group col-lg-6">
                                        <label for="msg_rate">شماره شبا</label>
                                        <input type="text" class="form-control text-right name" id="msg_rate" v-model="doctor[0].shaba">
                                    </div>
                                    <div class="form-group col-lg-6 col-12">
                                        <label for="view_type">نوع ویزیت</label>
                                        <select class="form-control text-right" id="view_type" v-model="doctor[0].visit_type">
                                            <option value="m">فقط پیام</option>
                                            <option value="c">فقط تماس</option>
                                            <option value="b">پیام و تماس</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-6">
                                        <label for="call_rate">قیمت تماس</label>
                                        <input type="text" class="form-control text-right name" id="call_rate" v-model="doctor[0].call_price">
                                        <div class="form-group mt-3 d-none d-lg-block">
                                            <label for="msg_rate">قیمت پیام</label>
                                            <input type="text" class="form-control text-right name" id="msg_rate" v-model="doctor[0].msg_price">
                                        </div>
                                    </div>
                                    <div class="form-group col-6 d-lg-none">
                                            <label for="msg_rate">قیمت پیام</label>
                                            <input type="text" class="form-control text-right name" id="msg_rate" v-model="doctor[0].msg_price">
                                        </div>
                                    <div class="form-group col-lg-6 col-12">
                                        <label for="category">تخصص</label>
                                        <select v-model="doctor[0].category" multiple class="form-control">
                                            <option v-for="cat in category" :value="cat.id" :key="cat.id">{{cat.title}}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
    
                            <h6 v-if="is_doctor" class="text-right border-bottom m-0 py-2 mb-2"><a class="text-dark" data-toggle="collapse" href="#collapseExample" >تغییر ساعت کاری روزهای هفته</a></h6>
                            <div id="collapseExample" class="col-12 collapse show">
                                <div v-if="is_doctor" class="small">
    
                                    <div class="my-3 col-lg-12">
                                        <h6>تغییر ساعت کاری روزهای شنبه</h6>
                                        <div class="row">
                                            <div class="col-6">از ساعت<date-picker v-model="onedayfirst" type="time"/></div>
                                            <div class="col-6">تا ساعت<date-picker v-model="onedaylast" type="time"/></div>
                                        </div>
                                    </div>
                                    
                                    <div class="my-3 col-lg-12">
                                        <h6>تغییر ساعت کاری روزهای یکشنبه</h6>
                                        <div class="row">
                                            <div class="col-6">از ساعت<date-picker v-model="twodayfirst" type="time"/></div>
                                            <div class="col-6">تا ساعت<date-picker v-model="twodaylast" type="time"/></div>
                                        </div>
                                    </div>

                                    <div class="my-3 col-lg-12">
                                        <h6>تغییر ساعت کاری روزهای دوشنبه</h6>
                                        <div class="row">
                                            <div class="col-6">از ساعت<date-picker v-model="treedayfirst" type="time"/></div>
                                            <div class="col-6">تا ساعت<date-picker v-model="treedaylast" type="time"/></div>
                                        </div>
                                    </div>

                                    <div class="my-3 col-lg-12">
                                        <h6>سه تغییر ساعت کاری روزهای شنبه</h6>
                                        <div class="row">
                                            <div class="col-6">از ساعت<date-picker v-model="fourdayfirst" type="time"/></div>
                                            <div class="col-6">تا ساعت<date-picker v-model="fourdaylast" type="time"/></div>
                                        </div>
                                    </div>

                                    <div class="my-3 col-lg-12">
                                        <h6>تغییر ساعت کاری روزهای چهارشنبه</h6>
                                        <div class="row">
                                            <div class="col-6">از ساعت<date-picker v-model="fivedayfirst" type="time"/></div>
                                            <div class="col-6">تا ساعت<date-picker v-model="fivedaylast" type="time"/></div>
                                        </div>
                                    </div>

                                    <div class="my-3 col-lg-12">
                                        <h6>پنج تغییر ساعت کاری روزهای شنبه</h6>
                                        <div class="row">
                                            <div class="col-6">از ساعت<date-picker v-model="sixdayfirst" type="time"/></div>
                                            <div class="col-6">تا ساعت<date-picker v-model="sixdaylast" type="time"/></div>
                                        </div>
                                    </div>
                                    
                                    <div class="my-3 col-lg-12">
                                        <h6>تغییر ساعت کاری روزهای جمعه</h6>
                                        <div class="row">
                                            <div class="col-6">از ساعت<date-picker v-model="sevendayfirst" type="time"/></div>
                                            <div class="col-6">تا ساعت<date-picker v-model="sevendaylast" type="time"/></div>
                                        </div>
                                    </div>
    
                                </div>
                                <hr>  
                            </div>
    
                            <button @click="doEdit" class="btn btn-warning rounded" >ویرایش اطلاعات</button>
                        </div>
                    </div>
                </div>
            </div>
                
        </div>
        
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import DatePicker from 'vue3-persian-datetime-picker'
// import User from '@/components/User.vue'

export default {
  name: 'DashboardPage',
  components: {
    DatePicker
    // User,
  }, 
  data () {
    return { 
      numbers: null,
      anime: false,

      documentTitle: '',
      documentImage: '',
      imgDuc: '',
      edit: false,
      imageAvatar: true,

      subjectNumber: '',
      numberNumber: '',
      numberCreateError: '',
      user: {},
      amount: '',
      doctor: {},
      category: {},
      is_doctor: false,
      msgNotSee: 0,
      onedayfirst: '',
      onedaylast: '',
      twodayfirst: '',
      twodaylast: '',
      treedayfirst: '',
      treedaylast: '',
      fourdayfirst: '',
      fourdaylast: '',
      fivedayfirst: '',
      fivedaylast: '',
      sixdayfirst: '',
      sixdaylast: '',
      sevendayfirst: '',
      sevendaylast: '',

      usersVisits: 0,
    }
  },
  mounted() {
    this.$store.state.filter = false
    
    axios.get('/api/auth/users/me/')
        .then(response => {
            axios.get('numbers').then(response => { if (response.data.results.length) { this.numbers = response.data.results } })
            localStorage.setItem("userId", response.data.id)
            localStorage.setItem("username", response.data.username)
            this.$store.state.userId = response.data.id
            this.$store.state.username = response.data.username

            axios.get(`messageNotSee/`).then(response => this.msgNotSee = response.data.messageNotSee)
            
            axios.get(`/amount-user/${response.data.id}/`)
                .then(response => {
                    localStorage.setItem("amount", response.data.amount) 
                    this.$store.state.amount = response.data.amount
                    this.amount = response.data.amount
                })

            axios.get(`/my-user/${response.data.id}/`)
                .then(response => { 
                    this.user = response.data
                    if (response.data.first_name.length && response.data.last_name.length) {
                        localStorage.setItem("username", response.data.first_name+' '+response.data.last_name)
                        this.$store.state.username = response.data.first_name+' '+response.data.last_name
                    }
                    axios.get(`/userauthor/?userId=${response.data.id}`)
                        .then(response => {
                            if (response.data.results.length) {
                                this.is_doctor = true
                                localStorage.setItem("doctor", response.data.results[0].id)
                                this.$store.state.doctor = response.data.results[0].id
                                this.doctor = response.data.results
                    
                                this.onedayfirst = response.data.results[0].oneDay.substr(0,5)
                                this.onedaylast = response.data.results[0].oneDay.substr(6,5)
                                this.twodayfirst = response.data.results[0].twoDay.substr(0,5)
                                this.twodaylast = response.data.results[0].twoDay.substr(6,5)
                                this.treedayfirst = response.data.results[0].treeDay.substr(0,5)
                                this.treedaylast = response.data.results[0].treeDay.substr(6,5)
                                this.fourdayfirst = response.data.results[0].fourDay.substr(0,5)
                                this.fourdaylast = response.data.results[0].fourDay.substr(6,5)
                                this.fivedayfirst = response.data.results[0].fiveDay.substr(0,5)
                                this.fivedaylast = response.data.results[0].fiveDay.substr(6,5)
                                this.sixdayfirst = response.data.results[0].sixDay.substr(0,5)
                                this.sixdaylast = response.data.results[0].sixDay.substr(6,5)
                                this.sevendayfirst = response.data.results[0].sevenDay.substr(0,5)
                                this.sevendaylast = response.data.results[0].sevenDay.substr(6,5)
                                axios.get('/category/').then(response => this.category = response.data.results )

                            }
                        })
                    
                })
        })
        .catch(e => {
            console.table(e.response.data)
            this.$store.commit("logout")
            this.$router.push("/login")
        })
        .finally(() => this.$store.state.runAnimation = false )

  },
  methods: {  
    doEdit() {
        this.anime = true
        axios.patch(`/my-user/${this.user.id}/`, {
            first_name: this.user.first_name,
            last_name: this.user.last_name,
            birthDay: this.user.birthDay,
            codeMelly: this.user.codeMelly,
            province: this.user.province,
            city: this.user.city,
            address: this.user.address
        })
        .then(response => {
            console.table(response)
            this.edit = false
        })
        .catch(e => {
            console.table(e.response.status, e.response.data)
            document.querySelector('.errors_box').classList.remove('d-none');
            var show_error  = document.querySelector('.errors_list');
            show_error.innerHTML    = JSON.stringify( e.response.data )
            
        })
        if (this.is_doctor) {

            let e_oneDay = this.onedayfirst+','+this.onedaylast
            if (this.onedayfirst == '' || this.onedaylast == '') { e_oneDay = this.doctor[0].oneDay }
            
            let e_twoDay = this.twodayfirst+','+this.twodaylast
            if (this.twodayfirst == '' || this.twodaylast == '') { e_twoDay = this.doctor[0].twoDay }
            
            let e_treeDay = this.treedayfirst+','+this.treedaylast
            if (this.treedayfirst == '' || this.treedaylast == '') { e_treeDay = this.doctor[0].treeDay }
            
            let e_fourDay = this.fourdayfirst+','+this.fourdaylast
            if (this.fourdayfirst == '' || this.fourdaylast == '') { e_fourDay = this.doctor[0].fourDay }
            
            let e_fiveDay = this.fivedayfirst+','+this.fivedaylast
            if (this.fivedayfirst == '' || this.fivedaylast == '') { e_fiveDay = this.doctor[0].fiveDay }
            
            let e_sixDay = this.sixdayfirst+','+this.sixdaylast
            if (this.sixdayfirst == '' || this.sixdaylast == '') { e_sixDay = this.doctor[0].sixDay }
            
            let e_sevenDay = this.sevendayfirst+','+this.sevendaylast
            if (this.sevendayfirst == '' || this.sevendaylast == '') { e_sevenDay = this.doctor[0].sevenDay }

            axios.patch(`/createauthor/${this.user.id}/`, {
                uid: this.doctor[0].uid,
                call_price: this.doctor[0].call_price,
                msg_price: this.doctor[0].msg_price,
                status: this.doctor[0].status,
                older: this.doctor[0].older,
                shaba: this.doctor[0].shaba,
                visit_type: this.doctor[0].visit_type,
                services: this.doctor[0].services,
                category: this.doctor[0].category,
                certificate: this.doctor[0].certificate,
                oneDay: e_oneDay,
                twoDay: e_twoDay,
                treeDay: e_treeDay,
                fourDay: e_fourDay,
                fiveDay: e_fiveDay,
                sixDay: e_sixDay,
                sevenDay: e_sevenDay,
            })
            .then(response => {
                console.log(response.data)
                // location.reload()
            })
            .catch(e => {
                console.log(e.response.status, e.response.data)
                document.querySelector('.errors_box').classList.remove('d-none');
                var show_error  = document.querySelector('.errors_list');
                show_error.innerHTML    = JSON.stringify( e.response.data )
            })
        }
    },
    setAvatar(event) {
        this.$store.state.runAnimation = true
        this.imageAvatar = false
        document.querySelectorAll('.closeModal').forEach(modal => {
            modal.click()
        });
        let file   = event.target.files[0]
        let custom = file.slice(0, file.size); 
        this.avatar = new File([custom], this.user.id+'-'+file.name);
        
        const fd = new FormData();
        fd.append('avatar', this.avatar, this.avatar.name) 
        
        axios.patch(`/my-user/${this.user.id}/`,fd)
        .then(response => {
            this.edit = false
            this.user.avatar = response.data.avatar
        })
        .catch(e => {console.table(e.response.status, e.response.data), alert('مشگل در ارسال اطلاعات کاربر')})
        .finally(() => this.$store.state.runAnimation = false )
    },
    sendDocuments(event) {
        document.querySelectorAll('.closeModal').forEach(modal => {
            modal.click()
        });
        this.anime = true
        if (this.documentTitle && event) {
            var currentdate = new Date(); 
            var datetime = currentdate.getFullYear()
            +''+currentdate.getMonth()
            +''+currentdate.getDay()
            +''+currentdate.getHours()
            +''+currentdate.getMinutes()
            +''+currentdate.getSeconds()

            let file   = event.target.files[0]
            let custom = file.slice(0, file.size);
            this.documentImage = new File([custom], `${this.user.id}-${this.documentTitle}-${datetime}-${file.name}`);
            const fd = new FormData();
            fd.append('userId', this.user.id) 
            fd.append('title', this.documentTitle) 
            fd.append('baner', this.documentImage, this.documentImage.name) 
            
            axios.post(`document/`,fd)
                .then(response => {
                    console.table(response)
                    this.anime = ''
                    alert('مدارک با موفقیت ارسال شد')
                })
                .catch(e => {console.table(e.response.status, e.response.data), alert('مشگل در ارسال اطلاعات کاربر')})
        }
    },
    checkName(user) {
        let notification = []
        if (!user.first_name) { notification.push(' نام ') }
        if (!user.last_name) { notification.push(' فامیلی ') }
        if (!user.birthDay) { notification.push(' تاریخ تولد ') }
        if (!user.codeMelly) { notification.push(' کدملی ') }
        if (!user.province) { notification.push(' استان ') }
        if (!user.city) { notification.push(' شهر ') }
        if (!user.address) { notification.push(' آدرس ') }

        if (notification.length > 0) {
            return `ابتدا اطلاعات خود مثل ${String(notification)} کامل کنید`
        }
    
    },
    formatMoney(number) {
        let money = (number / 10).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        if (money.length > 0) {
            return `تومان ${money.substr(1,money.length-4)}`
        }
    },
    numberCreate() {
        if (this.numberNumber.length < 10 || this.numberNumber.length > 10 || this.subjectNumber.length < 3) {
            this.numberCreateError = "موبایل باید ۱۰ شماره باشد و عنوان حداقل ۳ کاراکتر باشد"
            if (this.numberNumber.length == 0 || this.subjectNumber.length==0 ) {
                this.numberCreateError = "فیلد موبایل و عنوان اجباری هست"
            }
        } else {
            document.querySelectorAll('.closeModal').forEach(modal => {
                modal.click()
            });
            this.numberCreateError = ''
            axios.post('numbers/', {
                userId: this.user.id,
                number: this.numberNumber,
                subject: this.subjectNumber,
            })
            .then(response => { 
                console.table(response)
                axios.get('numbers/').then(response => this.numbers = response.data.results ) 
            })
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
