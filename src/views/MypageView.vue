<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title> {{ user?.email }} さんのマイページ </v-card-title>
          <v-spacer />
          <v-card-text>
            <v-btn color="blue">新しいアンケートを作成</v-btn>
            <v-data-table :items="surveyList" @click:row="null" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useAxiosStore } from '@/stores/axiosStore'
import { onMounted, ref } from 'vue'

const axiosStore = useAxiosStore()

const user = ref<{ email: string }>()
const surveyList = ref<{ title: string; description: string }[]>([])

const getSendData = () => {
  return {
    query: `
      query {
        me {
          id
          email
        }
      }
    `,
  }
}
onMounted(async () => {
  const sendData = getSendData()
  const res = await axiosStore.postGql(sendData)
  if (!res) {
    return
  }
  user.value = res.data.me

  surveyList.value = [
    { title: 'タイトル１', description: '説明１' },
    { title: 'タイトル２', description: '説明２' },
  ]
})
</script>
