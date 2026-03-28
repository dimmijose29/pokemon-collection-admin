import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useErrorList } from '@/composables/useErrorList'
import { login, verify2FA, logout as apiLogout } from '@/api/auth'
import type { LoginCredentials } from '@/types/auth'

export function useAuth() {
  const store = useAuthStore()
  const errorList = useErrorList()
  const loading = ref(false)
  const error = ref<string>('')

  async function attemptLogin(credentials: LoginCredentials) {
    loading.value = true
    error.value = ''

    try {
      const res = await login(credentials)

      // Il backend ritorna two_factor_required in snake_case
      if ('two_factor_required' in res && res.two_factor_required) {
        return {
          success: false,
          twoFactorRequired: true,
          tempToken: res.temp_token,
        }
      }

      store.setToken(res.token)
      store.fillUser(res.user)
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
      store.setToken(res.token)
      store.fillUser(res.user)
      return { success: true }
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        (err as any).response?.data?.message
      ) {
        error.value = (err as any).response.data.message
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
    } catch (err: unknown) {
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
    isAuthenticated: store.isAuthenticated,
    isAdmin: store.isAdmin,
    user: store.user,
  }
}
