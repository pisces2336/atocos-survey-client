import axios from 'axios'
import { defineStore } from 'pinia'

export const useAxiosStore = defineStore('axios', {
  state: () => ({
    accessToken: '',
  }),

  actions: {
    async postGql(data: { query: string; variables?: object }) {
      try {
        const res = await axios.post('/graphql', data, {
          headers: { Authorization: `Bearer ${this.accessToken}` },
        })
        if (res.data.errors) {
          res.data.errors.forEach((e: Error) => {
            console.error(e.message)
          })
          return null
        }

        return res.data
      } catch (e) {
        console.error(e)
        return null
      }
    },

    async login(email: string, password: string) {
      const sendData = {
        query: `
          mutation login($email: String! $password: String!) {
            login(loginUserInput: {
              email: $email
              password: $password
            }) {
              accessToken
            }
          }
        `,
        variables: { email, password },
      }

      const res = await this.postGql(sendData)
      console.log(res)
      if (!res) {
        return false
      }

      this.accessToken = res.data.login.accessToken
      return true
    },
  },
})
