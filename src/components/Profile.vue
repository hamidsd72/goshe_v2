<template>

    <div v-if="!itemNotFounf">

        <div class="row">
            <div class="col-lg-8">
                <div class="profile-card-view bg-white rounded text-dark p-3 pt-5 mt-5">
                    <div class="avatar">
                        <div class="box">
                            <img v-if="item.userId.avatar" :src="item.userId.avatar" alt="avatar" class="img-circle rounded-circle" :class="item.services && checkTime()?'img-border-success':'img-border-danger' ">
                            <img v-else :src="require(`@/assets/phone.png`)" alt="avatar" class="img-circle rounded-circle" :class="item.services && checkTime()?'img-border-success':'img-border-danger' ">
                            <h6 class="text-dark font-weight-bold m-0 mt-3" v-if="item.userId.first_name">{{String([item.userId.first_name,item.userId.last_name].join(' '))}}</h6>
                            <h6 class="text-dark font-weight-bold m-0 mt-3" v-else>نام شخص وارد نشده</h6>
                            <!-- <p class="text-dark m-0 text-small">{{String(categoryInline(item.category))}}</p> -->
                            <p class="text-dark m-0 mt-1 text-small">{{$store.state.consolationCategory}}</p>
                        </div>
                    </div>
                    
                    <div class="row">
    
                        <div class="col-auto">
                            <div v-if="activeCallLog>0" class="badge badge-light text-danger p-2 rounded">
                                <i class="fas fa-circle mx-1 text-danger"></i>
                                درحال مکالمه
                            </div>
                            <div v-else class="badge badge-light p-2 rounded" :class="(item.services && checkTime())? 'text-success' : 'text-danger' ">
                                <i class="fas fa-circle mx-1" :class="(item.services && checkTime())? 'text-success' : 'text-danger' "></i>
                                {{ (item.services && checkTime())? 'دردسترس' : 'آفلاین' }}
                            </div>
                        </div>
                        
                        <div class="col"></div>
    
                        <div class="col-auto">
                            <div class="badge badge-light p-1">
                                <span v-if="parseInt(geterStarsAndComments[0]) > 0 && parseInt(geterStarsAndComments[0]) < 2">
                                    <Star class="text-zard"/><Star /><Star /><Star /><Star />
                                </span>
                                <span v-else-if="parseInt(geterStarsAndComments[0]) > 1 && parseInt(geterStarsAndComments[0]) < 3">
                                    <Star class="text-zard"/><Star class="text-zard"/><Star /><Star /><Star />
                                </span>
                                <span v-else-if="parseInt(geterStarsAndComments[0]) > 2 && parseInt(geterStarsAndComments[0]) < 4">
                                    <Star class="text-zard"/><Star class="text-zard"/><Star class="text-zard"/><Star /><Star />
                                </span>
                                <span v-else-if="parseInt(geterStarsAndComments[0]) > 3 && parseInt(geterStarsAndComments[0]) < 5">
                                    <Star class="text-zard"/><Star class="text-zard"/><Star class="text-zard"/><Star class="text-zard"/><Star />
                                </span>
                                <span v-else>
                                    <Star class="text-zard"/><Star class="text-zard"/><Star class="text-zard"/><Star class="text-zard"/><Star class="text-zard"/>
                                </span>
                            </div>
                        </div>
                        
                        <div class="col-lg-12 pt-5">
                            <div class="row">
                                <div class="col" v-if="item.visit_type =='m' || item.visit_type =='b'">
                                    <p class="m-0 p-1 py-2 p-lg-3 text-sm-small text-dark bg-light rounded">
                                        مشاوره متنی
                                        {{num2fa(item.msg_price)+' تومان '}}
                                    </p>
                                </div>
                                <div class="col-auto border-left mx-1 mx-lg-0 p-0" v-if="(item.visit_type =='m' && item.visit_type =='c') || item.visit_type =='b'"></div>
                                <div class="col" v-if="item.visit_type =='c' || item.visit_type =='b'">
                                    <p class="m-0 p-1 py-2 p-lg-3 text-sm-small text-dark bg-light rounded">
                                        مشاوره تلفنی
                                        {{num2fa(item.call_price)+' تومان '}}
                                    </p>
                                </div>
                            </div>
    
                            <!-- <div class="pt-2 float-right">
                                <button class="btn btn-info rounded" v-if="older" @click="this.older=!this.older">درباره مشاور</button>
                                <button class="btn btn-info rounded " v-else @click="this.older=!this.older">امتیاز و نظرات</button>
                            </div> -->

                            <div class="pt-2 float-left" v-if="$store.state.isAuthenticated && allow">
                                <button v-if="follow" class="btn btn-light rounded">
                                    <i class="fa fa-bookmark text-dark"></i>
                                </button>

                                <button v-if="!follow" @click="doFollow()" class="btn btn-light rounded">
                                    <i class="fa fa-bookmark text-info"></i>
                                </button>
                            </div>

                        </div>
    
                        <div class="col-12 rounded text-dark p-3 text-right">
                            <h6 class="text-right border-top pt-3"><i class="fa-solid fa-circle-info violet h5 m-0 ml-2"></i>درباره مشاور</h6>
                            <p class="p-2 line-h">{{num2fa(item.older)}}</p>
                        </div>

                        <div class="d-lg-none col-12 text-dark">
                            <div v-if="allow && item.services && checkTime()" class="row px-3">

                                <div class="col p-1 mb-2" v-if="activeCallLog>0">
                                    <button class="btn btn-sm btn-danger btn-block rounded">مشاور در حال مکالمه میباشد</button>
                                </div>
                                <div class="col-12" v-else>
                                    <div class="mb-2" v-if="item.visit_type=='b' || 'c'">

                                        <p class="small"><i class="fas fa-circle violet mx-1"></i>جهت رزرو نوبت این مشاور کلیک کند</p>
                                        <router-link :to="`/visits/${item.id}/${ item.userId.first_name+'-'+item.userId.last_name }`" class="btn btn-info btn-block rounded mb-2">رزرو نوبت مشاور</router-link>

                                        <div v-if="$store.state.isAuthenticated && (amount > (item.call_price * 10))">
                                            <button v-if="numbers.length" class="btn btn-sm btn-success btn-block rounded py-1" data-toggle="modal" data-target="#callModal">شروع مشاوره تلفنی</button>
                                            <button v-else @click="call(item.userId.id)" class="btn btn-sm btn-success btn-block rounded py-1">شروع مشاوره تلفنی</button>
                                        </div>
                                        <div v-else>
                                            <router-link v-if="$store.state.isAuthenticated" class="btn btn-sm btn-success btn-block rounded py-1" to="/transaction/create">شروع مشاوره تلفنی</router-link>
                                            <button v-else class="btn btn-sm btn-success btn-block rounded py-1" data-toggle="modal" data-target="#myModal">شروع مشاوره تلفنی</button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-12" v-if="item.visit_type=='b' || 'm'">
                                    <router-link v-if="follow" class="btn btn-success btn-block rounded py-1" :to="$store.state.isAuthenticated ? `/showconnection/${item.userId.id}/${this.auth_user}` : '' ">درخواست مشاوره متنی</router-link>
                                    <button v-else @click="$store.state.isAuthenticated ? doFollow() : ''" class="btn btn-sm btn-success btn-block rounded py-1"
                                    :data-toggle="$store.state.isAuthenticated ? '' : 'modal'" :data-target="$store.state.isAuthenticated ? '' : '#myModal'">شروع مشاوره متنی</button>
                                </div>
                            </div>
                            <div v-else class="mt-3 row">
                                <div class="col"><button class="btn btn-sm btn-secondary btn-block rounded" >شروع مشاوره تلفنی</button></div>
                                <div class="col"><button class="btn btn-sm btn-secondary btn-block rounded" >شروع مشاوره متنی</button></div>
                            </div>

                            <div class="mt-3 text-right">
                                <p class="my-2">مشاوره تلفنی
                                    <br>
                                    <small>شروع تماس بلافاصله بعد از ثبت درخواست</small>
                                </p>

                                <p class="col-12 my-2 text-center text-info">ابتدا یکی از بسته های زیر را انتخاب کنید</p>

                                <div class="col-12">
                                    <div class="row p-2 border rounded optradio_m setPay10">
                                        <div class="col text-right">10 دقیقه | {{`${ parseInt(item.call_price) * 10 } تومان`}}</div>
                                        <div class="col-2 pl-2"><input type="radio" class="form-check-input" name="optradio" @click="setPay(10)"></div>
                                    </div>
                                    <div class="row p-2 border rounded mt-2 optradio_c setPay30">
                                        <div class="col text-right">30 دقیقه | {{`${ parseInt(item.call_price) * 30 } تومان`}}</div>
                                        <div class="col-2 pl-2"><input type="radio" class="form-check-input" name="optradio" @click="setPay(30)"></div>
                                    </div>
                                    <div class="row p-2 border rounded my-2 optradio_b setPay60">
                                        <div class="col text-right">60 دقیقه | {{`${ parseInt(item.call_price) * 60 } تومان`}}</div>
                                        <div class="col-2 pl-2"><input type="radio" class="form-check-input" name="optradio" @click="setPay(60)"></div>
                                    </div>
                                </div>

                                <button class="btn btn-block rounded" :class="setPays ? 'btn-violet' : 'd-none'" data-toggle="modal"
                                    :data-target="$store.state.isAuthenticated ? '#payment_modal' : '#myModal'">{{msgPay}}</button>
                            </div>

                        </div>

                        <div class="col-12 text-dark p-3 mt-3 text-right p-3">
                            <h6 class="text-right border-top pt-3"><i class="fa-solid fa-clock violet h5 m-0 ml-2"></i>ساعت های پاسخگویی به مشاوره تلفنی</h6>
                            <div v-if="item.oneDay && item.twoDay && item.treeDay && item.fourDay && item.fiveDay && item.sixDay && item.sevenDay" class="row">
                                
                                <div class="col-lg-6 mt-2 mt-lg-3 text-center">
                                    <div class="bg-light rounded p-2">
                                        <div class="bg-violet text-light rounded p-2 px-3 mb-1 mb-lg-2">شنبه</div>
                                        <p class="m-0 px-3">{{num2fa(`از ${item.oneDay.substr(0,5)} الی ${item.oneDay.substr(6,5)}`)}}</p>
                                    </div>
                                </div>
                                <div class="col-lg-6 mt-2 mt-lg-3 text-center">
                                    <div class="bg-light rounded p-2">
                                        <div class="bg-violet text-light rounded p-2 px-3 mb-1 mb-lg-2">یکشنبه</div>
                                        <p class="m-0 px-3">{{num2fa(`از ${item.twoDay.substr(0,5)} الی ${item.twoDay.substr(6,5)}`)}}</p>
                                    </div>
                                </div>
                                <div class="col-lg-6 mt-2 mt-lg-3 text-center">
                                    <div class="bg-light rounded p-2">
                                        <div class="bg-violet text-light rounded p-2 px-3 mb-1 mb-lg-2">دوشنبه</div>
                                        <p class="m-0 px-3">{{num2fa(`از ${item.treeDay.substr(0,5)} الی ${item.treeDay.substr(6,5)}`)}}</p>
                                    </div>
                                </div>
                                <div class="col-lg-6 mt-2 mt-lg-3 text-center">
                                    <div class="bg-light rounded p-2">
                                        <div class="bg-violet text-light rounded p-2 px-3 mb-1 mb-lg-2">سه شنبه</div>
                                        <p class="m-0 px-3">{{num2fa(`از ${item.fourDay.substr(0,5)} الی ${item.fourDay.substr(6,5)}`)}}</p>
                                    </div>
                                </div>
                                <div class="col-lg-6 mt-2 mt-lg-3 text-center">
                                    <div class="bg-light rounded p-2">
                                        <div class="bg-violet text-light rounded p-2 px-3 mb-1 mb-lg-2">چهارشنبه</div>
                                        <p class="m-0 px-3">{{num2fa(`از ${item.fiveDay.substr(0,5)} الی ${item.fiveDay.substr(6,5)}`)}}</p>
                                    </div>
                                </div>
                                <div class="col-lg-6 mt-2 mt-lg-3 text-center">
                                    <div class="bg-light rounded p-2">
                                        <div class="bg-violet text-light rounded p-2 px-3 mb-1 mb-lg-2">پنج شنبه</div>
                                        <p class="m-0 px-3">{{num2fa(`از ${item.sixDay.substr(0,5)} الی ${item.sixDay.substr(6,5)}`)}}</p>
                                    </div>
                                </div>
                                <div class="col-lg-12 mt-2 mt-lg-3 text-center">
                                    <div class="bg-light rounded p-2">
                                        <div class="bg-violet text-light rounded p-2 px-3 mb-1 mb-lg-2">جمعه</div>
                                        <p class="m-0 px-3">{{num2fa(`از ${item.sevenDay.substr(0,5)} الی ${item.sevenDay.substr(6,5)}`)}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12 rounded text-dark p-3">
                            <h6 class="text-right border-top pt-3 pb-2"><i class="fa fa-check-circle violet h5 m-0 ml-2"></i>تضمین گوش شنوا</h6>
                            <div class="px-2">
                                <div class="col-12 text-right py-2">
                                    <div class="row">
                                        <div class="col-auto px-0">
                                            <img :src="require('@/assets/account.png')" class="img-circle-28 rounded-circle p-1 border " alt="مشاوران تأیید شده">
                                        </div>
                                        <div class="col px-1 pt-1"><h6 class="p-0">مشاوران تأیید شده</h6></div>
                                        <div class="col-12 p-0"><p class="my-1 text-secondary">همه ی مشاوران طی یک فرایند دقیق تأیید شده اند</p></div>
                                    </div>
                                </div>
    
                                <div class="col-12 text-right py-2">
                                    <div class="row">
                                        <div class="col-auto px-0">
                                            <img :src="require('@/assets/love.png')" class="img-circle-28 rounded-circle p-1 border " alt="مشاوران تأیید شده">
                                        </div>
                                        <div class="col px-1 pt-1"><h6 class="p-0">رضایت تضمین شده</h6></div>
                                        <div class="col-12 p-0"><p class="my-1 text-secondary">اگر از مشاور راضی نبودید. هزینه بازگردانده میشود</p></div>
                                    </div>
                                </div>
    
                                <div class="col-12 text-right py-2">
                                    <div class="row">
                                        <div class="col-auto px-0">
                                            <img :src="require('@/assets/lock.png')" class="img-circle-28 rounded-circle p-1 border " alt="مشاوران تأیید شده">
                                        </div>
                                        <div class="col px-1 pt-1"><h6 class="p-0">۱۰۰% حفظ حریم شخصی</h6></div>
                                        <div class="col-12 p-0"><p class="my-1 text-secondary">جزئیات مشاوره و شماره تماس محرمانه خواهد ماند</p></div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div class="d-lg-none col-12 text-right mb-2">
                            <div class="row ">
                                <div class="col-auto"><i class='fas fa-chalkboard-teacher violet h5'></i></div>
                                <div class="col p-0">آزمون های مشاور</div>
                            </div>
                            <p class="small"><i class="fas fa-circle violet mx-1"></i>جهت شرکت در آزمون های مشاور کلیک کند</p>
                            <router-link :to="`/exam/${item.id}`" class="btn btn-sm btn-info btn-block rounded">آزمون های مشاور</router-link>
                        </div>

                        <div class="col-12 rounded text-dark text-right p-3 comments mb-3">
                            <h6 class="text-right border-top pt-3"><i class="fa-regular fa-message ml-2"></i>امتیاز و نظرات کاربران</h6>
                            <h5 class="text-center">{{num2fa(geterStarsAndComments[1])+' نظر دارد '}}</h5>
                            <div v-if="allow && follow" class="my-3">
                                <div class="input">
                                    <div class="input-group">
                                        <textarea name="setcontent" id="setcontent" class="form-control rounded" rows="4" v-model="setcontent"></textarea>
                                    </div>
                                    <button @click="doComment" class="btn float-left my-2" :class="setcontent.length > 5 ? 'btn-success' : 'd-none'">ثبت نظر شما</button>
                                    <div class="col-6 col-lg-3 my-2 p-0">
                                        <select class="form-control" v-model="setstars" >
                                            <option value=1>۱ ستاره</option>
                                            <option value=2>۲ ستاره</option>
                                            <option value=3>۳ ستاره</option>
                                            <option value=4>۴ ستاره</option>
                                            <option value=5>۵ ستاره</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div v-for="c in comment" :key="c.id" class="border rounded p-2 mb-2">
                                <div class="float-left m-1 bg-success p-1 px-2 text-light rounded rounded d-flex">
                                    <p class="m-0 px-1">{{num2fa(c.stars)}}</p>
                                    <Star class="text-light"/>
                                </div>
                                <p class="my-1 text-secondary">{{ num2fa(`${c.created_at.substr(0,10)} ${c.created_at.substr(11,5)}`) }}</p>
                                {{c.content}}
                            </div>

                        </div>
                
                    </div>
                </div>
            </div>
            
            <div class="col-lg">
                <div class="profile-card-view bg-white rounded text-dark p-3 pt-4 mt-5 d-none d-lg-block" style="max-height: 500px;">
                    <div v-if="allow && item.services && checkTime()" >
                        <div class="my-2" v-if="activeCallLog>0">
                            <button class="btn btn-outline-danger btn-block rounded">مشاور در حال مکالمه میباشد</button>
                        </div>
                        <div v-else>
                            <div class="my-2" v-if="item.visit_type=='b' || 'c'">
                                <div v-if="$store.state.isAuthenticated && (amount > (item.call_price * 10))">
                                    <button v-if="numbers.length" class="btn btn-outline-success btn-block rounded" data-toggle="modal" data-target="#callModal">شروع مشاوره تلفنی</button>
                                    <button v-else @click="call(item.userId.id)" class="btn btn-outline-success btn-block rounded">شروع مشاوره تلفنی</button>
                                </div>
                                <div v-else>
                                    <router-link v-if="$store.state.isAuthenticated" class="btn btn-outline-success btn-block rounded" to="/transaction/create">شروع مشاوره تلفنی</router-link>
                                    <button v-else class="btn btn-outline-success btn-block rounded" data-toggle="modal" data-target="#myModal">شروع مشاوره تلفنی</button>
                                </div>
                            </div>
                        </div>

                        <div v-if="item.visit_type=='b' || 'm'">
                            <router-link v-if="follow" class="btn btn-outline-success btn-block rounded" :to="$store.state.isAuthenticated ? `/showconnection/${item.userId.id}/${this.auth_user}` : '' ">شروع مشاوره متنی</router-link>
                            <button v-else @click="$store.state.isAuthenticated ? doFollow() : ''" class="btn btn-outline-success btn-block rounded"
                             :data-toggle="$store.state.isAuthenticated ? '' : 'modal'" :data-target="$store.state.isAuthenticated ? '' : '#myModal'">شروع مشاوره متنی</button>
                        </div>
                    </div>
                    <div v-else>
                        <button class="btn btn-secondary btn-block rounded my-3" >شروع مشاوره تلفنی</button>
                        <button class="btn btn-secondary btn-block rounded" >شروع مشاوره متنی</button>
                    </div>

                    <div class="mt-3 text-right">
                        <button class="float-left btn py-0" data-toggle="modal" data-target="#information"><i class="fa-solid fa-circle-info h5 violet"></i></button>
                        <div class="d-flex">
                            <i class="fa-solid fa-mobile violet ml-2 h5"></i>
                            <p class="m-0 mx-1">مشاوره تلفنی</p>
                        </div>
                        <p class="small"><i class="fas fa-circle violet mx-1"></i>شروع تماس بلافاصله بعد از ثبت درخواست</p>
                        <p class="my-2 text-center text-info">ابتدا یکی از بسته های زیر را انتخاب کنید</p>
                        <div class="col-12">
                            <div class="row p-2 border rounded optradio_m setPay10">
                                <div class="col text-right">{{ num2fa(`10 دقیقه | ${ parseInt(item.call_price) * 10 } تومان`)}}</div>
                                <div class="col-2 pl-2"><input type="radio" class="form-check-input" name="optradio" @click="setPay(10)"></div>
                            </div>
                            <div class="row p-2 border rounded mt-2 optradio_c setPay30">
                                <div class="col text-right">{{ num2fa(`30 دقیقه | ${ parseInt(item.call_price) * 30 } تومان`)}}</div>
                                <div class="col-2 pl-2"><input type="radio" class="form-check-input" name="optradio" @click="setPay(30)"></div>
                            </div>
                            <div class="row p-2 border rounded my-2 optradio_b setPay60">
                                <div class="col text-right">{{ num2fa(`60 دقیقه | ${ parseInt(item.call_price) * 60 } تومان`)}}</div>
                                <div class="col-2 pl-2"><input type="radio" class="form-check-input" name="optradio" @click="setPay(60)"></div>
                            </div>
                        </div>

                        <button class="btn btn-block rounded" :class="setPays ? 'btn-violet' : 'd-none'" data-toggle="modal"
                         :data-target="$store.state.isAuthenticated ? '#payment_modal' : '#myModal'">{{num2fa(msgPay)}}</button>

                    </div>

                </div>

                <div v-if="item.services && !checkTime()" class="profile-card-view bg-white rounded text-dark p-3 pt-4 mt-3 d-none d-lg-block" style="max-height: 500px;">
                    <div v-if="item.visit_type=='b' || 'c'" class="text-right">
                        <div class="row ">
                            <div class="col-auto"><i class='far fa-calendar violet h5'></i></div>
                            <div class="col p-0">رزرو نوبت مشاور</div>
                        </div>
                        <p class="small"><i class="fas fa-circle violet mx-1"></i>جهت رزرو نوبت این مشاور کلیک کند</p>
                        <router-link :to="`/visits/${item.id}/${ item.userId.first_name+'-'+item.userId.last_name }`" class="btn btn-info btn-block rounded">رزرو نوبت مشاور</router-link>
                    </div>
                </div>
                
                <div class="profile-card-view bg-white rounded text-dark p-3 pt-4 mt-3 d-none d-lg-block" style="max-height: 500px;">
                    <div class="text-right">
                        <div class="row ">
                            <div class="col-auto"><i class='fas fa-chalkboard-teacher violet h5'></i></div>
                            <div class="col p-0">آزمون های مشاور</div>
                        </div>
                        <p class="small"><i class="fas fa-circle violet mx-1"></i>جهت شرکت در آزمون های مشاور کلیک کند</p>
                        <router-link :to="`/exam/${item.id}`" class="btn btn-info btn-block rounded">آزمون های مشاور</router-link>
                    </div>
                </div>
                
            </div>
            
        </div>
        
        <!-- modal login -->
        <div class="modal" id="myModal">``
            <div class="modal-dialog text-dark">
                <div class="modal-content mt-5">
                    <div class="p-3 bg-light text-right" >
                        <h6 v-if="nextStep" >کد ارسال شده را وارد کنید</h6>
                        <h6 v-else >ثبت نام یا ورود به ناحیه کاربری</h6>
                    </div>
                    <div class="modal-body">
    
                        <div v-if="nextStep" >
                            <div v-if="this.timer>=1" class="form-group">
                                <input type="text" class="form-control text-left name" :class="{'is-invalid':codeE===true}" placeholder="کد ۶ رقمی را وارد کنید" v-model="code">
                                <div class="text-danger" v-if="codeE">{{codeEM}}</div>
                            </div>
                            <button @click="doLogin" v-if="this.timer>=1" class="btn btn-info btn-block text-light mb-2">ورود کد</button>
                            <div v-if="this.timer>=1">
                                ...اعتبار کد تا
                                <span v-if="this.timer>=11">{{timer}}</span>
                                <span v-else-if="this.timer>=6" class="text-warning">{{timer}}</span>
                                <span v-else class="text-danger">{{timer}}</span>
                                ثانیه
                            </div>
                            <div v-else class="row">
                                <div class="col-12 mb-3">اگر کد را دریافت نکردید از روش های زیر استفاده کنید</div>
                                <div class="col-auto col-lg text-left ">
                                    <button v-if="alert" @click="resendCreateCode" class="btn btn-info">ارسال مجدد کد</button>
                                    <button v-else @click="resendCreateCode" class="btn btn-secondary">در حال ارسال</button>
                                </div>
                                <div class="col-auto col-lg text-right ">
                                    <button v-if="calling" @click="callCreateCode" class="btn btn-info">اعلام کد از طریق تماس</button>
                                    <button v-else class="btn btn-secondary">در حال ارسال</button>
                                </div>
                            </div>
                        </div>
    
                        <div v-else class="form-group text-right">
                            <label for="usernameInput" >شماره موبایل خود را وارد کنید</label>
                            <div class="input-group m-0 mt-2">
                                <input type="text" class="form-control text-left name" onpaste="return false;" :class="{'is-invalid':usernameE===true}" placeholder="فرمت موبایل 9121237788" v-model="username">
                                <div class="input-group-prepend"><div class="input-group-text">+98</div></div>
                            </div>
                            <div class="text-dangerfeedback" >{{usernameEM}}</div>
                        </div>
    
                    </div>
    
                    <div class="d-flex p-2 border-top">
                        <button v-if="!submited && !nextStep" @click="createCode" class="btn btn-success ml-2">ورود یا ثبت نام</button>
                        <button type="button" class="btn btn-secondary" id="loginModalClose" data-dismiss="modal">انصراف</button>
                    </div>
    
                </div>
            </div>
        </div>
    
        <!-- modal call -->
        <div class="modal text-dark" id="callModal">
            <div class="modal-dialog mt-5">
                <div class="modal-content">
                    <div class="p-3 bg-light">
                        <h5 class="text-right m-2 ">تماس با {{String([item.userId.first_name,item.userId.last_name].join(' '))}}</h5>
                    </div>
                    <div class="modal-body">
                        <h6 v-if="number">تماس از شماره <span>{{String(number)}}</span></h6>
                        <h6 v-else>یک شماره انتخاب کنید</h6>
                        <button class="btn btn-outline-info btn-block" @click="this.number=this.meUnmber">استفاده از شماره : {{meUnmber}}</button>
                        <div v-if="numbers.length" class="my-2">
                            <div v-for="num in numbers" :key="num.id">
                                <button class="btn btn-outline-info btn-block" @click="this.number=num.number">استفاده از شماره : {{num.subject}}</button>
                            </div>
                        </div>
                    </div>
    
                    <div class="d-flex p-2 border-top">
                        <button class="btn btn-success mx-2" disabled v-if="!number">مشاوره تلفنی</button>
                        <button @click="call(item.userId.id)" class="btn btn-success mx-2" v-else>مشاوره تلفنی</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">انصراف</button>
                    </div>
    
                    <div class="modal-footer row">
                        <div class="col text-right">
                        </div>
                    </div>
    
                </div>
            </div>
        </div>

        <div class="modal text-dark" id="information">
            <div class="modal-dialog mt-5">
                <div class="modal-content">
                    <div class="modal-body p-0">
                    
                        <div class="p-2 pb-5">
                            <h6 class="float-right p-2 mt-1">راهنمای مشاوره تلفنی</h6>
                            <button type="button" class="btn text-secondary float-left" data-dismiss="modal"><i class="fa fa-close text-danger h5"></i></button>
                        </div>

                        <img class="m-1" :src="require('@/assets/callService.svg')">
                        <div class="bg-light p-3 text-right p-justify">

                            <p class="my-4">
                                <i class="fas fa-circle mx-1 text-info"></i>
                                قابلیت ارسال پیام و فایل تا ۲۴ ساعت بعد از مشاوره
                            </p>
                            <p class="my-4">
                                <i class="fas fa-circle mx-1 text-info"></i>
                                ارسال مدارک پزشکی قبل از تماس برای پزشک
                            </p>
                            <p class="my-4">
                                <i class="fas fa-circle mx-1 text-info"></i>
                                برقراری تماس خودکار و امن بلافاصله بعد از درخواست توسط شماره 02162999042
                            </p>
                            <p class="my-4">
                                <i class="fas fa-circle mx-1 text-info"></i>
                                در مشاوره تلفنی، بعد از ثبت درخواست، بلافاصله توسط شماره 02162999042 با شما تماس گرفته خواهد شد. 
                            </p>
                            <p class="my-4">
                                <i class="fas fa-circle mx-1 text-info"></i>
                                در رزرو مشاوره تلفنی، مشاور یا پزشک حداکثر تا 24 ساعت با شما تماس میگیرد در غیر این صورت درخواست شما به صورت خودکار لغو و وجه پرداختی شما به حساب کاربریتان باز  می‌گردد.
                            </p>
                            <p class="my-4">
                                <i class="fas fa-circle mx-1 text-info"></i>
                                در صورتی که تماس برقرار شده قبل از اتمام زمان مشاوره به دلایل فنی قطع گردد، از طریق تماس با پشتیبانی، ادامه تماس شما برقرار خواهد شد.
                            </p>
                            <p class="my-4">
                                <i class="fas fa-circle mx-1 text-info"></i>
                                در صورتی که تماس برقرار شده زیر 1 دقیقه باشد، مبلغ مشاوره، به حساب کاربری گوش شنوا شما باز خواهد گشت.
                            </p>

                        </div>

                    </div>    
                </div>
            </div>
        </div>

        <div class="modal text-dark" id="payment_modal">
            <div class="modal-dialog mt-5">
                <div class="modal-content">
                    <div class="modal-body p-0">
                    
                        <div class="p-2 pb-5">
                            <h6 class="float-left p-2 mt-1">جزییات سفارش</h6>
                            <button type="button" class="btn text-secondary float-right" data-dismiss="modal">انصراف</button>
                        </div>

                        <div class="avatar">
                            <div class="box">
                                <img v-if="item.userId.avatar" :src="item.userId.avatar" alt="avatar" class="img-circle rounded-circle" :class="item.services && checkTime()?'img-border-success':'img-border-danger' ">
                                <img v-else :src="require(`@/assets/phone.png`)" alt="avatar" class="img-circle rounded-circle" :class="item.services && checkTime()?'img-border-success':'img-border-danger' ">
                                <h6 class="text-dark font-weight-bold m-0 my-2 my-lg-3" v-if="item.userId.first_name">{{String([item.userId.first_name,item.userId.last_name].join(' '))}}</h6>
                                <h6 class="text-dark font-weight-bold m-0 my-2 my-lg-3" v-else>نام شخص وارد نشده</h6>
                            </div>
                        </div>

                        <div class="bg-light p-3 text-right">

                            <p class="my-2">
                                پس از تکمیل فرآیند پرداخت ارتباط شما با مشاور بصورت خودکار ایجاد میشود
                            </p>
                            
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button @click="pay()" class="btn btn-success bnn-block rounded">پرداخت و ارتباط با مشاوره</button>
                    </div>  
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import axios from 'axios'
import Star from '@/components/Star.vue'

    export default {
        name: 'ProfileComponent',
        components: {
            Star,
        },
        props: {
            item: {},
            category: {},
            comment: {},
            itemNotFounf: null,
            allow: null,
            follow: null,
            numbers: null,
            meUnmber: null,
            auth_user: null,
            amount: null,
            activeCallLog: null,
        },
        data() {
            return {
                setPays: false,
                anime: false,
                stars: 0,
                comments: 0,
                setstars: 5,
                setcontent: '',
                older: false,
                msgPay: 'درخواست مشاوره 30 دقیقه ای',
                price: 0,
                today: '',
                password: 'zxcvbnm,./72ZXCVB',
                username: '',
                usernameE: null,
                usernameEM: null,
                codeE: null,
                codeEM: null,
                nextStep: false,
                submited: false,
                code: '',
                calling: true,
                alert: false,
                newUsername: [],
                newCode: [],
                timer: 91,
                pass: false,

                number: 0,
            }
        },
        computed: {
            geterStarsAndComments : function(){
                let sta = 0
                let com = 0
                for (let index = 0; index < this.comment.length; index++) {
                    if (this.comment[index].content) {
                        com += 1;
                    }
                    sta += this.comment[index].stars;
                    
                }
                sta = sta / this.comment.length
                if (!sta) {
                    sta = 0
                }
                return [sta,com];
            }
        },
        methods: {
            pay() {
                if ( this.price==0 ) {
                    this.price = parseInt(this.item.call_price) * 300
                }
                this.msgPay = '...در حال انتقال به درگاه پرداخت'
                axios.get('/api/auth/users/me/')
                    .then(response => {
                        axios.post("/transaction/", {userId: response.data.id, amount: this.price, authorLink: `/profile/${this.$route.params.id}/${this.$route.params.fullname}`})
                        .then(response => {
                            if (response.data.id) {
                                this.paymentCreate(response.data.id)
                            }
                        })
                        .catch(e => {console.log(e.response.status, e.response.data), alert('مشگل در ارسال اطلاعات')})
                    })
                    .catch(e => console.log(e.response) )
            },
            paymentCreate(order_id) {
                // axios.post("/payment_create/", {order_id: order_id})
                axios.post("/gateway/parspal/create/link/", {order_id: order_id})
                .then(response => {
                    if (response.data.link) {
                        window.location.href = response.data.link
                    }
                })
                .catch(e => {
                    console.log(e.response.status, e.response.data.msg)
                    if (e.response.data.msg==='مشگل ناشناخته') {
                        this.paymentCreate(order_id)
                    } else {
                        alert('مشگل در ارتباط با سامانه دوباره لطفا امتحان کنید');
                        location.reload();
                    }
                })
            },
            setPay(time) {
                this.setPays = true
                this.price  = parseInt(this.item.call_price) * time * 10
                this.msgPay = `درخواست مشاوره ${time} دقیقه ای`
                let lists   = ['.setPay10','.setPay30','.setPay60'];
                
                for (let index = 0; index < lists.length; index++) {
                    const btn_lists = document.querySelectorAll(lists[index]);
                    btn_lists.forEach( btn => {
                        btn.classList.remove('violet')
                        btn.classList.remove('border-violet')
                        btn.classList.add('border')
                    });
                }
                
                let btns    = document.querySelectorAll(`.setPay${time}`)
                btns.forEach( btn => {
                    btn.classList.remove('border')
                    btn.classList.add('violet')
                    btn.classList.add('border-violet')
                });
            },
            studentUpdate: function () {
                if (this.timer > 0) {
                    this.timer -= 1
                    setTimeout(this.studentUpdate, 1000);
                }
            },
            doLogin() {
                if (this.code.length < 6 || this.code.length > 6) {
                    this.codeE = true
                    this.codeEM = "کد باید ۶ شماره باشد"
                    if (this.code.length == 0) {
                        this.codeEM = "فیلد کد اجباری هست"
                    }
                } else { 
                    this.codeE   = false
                    this.codeEM  = ''
                    this.newCode = []
                    for (let index = 0; index < this.code.length; index++) {
                        switch (this.code[index]) {
                            case '۰':
                                this.newCode.push('0')
                                break;
                            case '۱':
                                this.newCode.push('1')
                                break;
                            case '۲':
                                this.newCode.push('2')
                                break;
                            case '۳':
                                this.newCode.push('3')
                                break;
                            case '۴':
                                this.newCode.push('4')
                                break;
                            case '۵':
                                this.newCode.push('5')
                                break;
                            case '۶':
                                this.newCode.push('6')
                                break;
                            case '۷':
                                this.newCode.push('7')
                                break;
                            case '۸':
                                this.newCode.push('8')
                                break;
                            case '۹':
                                this.newCode.push('9')
                                break;
                            default:
                                this.newCode.push(this.code[index])
                        }
                    }
                    axios.post('get-code/', {code: String(this.newCode.join("")), username: String(this.newUsername.join(""))})
                    .then(response => {
                        if (response.data.allow) {
                            axios.post('/api/auth/token/login/', {password: this.password, username: String(this.newUsername.join(""))})
                            .then(response => {
                                if (response.status == 200) {
                                    this.$store.commit("login", response.data.auth_token)
                                    document.querySelector('#loginModalClose').click()
                                    // this.pass = true
                                    // this.pay()
                                }
                            })
                        }
                        else { this.codeE = true ,this.codeEM = "کد اشتباه است ,لطفا دقت کنید ,دفعات ارسال کد ۴ بار میباشد" }
                    })
                    .catch(e => this.codeEM = e.response.data, this.codeE = true )
                }
            },
            createCode() {
                if (this.username.length < 10 || this.username.length > 10) {
                    this.usernameE = true
                    this.usernameEM = "موبایل باید ۱۰ شماره باشد"
                    if (this.username.length == 0) {
                        this.usernameEM = "فیلد موبایل اجباری هست"
                    }
                } else {
                    this.submited   = true
                    this.usernameE  = false
                    this.usernameEM = ""
                    this.newUsername = []
                    for (let index = 0; index < this.username.length; index++) {
                        switch (this.username[index]) {
                            case '۰':
                                this.newUsername.push('0')
                                break;
                            case '۱':
                                this.newUsername.push('1')
                                break;
                            case '۲':
                                this.newUsername.push('2')
                                break;
                            case '۳':
                                this.newUsername.push('3')
                                break;
                            case '۴':
                                this.newUsername.push('4')
                                break;
                            case '۵':
                                this.newUsername.push('5')
                                break;
                            case '۶':
                                this.newUsername.push('6')
                                break;
                            case '۷':
                                this.newUsername.push('7')
                                break;
                            case '۸':
                                this.newUsername.push('8')
                                break;
                            case '۹':
                                this.newUsername.push('9')
                                break;
                            default:
                                this.newUsername.push(this.username[index])
                        }
                    }
                    if (String(this.newUsername.join(""))[0] != 9) {
                        this.usernameE = true
                        this.usernameEM = "موبایل نامعتبر, شماره باید با 9 شروع شود"
                    } else {

                        axios.post('/create-code/', {username: String(this.newUsername.join(""))})
                        .then(response => {
                            console.log(response)
                            this.nextStep = true
                            this.alert = true
                            this.submited = false
                            this.studentUpdate()
                        })
                        .catch(e => {
                            if ( e.response.data.errors == "شماره یافت نشد") {
                                axios.post('/api/auth/users/', {password: this.password, username: String(this.newUsername.join(""))})
                                .then(response => {
                                    if (response.status == 201) {
                                        axios.post('/create-code/', {username: response.data.username})
                                            .then(response => {
                                                console.log(response)
                                                this.nextStep = true 
                                                this.alert = true
                                                this.submited = false
                                                this.studentUpdate()
                                            })
                                            .catch(e => this.usernameEM = e.response.data.errors, this.usernameE = true )
                                    }
                                }).catch(e => {
                                    this.usernameE  = true
                                    this.usernameEM = e.response.data.username.join(" ")
                                    this.submited = false
                                })
                            }
                        })

                    }
                }

            },
            resendCreateCode() {
                this.alert = false
                axios.post('/create-code/', {username: String(this.newUsername.join(""))})
                .then(response => {
                    console.log(response)
                    this.nextStep = true
                    this.alert = true
                    this.timer = 91
                    this.studentUpdate()
                })

            },
            callCreateCode() {
                if (this.username.length < 10 || this.username.length > 10) {
                    this.usernameE = true
                    this.usernameEM = "موبایل باید ۱۰ شماره باشد"
                    if (this.username.length == 0) {
                        this.usernameEM = "فیلد موبایل اجباری هست"
                    }
                } else {
                    this.usernameE = false
                    this.usernameEM = ""
                    axios.post('/call-create-code/', {username: String(this.newUsername.join(""))})
                    .then(response => {
                        if (response.data[0] == 'ok') {
                            this.calling = false
                            this.timer = 91
                            this.studentUpdate()
                        }
                    })
                    .catch(e => this.usernameEM = e.response.data.errors, this.usernameE = true )
                }
            },
            doFollow() {
                this.anime = true
                axios.get('/api/auth/users/me/')
                    .then(response => {
                        let uId = response.data.id
                        axios.post('/createfollower/', {userId: uId, followId: this.item.userId.id, requestUser: uId})
                        .then(response => {
                            console.log(response)
                            axios.post('/createfollower/', {userId: this.item.userId.id, followId: uId, requestUser: uId})
                            .then(response => {
                                console.log(response)
                                this.$router.push("/connection")
                            })
                            .catch(e => {
                                (e.response) 
                            })
                        })
                        .catch(e => {
                            (e.response) 
                        })
                    })
            },
            categoryInline(cat) {
                let array = [this.item.certificate]
                for (let index = 0; index < cat.length; index++) {
                    for (let i = 0; i < this.category.length; i++) {
                        if (this.category[i].id == cat[index]) {
                            array.push(' ');
                            array.push(this.category[i].title);
                        }
                    }
                }
                return array
            },
            doComment() {
                if (this.setcontent.length < 5) {
                    alert('حداقل یک کلمه نظر بنویسید')
                }else {
                    axios.get('/api/auth/users/me/')
                        .then(response => {
                            axios.post('/comment/', { stars: this.setstars, content: this.setcontent, userId: response.data.id, authorId: this.item.userId.id })
                            .then(response => {
                                console.log(response)
                                this.setstars = 0
                                this.setcontent = ''
                                this.$router.push("/connection")
                             })
                            .catch(e => { console.log(e.response.data) })
                        })
                        .catch(e => { (e.response) })
                }
            },
            checkTime() {
                switch (new Date().getDay()) {
                    case 0:
                        this.today = this.item.twoDay
                    break;
                    case 1:
                        this.today = this.item.treeDay
                    break;
                    case 2:
                        this.today = this.item.fourDay
                    break;
                    case 3:
                        this.today = this.item.fiveDay
                    break;
                    case 4:
                        this.today = this.item.sixDay
                    break;
                    case 5:
                        this.today = this.item.sevenDay
                    break;
                    case 6:
                        this.today = this.item.oneDay
                    break;
                }

                let getHour   = new Date().getHours()
                let getMinute = new Date().getMinutes()
                let start     = this.today.split(',')[0]
                let end       = this.today.split(',')[1]

                let startHour = start.split(':')[0]
                let endHour   = end.split(':')[0]
                let startMinu = start.split(':')[1]
                let endMinu   = end.split(':')[1]

                if ( startHour < getHour ) {
                    if ( endHour > getHour ) {
                        return true
                    }
                    else if ( endHour == getHour ) {
                        if ( endMinu > getMinute ) {
                            return true
                        }
                    }
                }
                else if ( startHour == getHour ) {
                    if ( startMinu < getMinute ) {
                        if ( endHour > getHour ) {
                            return true
                        }
                        else if ( endHour == getHour ) {
                            if ( endMinu < getMinute ) {
                                return true
                            }
                        }
                    }
                }
                return false

                
                // if (this.today && this.today.length > 9) {
                //     if ( this.today.substr(0,2) < new Date().getHours() ) {
                //         if ( this.today.substr(6,2) > new Date().getHours() ) {
                //             return true
                //         }
                //         else if ( this.today.substr(6,2) == new Date().getHours() ) {
                //             if ( this.today.substr(9,2) > new Date().getMinutes() ){
                //                 return true
                //             }
                //         }
                //     }
                //     else if ( this.today.substr(0,2) == new Date().getHours() ) {
                        
                //         if ( this.today.substr(3,2) < new Date().getMinutes() ) {
                //             if ( this.today.substr(6,2) > new Date().getHours() ) {
                //                 return true
                //             }
                //             else if ( this.today.substr(6,2) == new Date().getHours() ) {
                //                 if ( this.today.substr(9,2) < new Date().getMinutes() ){
                //                     return true
                //                 }
                //             }
                //         }
                //     }

                // }
                // return false
            },
            call() {
                if(this.number === 0)
                {
                    this.number = this.meUnmber
                }
                axios.post('call_create/', {"userNember": String(this.number), "userIdAuthor": this.item.userId.id})
                .then(response => alert("وضعیت مکالمه : "+response.data.type+" موجودی اولیه : "+response.data.FirstCredit+" هزینه هر دقیقه مشاوره : "+response.data.AmountPerMin) )
                .catch(e => alert(e.response.data.msg) )
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
        }
    }
</script>

<style scoped>
</style>