<template>
    <div>
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
                        
                        <div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">انصراف</button></div>
                        
                    </div>
                </div>
            </div>
        </div>

        <!-- number create -->
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
                    <div class="col text-left"><button type="button" class="btn btn-danger" data-dismiss="modal">انصراف</button></div>
                    <div class="col text-right">
                        <button @click="numberCreate()" class="btn text-light" style="background-color: #3c0b64;">ثبت شماره</button>
                    </div>
                </div>

                </div>
            </div>
        </div>

        <div class="user-card-full text-dark" >

            <div class="d-none d-lg-block">
                <div class="text-right row">
                    <div v-if="doctor.length" class="col"><router-link to="/revenue" class="btn btn-block btn-outline-secondary">درآمد من</router-link></div>
                    <div class="col"> <router-link to="/transaction" class="btn btn-block btn-outline-secondary">صورتحساب</router-link></div>
                    <div class="col"><router-link to="/callLog" class="btn btn-block btn-outline-secondary">تماس ها</router-link></div>
                    <div class="col"> <router-link to="/notification" class="btn btn-block btn-outline-secondary">اعلانات</router-link></div>
                    <div class="col"><router-link to="/connection" class="btn btn-block btn-outline-secondary">مشاوران محبوب</router-link></div>
                    <div class="col"> <router-link to="/category" class="btn btn-block btn-outline-secondary">لیست مشاوران</router-link></div>
                </div>
            </div>

            <div class="row m-l-0 m-r-0">
                
                <div v-if="anime" class="ring">
                    بارگذاری
                    <td></td>
                </div>

                <div class="col-lg-3 bg-c-lite-green user-profile">
                    <div class="mt-2 mb-2">
                    </div>
                    <div class="card-block text-center">
                        <div class="m-b-25">
                            <img v-if="user.avatar" :src="user.avatar" class="my-img rounded-circle" alt="User-Profile-Image">
                            <img v-else :src="require('@/assets/edit.png')" class="my-img img-radius" alt="User-Profile-Image">
                            <br>
                            <!-- <a href="#" data-toggle="modal" data-target="#fileupload" v-if="imageAvatar" > 
                                <p class="bg-white rounded mt-2 mr-5 ml-5 p-1 text-dark">ارسال تصویر</p>
                            </a> -->
                            <!-- <br> -->
                            <div v-if="imageAvatar" class="btn btn-light btn-file pt-2 pb-2 pr-2 pl-2 mt-4" style="color: #3c0b64;border-radius: 15px;">
                                ارسال تصویر آواتار
                                <input v-if="imageAvatar" type="file" accept="image/*" @change="setAvatar($event)" >
                            </div>

                            <!-- مودال ارسال اواتار -->
                            <div class="modal fade" id="fileupload">
                                <div class="modal-dialog modal-xl">
                                    <div class="modal-content">
                                        <!-- Modal body -->
                                        <div class="modal-body col-10 mx-auto rounded">
                                            <h6 class="text-right">انتخاب فایل</h6><br>
                                            <div class="custom-file mb-4">
                                                <input v-if="imageAvatar" type="file" class="custom-file-input" accept="image/*" @change="setAvatar($event)" >
                                                <label class="custom-file-label" for="customFile">اینجا کلیک کنید</label>
                                            </div>
                                        </div>
                                        
                                        <!-- Modal footer -->
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-dismiss="modal">بستن</button>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                            <!-- پابان مودال ارسال اواتار -->
                        </div>
                        <button type="button" class="border bg-white p-1 pr-4 pl-4 redu20 mb-2" @click="edit=!edit">
                            <img src="https://img.icons8.com/wired/50/000000/edit-user-male.png"/>
                            <br>
                            ویرایش اطلاعات
                        </button>
                        <div class="text-light mt-2 h5">{{user.username}}</div>
                    </div>
                </div>
                <div class="col-lg">
                    <div v-if="!edit" class="card-block">
                        <h6 class="m-b-20 p-b-5 b-b-default mt-2">افزودن شماره تماس <small class="text-muted">جدید</small></h6>
                        <div class="text-right">
                            <button data-toggle="modal" data-target="#numberModal" class="btn btn-sm text-light" style="background-color: #3c0b64">+ افزودن شماره</button>
                        </div>
                        <div v-if="numbers" class="row mt-3 mb-3">
                            <div class="col-lg-4 col-6 text-right" v-for="number in numbers" :key="number.id">
                                <div class="border rounded">
                                    <h6 class="f-w-400 bg-violet text-light p-3 rounded">عنوان : {{number.subject}}</h6>
                                    <h6 class="f-w-400 mb-1 p-2 pr-3">0{{number.number}}</h6>
                                </div>
                            </div>
                        </div>

                        <h6 class="m-b-20 p-b-5 b-b-default mt-2">اطلاعات کاربر</h6>
                        <div class="row">
                            <div class="col-lg-6 col-8">
                                <p class="m-b-10">نام کامل</p>
                                <h6 class="f-w-400">{{user.first_name +' '+ user.last_name || 'هنوز وارد نشده' }}</h6>
                            </div>
                            <div class="col-lg-6 col">
                                <p class="m-b-10">اعتبار</p>
                                <h6 class="f-w-400">{{formatMoney( parseInt(amount) )}}</h6>
                            </div>
                        </div>
                        
                        <h6 v-if="is_doctor" class="m-b-20 m-t-40 p-b-5 b-b-default">اطلاعات دکتر</h6>
                        <div v-if="is_doctor" class="row">
                            <div class="col-lg-6 col-7">
                                <p class="m-b-10">شماره پروانه صنفی</p>
                                <h6 v-if="doctor[0].uid==123456789" class="f-w-400">وارد نشده</h6>
                                <h6 v-else class="f-w-400">{{doctor[0].uid}}</h6>
                            </div>

                            <div class="col-lg-6 col">
                                <p class="m-b-10">تخصص</p>
                                <div v-for="c in doctor[0].category" :key="c.id">
                                    <div v-for="cat in category" :key="cat.id">
                                        <h6 v-if="c == cat.id" class="f-w-400">
                                            {{cat.title}}
                                        </h6>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12">
                                <p class="m-b-10">بایوگرافی</p>
                                <h6 class="f-w-400">{{doctor[0].older}}</h6>
                            </div>
                        </div>
                        <h6 v-if="is_doctor" class="m-b-20 m-t-40 p-b-5 b-b-default">شرایط دکتر</h6>
                        <div v-if="is_doctor" class="row">
                            <div class="col-lg-3 col-6">
                                <p class="m-b-10">مدرک تحصیلی</p>
                                <h6 class="f-w-400" >{{doctor[0].certificate}}</h6>
                            </div> 
                            <div class="col-lg-3 col-6">
                                <p class="m-b-10">نوع ویزیت</p>
                                <h6 class="f-w-400" v-if="doctor[0].visit_type=='c'">فقط تماس</h6>
                                <h6 class="f-w-400" v-if="doctor[0].visit_type=='m'">فقط پیام</h6>
                                <h6 class="f-w-400" v-if="doctor[0].visit_type=='b'">پیام و تماس</h6>
                            </div>
                            <div class="col-lg-3 col-6">
                                <p class="m-b-10">قیمت پیام</p>
                                <h6 class="f-w-400">{{doctor[0].msg_price}} تومان</h6>
                            </div>
                            <div class="col-lg-3 col-6">
                                <p class="m-b-10"> قیمت تماس</p>
                                <h6 class="f-w-400">{{doctor[0].call_price}} تومان</h6>
                            </div>
                            
                            <div v-if="is_doctor" class="col-12">
                                <h6 class="m-b-20 m-t-40 p-b-5 b-b-default">وضعیت ساعت کاری روزهای هفته</h6>
                                <div class="row">

                                    <div class="col-xl-3 col-lg-4 col-6 mb-2">
                                        <div class="border redu20 p-3"><h6>شنبه ها</h6>{{` ${onedayfirst} از ساعت `}} <br> {{`تا ساعت ${onedaylast}`}}</div>
                                    </div>

                                    <div class="col-xl-3 col-lg-4 col-6 mb-2">  
                                        <div class="border redu20 p-3"><h6>یکشنبه ها</h6>{{` ${twodayfirst} از ساعت `}} <br> {{`تا ساعت ${twodaylast}`}}</div>
                                    </div>

                                    <div class="col-xl-3 col-lg-4 col-6 mb-2">
                                        <div class="border redu20 p-3"><h6>دوشنبه ها</h6>{{` ${treedayfirst} از ساعت `}} <br> {{`تا ساعت ${treedaylast}`}}</div>
                                    </div>

                                    <div class="col-xl-3 col-lg-4 col-6 mb-2">
                                        <div class="border redu20 p-3"><h6>سه شنبه ها</h6>{{` ${fourdayfirst} از ساعت `}} <br> {{`تا ساعت ${fourdaylast}`}}</div>
                                    </div>

                                    <div class="col-xl-3 col-lg-4 col-6 mb-2">
                                        <div class="border redu20 p-3"><h6>چهارشنبه ها</h6>{{` ${fivedayfirst} از ساعت `}} <br> {{`تا ساعت ${fivedaylast}`}}</div>
                                    </div>

                                    <div class="col-xl-3 col-lg-4 col-6 mb-2">
                                        <div class="border redu20 p-3"><h6>پنج شنبه ها</h6>{{` ${sixdayfirst} از ساعت `}} <br> {{`تا ساعت ${sixdaylast}`}}</div>
                                    </div>

                                    <div class="col-xl-3 col-lg-4 col-6 mb-2">
                                        <div class="border redu20 p-3"><h6>جمعه ها</h6>{{` ${sevendayfirst} از ساعت `}} <br> {{`تا ساعت ${sevendaylast}`}}</div>
                                    </div>
                                </div>
                            </div>  
                            
                        </div>
                    </div>
                    <div v-else class="card-block">
                        <h6 class="m-b-20 p-b-5 b-b-default"><a class="text-dark" data-toggle="collapse" href="#user" >ویرایش اطلاعات کاربر</a></h6>
                        <div id="user" class="col-12 collapse show">
                            <!-- <div class="row">
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
                            </div> -->
                        </div>

                        <h6 v-if="is_doctor" class="m-b-20 p-b-5 b-b-default"><a class="text-dark" data-toggle="collapse" href="#doctor" >ویرایش اطلاعات مشاور</a></h6>
                        <div id="doctor" class="col-12 collapse">
                            <!-- <div v-if="is_doctor" class="row">
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
                            </div> -->
                        </div>

                        <h6 v-if="is_doctor" class="m-b-20 p-b-5 b-b-default"><a class="text-dark" data-toggle="collapse" href="#collapseExample" >تغییر ساعت کاری روزهای هفته</a></h6>
                        <div id="collapseExample" class="col-12 collapse">
                            <div v-if="is_doctor" class="small">

                                <div class="">
                                    <div class="mb-2">
                                        <h6>تغییر ساعت کاری روزهای شنبه</h6>
                                        <div class="row">
                                            <div class="col-4"><date-picker v-model="e_onedaylast" type="time" /></div>
                                            <div class="col mt-2">تا ساعت</div>
                                            <div class="col-4"><date-picker v-model="e_onedayfirst" type="time" /></div>
                                            <div class="col mt-2">از ساعت</div>
                                        </div>
                                    </div>
                                    
                                    <div class="mb-2">
                                        <h6>تغییر ساعت کاری روزهای یکشنبه</h6>
                                        <div class="row">
                                            <div class="col-4"><date-picker v-model="e_twodaylast" type="time" /></div>
                                            <div class="col mt-2">تا ساعت</div>
                                            <div class="col-4"><date-picker v-model="e_twodayfirst" type="time" /></div>
                                            <div class="col mt-2">از ساعت</div>
                                        </div>
                                    </div>

                                    <div class="mb-2">
                                        <h6>تغییر ساعت کاری روزهای دوشنبه</h6>
                                        <div class="row">
                                            <div class="col-4"><date-picker v-model="e_treedaylast" type="time" /></div>
                                            <div class="col mt-2">تا ساعت</div>
                                            <div class="col-4"><date-picker v-model="e_treedayfirst" type="time" /></div>
                                            <div class="col mt-2">از ساعت</div>
                                        </div>
                                    </div>

                                    <div class="mb-2">
                                        <h6>سه تغییر ساعت کاری روزهای شنبه</h6>
                                        <div class="row">
                                            <div class="col-4"><date-picker v-model="e_fourdaylast" type="time" /></div>
                                            <div class="col mt-2">تا ساعت</div>
                                            <div class="col-4"><date-picker v-model="e_fourdayfirst" type="time" /></div>
                                            <div class="col mt-2">از ساعت</div>
                                        </div>
                                    </div>

                                    <div class="mb-2">
                                        <h6>تغییر ساعت کاری روزهای چهارشنبه</h6>
                                        <div class="row">
                                            <div class="col-4"><date-picker v-model="e_fivedaylast" type="time" /></div>
                                            <div class="col mt-2">تا ساعت</div>
                                            <div class="col-4"><date-picker v-model="e_fivedayfirst" type="time" /></div>
                                            <div class="col mt-2">از ساعت</div>
                                        </div>
                                    </div>

                                    <div class="mb-2">
                                        <h6>پنج تغییر ساعت کاری روزهای شنبه</h6>
                                        <div class="row">
                                            <div class="col-4"><date-picker v-model="e_sixdaylast" type="time" /></div>
                                            <div class="col mt-2">تا ساعت</div>
                                            <div class="col-4"><date-picker v-model="e_sixdayfirst" type="time" /></div>
                                            <div class="col mt-2">از ساعت</div>
                                        </div>
                                    </div>
                                    
                                    <div class="mb-2">
                                        <h6>تغییر ساعت کاری روزهای جمعه</h6>
                                        <div class="row">
                                            <div class="col-4"><date-picker v-model="e_sevendaylast" type="time" /></div>
                                            <div class="col mt-2">تا ساعت</div>
                                            <div class="col-4"><date-picker v-model="e_sevendayfirst" type="time" /></div>
                                            <div class="col mt-2">از ساعت</div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <hr>  
                        </div>

                        <button @click="doEdit" class="border redu20 p-3 text-dark" >ویرایش اطلاعات</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import axios from 'axios'
    import DatePicker from 'vue3-persian-datetime-picker'

    export default {
        name: 'UserComponent',
        components: {
            DatePicker
        },
        props: {
            user: {},
            amount: null,
            doctor: {},
            category: {},
            is_doctor: null,
            days: null,

            onedayfirst: null,
            onedaylast: null,
            twodayfirst: null,
            twodaylast: null,
            treedayfirst: null,
            treedaylast: null,
            fourdayfirst: null,
            fourdaylast: null,
            fivedayfirst: null,
            fivedaylast: null,
            sixdayfirst: null,
            sixdaylast: null,
            sevendayfirst: null,
            sevendaylast: null,
        },
        data() {
            return {
                numbers: null,
                anime: false,

                documentTitle: '',
                documentImage: '',
                imgDuc: '',
                edit: false,
                imageAvatar: true,

                e_onedayfirst: '',
                e_onedaylast: '',
                e_twodayfirst: '',
                e_twodaylast: '',
                e_treedayfirst: '',
                e_treedaylast: '',
                e_fourdayfirst: '',
                e_fourdaylast: '',
                e_fivedayfirst: '',
                e_fivedaylast: '',
                e_sixdayfirst: '',
                e_sixdaylast: '',
                e_sevendayfirst: '',
                e_sevendaylast: '',

                subjectNumber: '',
                numberNumber: '',
                numberCreateError: '',
            }
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
                .catch(e => {console.table(e.response.status, e.response.data), alert('مشگل در ارسال اطلاعات کاربر')})
                if (this.is_doctor) {

                    let e_oneDay = this.e_onedayfirst+','+this.e_onedaylast
                    if (this.e_onedayfirst == '' || this.e_onedaylast == '') { e_oneDay = this.doctor[0].oneDay }
                    
                    let e_twoDay = this.e_twodayfirst+','+this.e_twodaylast
                    if (this.e_twodayfirst == '' || this.e_twodaylast == '') { e_twoDay = this.doctor[0].twoDay }
                    
                    let e_treeDay = this.e_treedayfirst+','+this.e_treedaylast
                    if (this.e_treedayfirst == '' || this.e_treedaylast == '') { e_treeDay = this.doctor[0].treeDay }
                    
                    let e_fourDay = this.e_fourdayfirst+','+this.e_fourdaylast
                    if (this.e_fourdayfirst == '' || this.e_fourdaylast == '') { e_fourDay = this.doctor[0].fourDay }
                    
                    let e_fiveDay = this.e_fivedayfirst+','+this.e_fivedaylast
                    if (this.e_fivedayfirst == '' || this.e_fivedaylast == '') { e_fiveDay = this.doctor[0].fiveDay }
                    
                    let e_sixDay = this.e_sixdayfirst+','+this.e_sixdaylast
                    if (this.e_sixdayfirst == '' || this.e_sixdaylast == '') { e_sixDay = this.doctor[0].sixDay }
                    
                    let e_sevenDay = this.e_sevendayfirst+','+this.e_sevendaylast
                    if (this.e_sevendayfirst == '' || this.e_sevendaylast == '') { e_sevenDay = this.doctor[0].sevenDay }

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
                        console.table(response.data)
                        location.reload()
                    })
                    .catch(e => {console.table(e.response.status, e.response.data), alert('مشگل در ارسال اطلاعات تخصص کاربر')})
                }
                this.anime = false
            },
            setAvatar(event) {
                this.anime = true
                this.imageAvatar = false
                // $("[data-dismiss=modal]").trigger({ type: "click" });
                let file   = event.target.files[0]
                let custom = file.slice(0, file.size); 
                this.avatar = new File([custom], this.user.id+'-'+file.name);
                
                const fd = new FormData();
                fd.append('avatar', this.avatar, this.avatar.name) 
                
                axios.patch(`/my-user/${this.user.id}/`,fd)
                .then(response => {
                    console.table(response)
                    this.edit = false
                    // this.user.avatar = response.data.avatar
                    this.anime = ''
                })
                .catch(e => {console.table(e.response.status, e.response.data), alert('مشگل در ارسال اطلاعات کاربر')})
            },
            sendDocuments(event) {
                // $("[data-dismiss=modal]").trigger({ type: "click" });
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
                    // $("[data-dismiss=modal]").trigger({ type: "click" });
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
        },
        mounted() {
            // $(document).ready(function () {
            //     $('.name').keypress(function (e) {
            //         var regex = new RegExp("^[0-9]+$");
            //         var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
            //         if (regex.test(str)) {
            //             return true;
            //         }
            //         e.preventDefault();
            //         return false;
            //     }); 
            // })
            axios.get('numbers').then(response => { if (response.data.results.length) { this.numbers = response.data.results } })
        },
    }

</script>

<style>
    .my-img {
        width: 200px;
        height: 200px;
    }
    .small-img {
        width: 75px;
    }
    .user-card-full {
        overflow: hidden
    }

    .card {
        border-radius: 5px;
        -webkit-box-shadow: 0 1px 20px 0 rgba(69, 90, 100, 0.08);
        box-shadow: 0 1px 20px 0 rgba(69, 90, 100, 0.08);
        border: none;
        margin-bottom: 30px
    }

    .m-r-0 {
        margin-right: 0px
    }

    .m-l-0 {
        margin-left: 0px
    }

    .user-card-full .user-profile {
        border-radius: 5px 0 0 5px
    }

    .bg-c-lite-green {
        background: -webkit-gradient(linear, left top, right top, from(#3c0b64b9), to(#3c0b64));
    }

    .user-profile {
        padding: 20px 0
    }

    .card-block {
        padding: 1.25rem
    }

    .m-b-25 {
        margin-bottom: 25px
    }

    h6 {
        font-size: 14px
    }

    .card .card-block p {
        line-height: 25px
    }

    @media only screen and (min-width: 1400px) {
        p {
            font-size: 14px
        }
    }

    .card-block {
        padding: 1.25rem
    }

    .b-b-default {
        border-bottom: 1px solid #e0e0e0
    }

    .m-b-20 {
        margin-bottom: 20px
    }

    .p-b-5 {
        padding-bottom: 5px !important
    }

    .card .card-block p {
        line-height: 25px
    }

    .m-b-10 {
        margin-bottom: 10px
    }

    .text-muted {
        color: #919aa3 !important
    }

    .b-b-default {
        border-bottom: 1px solid #e0e0e0
    }

    .m-b-20 {
        margin-bottom: 20px
    }

    .m-t-40 {
        margin-top: 20px
    }

    .p-b-5 {
        padding-bottom: 5px !important
    }

    .m-b-10 {
        margin-bottom: 10px
    }

    .m-t-40 {
        margin-top: 20px
    }

    .user-card-full .social-link li {
        display: inline-block
    }

    .user-card-full .social-link li a {
        font-size: 20px;
        margin: 0 10px 0 0;
        -webkit-transition: all 0.3s ease-in-out;
        transition: all 0.3s ease-in-out
    }
</style>

