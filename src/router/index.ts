import LoginView from '@/views/LoginView.vue'
import MypageView from '@/views/MypageView.vue'
import NewSurveyView from '@/views/NewSurveyView.vue'
import SignupView from '@/views/SignupView.vue'
import SubmitSurveyView from '@/views/SubmitSurveyView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      redirect: '/mypage',
    },
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
    {
      path: '/surveys/new',
      component: NewSurveyView,
    },
    {
      path: '/surveys/submit/:id',
      component: SubmitSurveyView,
    },
  ],
})

export default router
