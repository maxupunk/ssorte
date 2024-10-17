import { ofetch } from 'ofetch'
import { useAuthStore } from '@/stores/auth'
import { getToken } from '~/composables/useAuth'

export default defineNuxtPlugin((_nuxtApp: any) => {
  const authStore = useAuthStore()
  globalThis.$fetch = ofetch.create({
    onRequest({ options }) {
      if (getToken()) {
        const headers = new Headers();
        headers.set('Authorization', authStore.getToken);
        options.headers = headers;
      }
    },
    onRequestError({ error }) {
      console.error(error)
    },
    onResponse({ response }) {
      if (response.status === 401 || response.status === 302) {
        authStore.setToken('', true)
      }
    },
  }) as any
})