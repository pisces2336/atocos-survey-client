<template>
  <v-card title="ユーザー登録" max-width="500" class="mx-auto">
    <v-card-text>
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
        <v-text-field
          label="パスワード（再入力）"
          type="password"
          v-model="passwordConfirmation"
          :rules="[requiredRule, passwordConfirmRule]"
        />
        <v-btn color="green" type="submit" width="80%" class="d-block mx-auto">送信</v-btn>
      </v-form>
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
const passwordConfirmation = ref('')

const requiredRule = (v: string) => !!v || '必須項目です'

const emailRule = (v: string) => {
  const regex = /^[a-z\d][\w.-]*@[\w.-]+\.[a-z\d]+$/i
  return regex.test(v) || '不正な形式です'
}

const passwordConfirmRule = () => {
  return password.value === passwordConfirmation.value || 'パスワードが一致しません'
}

const getSendData = () => {
  return {
    query: `
      mutation createUser($email: String! $password: String!) {
        createUser(createUserInput: {
          email: $email
          password: $password
        }) {
          id
          email
        }
      }
    `,
    variables: {
      email: email.value,
      password: password.value,
    },
  }
}

const createUser = async () => {
  const sendData = getSendData()
  const createRes = await axiosStore.postGql(sendData)
  if (!createRes) {
    alert('ユーザーの作成に失敗しました')
    return
  }
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

  createUser()
  login()
}
</script>
