<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card max-width="700px" class="mx-auto">
          <v-form @submit.prevent="onSubmit">
            <v-card-title class="d-flex">
              <span>アンケート新規作成</span>
              <v-spacer></v-spacer>
              <v-btn type="submit" color="success">作成終了</v-btn>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field label="タイトル" v-model="title"></v-text-field>
                    <v-textarea label="説明" v-model="description"></v-textarea>
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
import { useSurveyStore } from '@/stores/surveyStore'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const surveyStore = useSurveyStore()
const { title, description, questions } = storeToRefs(surveyStore)

const onSubmit = () => {
  questions.value.forEach((v) => console.table(v))
}

const addQuestion = () => {
  questions.value.push({
    type: 'SingleSelection',
    displayOrder: questions.value.length,
    questionaire: '',
    options: [{ label: '' }],
  })
}

onMounted(() => {
  questions.value = []
  addQuestion()
})
</script>
