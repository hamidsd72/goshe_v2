import { createRouter, createWebHistory } from 'vue-router'
import store              from '@/store'

// import Home               from '../views/Home.vue'
import Callback           from '../views/Callback.vue'
import Categury           from '../views/Categury.vue'
import ShowCategury       from '../views/ShowCategury.vue'
import About              from '../views/About.vue'
import Profile            from '../views/users/Profile.vue'
import Login              from '../views/auth/Login.vue'
import Register           from '../views/auth/Register.vue'
import Logout             from '../views/auth/Logout.vue'
import Dashboard          from '../views/users/Dashboard.vue'
import Revenue            from '../views/users/Revenue.vue'
import Author             from '../views/authors/Author.vue'
import Connection         from '../views/users/Connection.vue'
import ShowConnection     from '../views/users/ShowConnection.vue'
import Notification       from '../views/users/Notification.vue'
import Transaction        from '../views/users/Transaction.vue'
import CallLog            from '../views/users/CallLog.vue'
import TransactionCreate  from '../views/users/TransactionCreate.vue'
// import Blog               from '../views/posts/Blog.vue'
// import ShowBlog           from '../views/posts/ShowBlog.vue'
import CreatePost         from '../views/posts/CreatePost.vue'
import Ticket             from '../views/Ticket.vue'
import Provision          from '../views/Provision.vue'
import Index              from '../views/admin/Index.vue'
import AuthorDetail       from '../views/admin/AuthorDetail.vue'
import UserDetail         from '../views/admin/UserDetail.vue'
import Questions          from '../views/Questions.vue'
import Pwa                from '../views/Pwa.vue'
import ExamIndex          from '../views/exam/Index.vue'
import ExamCreate         from '../views/exam/Create.vue'
import ExamShow           from '../views/exam/Show.vue'
import VisitExam          from '../views/exam/Visit.vue'
import UsersExam          from '../views/exam/UsersExam.vue'
import VisitIndex         from '../views/visit/Index.vue'
import VisitShow          from '../views/visit/Show.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Pwa
  },
  {
    path: '/questions',
    name: 'Questions',
    component: Questions
  },
  {
    path: '/provision',
    name: 'Provision',
    component: Provision
  },
  {
    path: '/ticket',
    name: 'ticket',
    component: Ticket,
    meta: { loginRequired: true }
  },
  {
    path: '/callback/:id',
    name: 'paymentcallback',
    component: Callback
  },
  // {
  //   path: '/blog',
  //   name: 'Blog',
  //   component: Blog
  // },
  // {
  //   path: '/blog/:id/:slug',
  //   name: 'ShowBlog',
  //   component: ShowBlog
  // },
  {
    path: '/category',
    name: 'Category',
    component: Categury
  },
  {
    path: '/showcategury/:slug',
    name: 'ShowCategury',
    component: ShowCategury
  },
  {
    path: '/profile/:id/:fullname',
    name: 'Profile',
    component: Profile,
  },
  {
    path: '/consolation-profile/:category/:id/:fullname',
    name: 'ConsolationProfile',
    component: Profile,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  // =======================================
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { loginRedirect: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { loginRedirect: true }
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
    meta: { loginRequired: true }
  },
  // =======================================
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { loginRequired: true }
  },
  {
    path: '/uptoauthor',
    name: 'Author',
    component: Author,
    meta: { loginRequired: true }
  },
  {
    path: '/connection',
    name: 'Connection',
    component: Connection,
    meta: { loginRequired: true }
  },
  {
    path: '/callLog',
    name: 'CallLog',
    component: CallLog,
    meta: { loginRequired: true }
  },
  {
    path: '/revenue',
    name: 'Revenue',
    component: Revenue,
    meta: { loginRequired: true }
  },
  {
    path: '/showconnection/:id/:requestUser',
    name: 'ShowConnection',
    component: ShowConnection,
    meta: { loginRequired: true }
  },
  {
    path: '/notification',
    name: 'Notification',
    component: Notification,
    meta: { loginRequired: true }
  },
  {
    path: '/transaction',
    name: 'Transaction',
    component: Transaction,
    meta: { loginRequired: true }
  },
  {
    path: '/transaction/create/',
    name: 'TransactionCreate',
    component: TransactionCreate,
    meta: { loginRequired: true }
  },
  {
    path: '/create-article/',
    name: 'CreatePost',
    component: CreatePost,
    meta: { loginRequired: true }
  },
  {
    path: '/exam/:id',
    name: 'ExamIndex',
    component: ExamIndex,
    meta: { loginRequired: true }
  },
  {
    path: '/exam/create',
    name: 'ExamCreate',
    component: ExamCreate,
    meta: { loginRequired: true }
  },
  {
    path: '/exam/:id/:slug',
    name: 'ExamShow',
    component: ExamShow,
    meta: { loginRequired: true }
  },
  {
    path: '/exam/visit/:id/:slug',
    name: 'VisitExam',
    component: VisitExam,
    meta: { loginRequired: true }
  },
  {
    path: '/users/exam/visit/:id/:slug/:userId',
    name: 'UsersExam',
    component: UsersExam,
    meta: { loginRequired: true }
  },
  {
    path: '/visits/:id/:fullname',
    name: 'VisitIndex',
    component: VisitIndex,
    meta: { loginRequired: true }
  },
  {
    path: '/visits/show/:id',
    name: 'VisitShow',
    component: VisitShow,
    meta: { loginRequired: true }
  },
  // =======================================
  {
    path: '/admin',
    name: 'Index',
    component: Index,
    meta: { loginRequired: true }
  },
  {
    path: '/admin/user-author/:id',
    name: 'AuthorDetail',
    component: AuthorDetail,
    meta: { loginRequired: true }
  },
  {
    path: '/admin/user/:id',
    name: 'UserDetail',
    component: UserDetail,
    meta: { loginRequired: true }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  // let documentTitle = `${ process.env.VUE_APP_TITLE } - ${ to.name }`
  // if (to.params.subject) {
  //   documentTitle = to.params.subject
  // }
  // document.title = documentTitle
  if (to.matched.some(record => record.meta.loginRequired)) {
    if (store.state.isAuthenticated) {
      next()
    } else {
      next("/login")
    }
  }
  else if (to.matched.some(record => record.meta.loginRedirect)) {
    if (!store.state.isAuthenticated) {
      next()
    } else {
      next("/dashboard")
    }
  }
  else {
    next()
  }
})

export default router
