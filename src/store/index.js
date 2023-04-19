import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    baseUrl:              'doctor.gosheshenava.com:8000',
    isAuthenticated:      false,
    pwaCheck:             false,
    token:                '',
    filter:               false,
    username:             '',
    doctor:               '',
    userId:               '',
    amount:               '',
    section:              '',
    consolationCategory:  'مشاور گوش شنوا',
    file:                 'file',
    runAnimation:         true,
  },
  mutations: {
    onStarted(state) {
      let token = localStorage.getItem("token")
      let pwa   = localStorage.getItem("pwa")
      state.isAuthenticated   = false
      if (token) {
        state.isAuthenticated = true
      }
      if (pwa && pwa=='true') {
        state.pwaCheck        = true
      }
    },
    login(state, token) {
      state.isAuthenticated   = true
      state.token = token
      localStorage.setItem("token", token)
      axios.defaults.headers.common['Authorization'] = "Token " + token
    },
    logout(state) {
      state.isAuthenticated   = false
      state.token             = ''
      axios.defaults.headers.common['Authorization'] = ""
      localStorage.removeItem("token")
      localStorage.removeItem("doctor")
      localStorage.removeItem("userId")
      localStorage.removeItem("username")
      localStorage.removeItem("amount")
    },
    
  },
  actions: {
    onStart (context) {
      let token = localStorage.getItem("token")
      if (token) {
        axios.defaults.headers.common['Authorization'] = "Token " + token
        axios.get('/api/auth/users/me/')
          .then(response => {
            console.table(response.data)
            context.commit('login', token)
          })
          .catch(error => {
            console.log(error)
            context.commit('logout')
          })
      } else {
        context.commit('logout')
      }
    }
  },
  modules: {
  }
})
