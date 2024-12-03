import LoginView from '@/views/LoginView.vue'
import MypageView from '@/views/MypageView.vue'
import NewSurveyView from '@/views/NewSurveyView.vue'
import SignupView from '@/views/SignupView.vue'
import SubmitCompleteView from '@/views/SubmitCompleteView.vue'
import SubmitSurveyView from '@/views/SubmitSurveyView.vue'
import SurveyDetailView from '@/views/SurveyDetailView.vue'
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
      path: '/surveys/:id',
      component: SurveyDetailView,
    },
    {
      path: '/surveys/submit/:id',
      component: SubmitSurveyView,
    },
    {
      path: '/surveys/submit/complete',
      component: SubmitCompleteView,
    },
  ],
})

export default router
