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
                    <template v-if="question.type === 'FreeText'">
                      <v-list class="w-50 mx-auto">
                        <v-list-item
                          v-for="(answer, ansIdx) of question.answers"
                          :key="ansIdx"
                          prepend-icon="mdi-circle"
                        >
                          {{ answer.answerText }}
                        </v-list-item>
                      </v-list>
                    </template>
                    <template v-else>
                      <Bar
                        :data="getChartData(question.options, question.answers)"
                        class="w-50 mx-auto"
                        style="height: 200px"
                      />
                    </template>
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
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Title } from 'chart.js'
import { onMounted, ref } from 'vue'
import { Bar } from 'vue-chartjs'
import { useRoute } from 'vue-router'

ChartJS.register(Title, BarElement, CategoryScale, LinearScale)

const route = useRoute()
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
          type
          questionnaire
          options {
            label
          }
          answers {
            answerText
          }
        }
      }
    }
  `
}

const getChartData = (options, answers) => {
  // 選択肢のラベルを取得
  const labels: string[] = []
  for (const option of options) {
    labels.push(option.label)
  }

  // 複数回答を平坦化する
  const answerItems = answers.map((ans) => ans.answerText.split(',')).flat()

  // 回答数を集計
  const data = labels.map((label) => answerItems.filter((ans) => ans === label).length)

  return {
    labels,
    backgroundColor: '#000',
    datasets: [{ data }],
  }
}
</script>
