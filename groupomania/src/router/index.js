import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Account from '../views/account.vue'
import Login from '../views/login.vue'
import User from '../views/User.vue'



Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/feed',
    name: 'Home',
    component: Home
  },
  {
    path: '/account',
    name: 'account',
    component: Account
  },
  {
    path: '/user',
    name: 'user',
    component: User
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
