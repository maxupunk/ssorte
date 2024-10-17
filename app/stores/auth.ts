import { defineStore } from 'pinia'
import { setToken, getToken, removeToken, getUser, setUser, removeUser } from '~/composables/useAuth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: getUser(),
    token: getToken(),
  }),
  getters: {
    getToken: (state) => {
      return state.token
    },
  },
  actions: {
    setToken(data: any) {
      this.user = data.user
      this.token = data.token
      setToken(data.token)
      setUser(data.user)
    },
    async login(email: string, password: string) {
      const response = await $fetch('/api/login', {
        method: 'POST',
        body: { email: email, password: password },
      })
      if (!response) return
      this.setToken(response)
      return response
    },
    async logout() {
      const response = await $fetch('/api/logout')
      if (!response) return
      removeToken()
      removeUser()
      this.$reset()
    },
  },
})