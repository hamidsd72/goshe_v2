import { createApp } from 'vue'
import App           from './App.vue'
import router        from './router'
import store         from './store'
import axios         from 'axios'
import 'bootstrap/dist/css/bootstrap.css';
import 'jquery/src/jquery.js';
import 'popper.js/dist/popper.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas);
import { fab } from '@fortawesome/free-brands-svg-icons';
library.add(fab);
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(far);
import { dom } from "@fortawesome/fontawesome-svg-core";
// import './registerServiceWorker'
dom.watch();
library.add(faUserSecret)

// On HTTPS sites use an HTTPS API, or proxy this same-origin prefix to Django.
const { installApiTransport } = require('./utils/apiTransport.cjs')
installApiTransport(axios, process.env.VUE_APP_API_BASE_URL, window.location.origin)

createApp(App).component('font-awesome-icon', FontAwesomeIcon).use(store).use(router).mount('#app')

// 9133624956
// 8c82d2dd88df56b86814acd1b23be6c83fde92f7

// 9208068983
// 135dc037b27ecbcc87f85b8b0796be0aa729f318

// 9123633439
// مریم کریمی
// 27c5f728349b49d07beacef073dab6b620fb4dd7

// http://127.0.0.1:8000/notification-for-users
// {
//     "userId": 163,
//     "bodyId": "72809",
//     "arg": "test args"
// }
