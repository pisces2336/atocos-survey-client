<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card :title="survey?.title">
          <v-card-subtitle>
            <v-row>
              <v-col>
                {{ survey?.description }}
              </v-col>
              <v-col>
                回答リンク：<a :href="submissionPageUrl">{{ submissionPageUrl }}</a>
              </v-col>
            </v-row>
          </v-card-subtitle>
          <v-card-text>
            <template v-for="(question, idx) of survey?.questions" :key="question.id">
              <v-row>
                <v-col>
                  <v-card :title="question.questionnaire">
                    <!-- 回答を集計して表示 -->
                  </v-card>
                </v-col>
              </v-row>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { useAxiosStore } from '@/stores/axiosStore'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const axiosStore = useAxiosStore()

const submissionPageUrl = ref('')
const survey = ref()

onMounted(async () => {
  submissionPageUrl.value =
    'http://' + window.location.host + `/surveys/submit/${route.params['id']}`
  await _fetchData()
})

const _fetchData = async () => {
  const id = route.params['id']
  const query = _getQuery()
  const res = await axiosStore.postGql({ query, variables: { id } })
  survey.value = res.data.getSurvey
  console.log(survey.value)
}

const _getQuery = () => {
  return `
    query getSurvey($id: String!) {
      getSurvey(id: $id) {
        title
        description
        questions {
          id
          questionnaire
        }
      }
    }
  `
}
</script>
