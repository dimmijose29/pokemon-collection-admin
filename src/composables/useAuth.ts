import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useErrorList } from '@/composables/useErrorList'
import { login, verify2FA, logout as apiLogout } from '@/api/auth'
import type { LoginCredentials, LoginSuccessResponse } from '@/types/auth'
import { useQueryClient } from '@tanstack/vue-query'

export function useAuth() {
  const store = useAuthStore()
  const errorList = useErrorList()
  const loading = ref(false)
  const error = ref<string>('')
  const queryClient = useQueryClient()

  // Il pannello è riservato agli admin: un utente normale viene disconnesso subito
  // (anche il token appena emesso viene revocato lato server)
  async function completeLogin(res: LoginSuccessResponse): Promise<string | null> {
    store.setToken(res.token)

    if (!res.user.is_admin) {
      await apiLogout().catch(() => {})
      store.clearAuth()
      return 'Accesso riservato agli amministratori'
    }

    store.fillUser(res.user)
    queryClient.clear()
    return null
  }

  async function attemptLogin(credentials: LoginCredentials) {
    loading.value = true
    error.value = ''

    try {
      const res = await login(credentials)

      // Il backend ritorna two_factor_required in snake_case
      // `in` da solo restringe il tipo: dopo il return `res` è LoginSuccessResponse
      if ('two_factor_required' in res) {
        return {
          success: false,
          twoFactorRequired: true,
          tempToken: res.temp_token,
        }
      }

      const denied = await completeLogin(res)
      if (denied) return { success: false, error: [denied] }
      return { success: true }
    } catch (err: unknown) {
      errorList.setErrors(err)
      return { success: false, error: errorList.allErrors.value }
    } finally {
      loading.value = false
    }
  }

  async function verify2FACode(code: string, tempToken: string) {
    loading.value = true
    error.value = ''

    try {
      const res = await verify2FA(code, tempToken)
      const denied = await completeLogin(res)
      if (denied) return { success: false, error: denied }
      return { success: true }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        error.value = err.response.data.message
      } else if (err instanceof Error) {
        error.value = err.message || 'Codice 2FA non valido'
      } else {
        error.value = 'Errore durante la verifica 2FA'
      }
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await apiLogout()
    } catch {
      console.warn('Logout API fallito, procedo localmente')
    }
    store.clearAuth()
  }

  return {
    attemptLogin,
    verify2FACode,
    logout,
    loading,
    error,
  }
}
