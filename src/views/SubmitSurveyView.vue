<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card :title="title" :subtitle="description" max-width="600px" class="mx-auto">
          <v-card-text>
            <v-form v-model="formValid" @submit.prevent="onSubmit">
              <template v-for="(question, questionIdx) of questions" :key="questionIdx">
                <v-row>
                  <v-col>
                    <v-card :title="question.questionnaire">
                      <v-card-text>
                        {{ answers[questionIdx] }}
                        <template v-if="question.type === 'SingleSelection'">
                          <v-radio-group v-model="answers[questionIdx]" :rules="[requiredRule]">
                            <v-radio
                              v-for="(option, optionIdx) of question.options"
                              :key="optionIdx"
                              :label="option.label"
                              :value="option.label"
                            />
                          </v-radio-group>
                        </template>
                        <template v-else-if="question.type === 'MultipleSelection'">
                          <v-checkbox
                            v-for="(option, optionIdx) of question.options"
                            :key="optionIdx"
                            :label="option.label"
                            :value="option.label"
                            v-model="answers[questionIdx]"
                            hide-details
                          ></v-checkbox>
                        </template>
                        <template v-else-if="question.type === 'FreeText'">
                          <v-textarea
                            label="回答"
                            v-model="answers[questionIdx]"
                            :rules="[requiredRule]"
                          />
                        </template>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </template>
              <v-row>
                <v-col>
                  <v-btn type="submit" color="success" width="100%">回答を送信する</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { useAxiosStore } from '@/stores/axiosStore'
import type { Question } from '@/types/survey'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const axiosStore = useAxiosStore()

const title = ref('')
const description = ref('')
const questions = ref<Question[]>([])

const formValid = ref(false)
const answers = ref<(string | string[])[]>([])

onMounted(() => {
  _fetchData()
})

const _fetchData = async () => {
  const query = _getQuery()
  const variables = _getVariables()
  const res = await axiosStore.postGql({ query, variables })
  if (!res) {
    return
  }

  title.value = res.data.getSurvey.title
  description.value = res.data.getSurvey.description
  questions.value = res.data.getSurvey.questions

  // 問題数と同じ長さで回答保持配列を確保する
  // 複数選択に対応するため空配列で初期化する（選択や自由記述では変更に応じて文字列で上書きされる）
  answers.value = questions.value.map(() => [])
}

const _getQuery = () => {
  return `
    query getSurvey($id: String!) {
      getSurvey(id: $id) {
        title
        description
        questions {
          id
          type
          questionnaire
          options {
            label
          }
        }
      }
    }
  `
}

const _getVariables = () => {
  const surveyId = route.params['id']
  return { id: surveyId }
}

const requiredRule = (v: string | string[]) => {
  if (typeof v === 'string') return !!v || '必須項目です。'
  else return !!v.length || '必須項目です。'
}

const onSubmit = async () => {
  if (!formValid.value) {
    alert('sbmt')
    return
  }

  const variables = await _getSendVariables()
  console.log(variables)
}

const _getSendQuery = () => {
  return ``
}

const _getSendVariables = async () => {
  // 同一人物が複数回答できないようにするためipアドレスを記録する
  const res = await axios.post('https://ipinfo.io/')
  const ipAddress = res.data.ip

  const answersData = answers.value.map((ans, idx) => ({
    questionId: questions.value[idx].id,
    answerText: typeof ans === 'string' ? ans : ans.join(),
  }))

  return {
    surveyId: route.params['id'],
    ipAddress: ipAddress,
    answers: answersData,
  }
}
</script>
