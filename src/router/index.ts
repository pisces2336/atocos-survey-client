import LoginView from '@/views/LoginView.vue'
import MypageView from '@/views/MypageView.vue'
import SignupView from '@/views/SignupView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/signup',
      component: SignupView,
    },
    {
      path: '/login',
      component: LoginView,
    },
    {
      path: '/mypage',
      component: MypageView,
    },
  ],
})

export default router
