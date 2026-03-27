import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useErrorList } from '@/composables/useErrorList'
import { login, verify2FA, logout as apiLogout } from '@/api/auth'
import type {
  LoginCredentials,
  LoginResponse,
  TwoFactorChallengeResponse,
  LoginSuccessResponse,
} from '@/types/auth'

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

      if ('twoFactorRequired' in res && res.twoFactorRequired) {
        return { success: false, twoFactorRequired: true }
      }

      // Login ok (ha token)
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

  async function confirm2FACode(code: string) {
    loading.value = true
    error.value = ''

    try {
      const res = await verify2FA(code)

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
      return { success: false }
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
    confirm2FACode,
    logout,
    loading,
    error,
    isAuthenticated: store.isAuthenticated,
    isAdmin: store.isAdmin,
    user: store.user,
  }
}
