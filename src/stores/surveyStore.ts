import type { Question } from '@/types/survey'
import { defineStore } from 'pinia'

export const useSurveyStore = defineStore('survey', {
  state: () => ({
    title: '',
    description: '',
    questions: [] as Question[],
  }),
})
