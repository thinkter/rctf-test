import { computed, ref } from 'vue'

const readStoredAuthToken = () =>
  typeof window === 'undefined' ? null : window.localStorage.getItem('token')

const token = ref<string | null>(readStoredAuthToken())

export const loggedIn = computed(() => token.value !== null)

export const setStoredAuthToken = (authToken: string) => {
  window.localStorage.token = authToken
  token.value = authToken
}

export const clearStoredAuthToken = () => {
  window.localStorage.removeItem('token')
  window.localStorage.removeItem('userPerms')
  token.value = null
}
