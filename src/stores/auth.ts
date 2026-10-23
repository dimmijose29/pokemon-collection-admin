import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { User } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string>(localStorage.getItem('token') || '')

  // Derivati da token e utente: non possono andare fuori sincrono
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.is_admin ?? false)

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function clearAuth() {
    token.value = ''
    localStorage.removeItem('token')
    user.value = null
  }

  // Funzione per riempire l'utente (chiamata dopo login o refresh)
  function fillUser(fetchedUser: User) {
    user.value = fetchedUser
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    setToken,
    clearAuth,
    fillUser,
  }
})
