import axios from 'axios'
import { defineStore } from 'pinia'
import { useCookies } from 'vue3-cookies'

export const useAxiosStore = defineStore('axios', {
  actions: {
    async postGql(data: { query: string; variables?: object }) {
      const { cookies } = useCookies()
      const accessToken = cookies.get('accessToken')

      try {
        const res = await axios.post('/graphql', data, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        if (res.data.errors) {
          this._errorHandle(res.data.errors)
          return
        }

        return res.data
      } catch (e) {
        // Internal Server Errorが出た場合は再読み込みさせる
        if (axios.isAxiosError(e) && e.status === 500) {
          alert('サーバーに接続できません。')
          window.location.reload()
        }

        console.error(e)
        return null
      }
    },

    _errorHandle(errors: Error[]) {
      // Unauthorizedが含まれる場合
      // 認証情報をcookieから削除してログイン画面にリダイレクトする
      let hasUnauthorized = false

      errors.forEach((e: Error) => {
        if (e.message === 'Unauthorized') {
          hasUnauthorized = true
        }
        console.error(e.message)
      })

      if (hasUnauthorized) {
        const { cookies } = useCookies()
        cookies.remove('accessToken')

        window.location.href = '/login'
      }
    },

    async login(email: string, password: string) {
      const sendData = this._getLoginSendData(email, password)
      const res = await this.postGql(sendData)
      if (!res) {
        return false
      }

      const { cookies } = useCookies()
      cookies.set('accessToken', res.data.login.accessToken)
      return true
    },

    _getLoginSendData(email: string, password: string) {
      return {
        query: `
          mutation login($email: String! $password: String!) {
            login(loginUserInput: {
              email: $email
              password: $password
            }) {
              accessToken
              user {
                id
              }
            }
          }
        `,
        variables: { email, password },
      }
    },
  },
})
