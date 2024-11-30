<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>ようこそ、{{ user?.email }} さん！</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useAxiosStore } from '@/stores/axiosStore'
import { onMounted, ref } from 'vue'

const axiosStore = useAxiosStore()

const user = ref<{ email: string }>()

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
  console.log(res)
  if (!res) {
    return
  }
  user.value = res.data.me
})
</script>
