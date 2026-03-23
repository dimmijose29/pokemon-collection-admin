import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types' // creiamo types dopo, per ora usa any

export const useAuthStore = defineStore('auth', () => {
  // Stato reattivo
  const user = ref<User | null>(null)
  const token = ref<string>(localStorage.getItem('token') || '')

  const isAuthenticated = ref<boolean>(!!token.value)
  const isAdmin = ref<boolean>(false)

  // Funzioni
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

  // Carica utente dal token (opzionale, da chiamare dopo login o refresh)
  async function fetchUser() {
    if (!token.value) return

    try {
      // Qui useremo axios dopo
      // const res = await api.get('/auth/me')
      // user.value = res.data
      // isAdmin.value = res.data.is_admin
      // Per ora simuliamo
      user.value = { id: 1, email: 'admin@example.com', is_admin: true }
      isAdmin.value = true
    } catch (err) {
      clearAuth()
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    setToken,
    clearAuth,
    fetchUser,
  }
})
