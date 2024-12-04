<template>
  <v-card title="ログイン" max-width="500" class="mx-auto">
    <v-card-text>
      <v-row>
        <v-col>
          <v-form v-model="formValid" @submit.prevent="onSubmit">
            <v-text-field
              label="メールアドレス"
              type="email"
              v-model="email"
              :rules="[requiredRule, emailRule]"
            />
            <v-text-field
              label="パスワード"
              type="password"
              v-model="password"
              :rules="[requiredRule]"
            />
            <v-btn color="green" type="submit" width="80%" class="d-block mx-auto">送信</v-btn>
          </v-form>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center">
          <v-btn href="/signup" variant="text" class="mx-auto"
            >アカウントをお持ちでない方はこちら</v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useAxiosStore } from '@/stores/axiosStore'
import { ref } from 'vue'

const axiosStore = useAxiosStore()

const formValid = ref(false)

const email = ref('')
const password = ref('')

const requiredRule = (v: string) => !!v || '必須項目です'

const emailRule = (v: string) => {
  const regex = /^[a-z\d][\w.-]*@[\w.-]+\.[a-z\d]+$/i
  return regex.test(v) || '不正な形式です'
}

const login = async () => {
  const loginRes = await axiosStore.login(email.value, password.value)
  if (!loginRes) {
    alert('ログインに失敗しました')
    return
  }

  window.location.href = '/mypage'
}

const onSubmit = async () => {
  if (!formValid.value) {
    return
  }
  login()
}
</script>
