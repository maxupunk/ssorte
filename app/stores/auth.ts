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
      setToken(data.token)
      setUser(data.user)
      this.user = data.user
      this.token = data.token
    },
    async login(email: string, password: string) {
      return await $fetch('/api/login', {
        method: 'POST',
        body: { email: email, password: password },
      }).then((res) => {
        this.setToken(res)
      })
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