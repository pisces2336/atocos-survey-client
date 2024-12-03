<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title> {{ user?.email }} さんのマイページ </v-card-title>
          <v-spacer />
          <v-card-text>
            <v-btn color="blue" to="/surveys/new">新しいアンケートを作成</v-btn>
            <v-data-table :headers="headers" :items="user?.surveys" @click:row="onClickRow" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useAxiosStore } from '@/stores/axiosStore'
import type { Survey } from '@/types/survey'
import { onMounted, ref } from 'vue'

const axiosStore = useAxiosStore()

const user = ref<{ email: string; surveys: Survey[] }>()

const headers = [
  { title: 'タイトル', key: 'title' },
  { title: '説明', key: 'description' },
]

onMounted(async () => {
  await _fetchData()
})

const _fetchData = async () => {
  const query = _getQuery()
  const res = await axiosStore.postGql({ query })
  if (!res) {
    return
  }
  user.value = res.data.me
}

const _getQuery = () => {
  return `
    query {
      me { 
        email
        surveys {
          id
          title
          description
        }
      }
    }
  `
}

const onClickRow = (_: unknown, data: { item: { id: string } }) => {
  window.location.href = `/surveys/${data.item.id}`
}
</script>
