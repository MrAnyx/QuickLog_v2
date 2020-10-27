import Vue from 'vue'
import VueRouter from 'vue-router'
import Passwords from '@/views/Security/Passwords'
import Payment from '@/views/Security/Payment'
import Notes from '@/views/Security/Notes'
import Dashboard from '@/views/Manager/Dashboard'

Vue.use(VueRouter)

const routes = [
  {
    path: '/passwords',
    name: 'passwords',
    component: Passwords
  },
  {
    path: '/payment',
    name: 'payment',
    component: Payment
  },
  {
    path: '/notes',
    name: 'notes',
    component: Notes
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
