<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card max-width="700px" class="mx-auto">
          <v-form v-model="formValid" @submit.prevent="onSubmit">
            <v-card-title class="d-flex">
              <span>アンケート新規作成</span>
              <v-spacer></v-spacer>
              <v-btn type="submit" color="success">作成終了</v-btn>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field
                      label="タイトル"
                      v-model="title"
                      :rules="[requiredRule]"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-textarea
                      label="説明"
                      v-model="description"
                      :rules="[requiredRule]"
                      hide-details
                    ></v-textarea>
                  </v-col>
                </v-row>
                <QuestionCardList />
                <v-row>
                  <v-col class="d-flex">
                    <v-btn color="blue" width="100%" @click="addQuestion">設問を追加する</v-btn>
                    <v-spacer></v-spacer>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import QuestionCardList from '@/components/QuestionCardList.vue'
import { useAxiosStore } from '@/stores/axiosStore'
import { useSurveyStore } from '@/stores/surveyStore'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

const axiosStore = useAxiosStore()

const surveyStore = useSurveyStore()
const { title, description, questions } = storeToRefs(surveyStore)

const formValid = ref(false)

const requiredRule = (v: string) => !!v || '必須項目です'

onMounted(() => {
  questions.value = []
  addQuestion()
})

const addQuestion = () => {
  questions.value.push({
    type: 'SingleSelection',
    questionnaire: '',
    options: [{ label: '' }],
  })
}

const onSubmit = async () => {
  if (!formValid.value) {
    return
  }

  const query = _getQuery()
  const variables = await _getSurveyVariables()
  const res = await axiosStore.postGql({ query, variables })
  if (!res) {
    return
  }

  window.location.href = '/mypage'
}

const _getQuery = () => {
  return `
    mutation createSurvey(
      $title: String!
      $description: String!
      $questions: [CreateQuestionInput!]!
    ) {
      createSurvey(createSurveyInput: {
        title: $title
        description: $description
        questions: $questions
      }) {
        title
      }
    }
  `
}

const _getSurveyVariables = async () => {
  const formattedQuestions = questions.value.map((question, questionIdx) => {
    question.displayOrder = questionIdx
    if (['SingleSelection', 'MultipleSelection'].includes(question.type)) {
      // 選択形式の場合は選択肢を整形
      question.options = question.options.map((option, optionIdx) => {
        option.displayOrder = optionIdx
        return option
      })
    } else {
      // 選択形式でない場合は選択肢を除去
      question.options = []
    }
    return question
  })

  return {
    title: title.value,
    description: description.value,
    questions: formattedQuestions,
  }
}
</script>
