import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string>(localStorage.getItem('token') || '')

  const isAuthenticated = ref<boolean>(!!token.value)
  const isAdmin = ref<boolean>(false)

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
    isAuthenticated.value = true
  }

  function clearAuth() {
    token.value = ''
    localStorage.removeItem('token')
    isAuthenticated.value = false
    isAdmin.value = false
    user.value = null
  }

  // Funzione per riempire l'utente (chiamata dopo login o refresh)
  function fillUser(fetchedUser: User) {
    user.value = fetchedUser
    isAdmin.value = fetchedUser.is_admin
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
