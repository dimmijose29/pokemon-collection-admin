import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useErrorList } from '@/composables/useErrorList'
import { login, verify2FA } from '@/api/auth'
import type { AxiosError } from 'axios'
import type {
  LoginCredentials,
  LoginResponse,
  TwoFactorChallengeResponse,
  LoginSuccessResponse,
} from '@/types/auth'
import type { un } from 'vue-router/dist/index-BzEKChPW.js'

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
      console.log('Login response:', res) // debug

      if ('twoFactorRequired' in res && res.twoFactorRequired) {
        return { twoFactorRequired: true }
      }

      // Login ok (ha token)
      store.setToken(res.token)
      store.fillUser(res.user)

      return { success: true }
    } catch (err: AxiosError | unknown) {
      console.error('Login catch:', err) // debug

      let message = 'Errore durante il login'

      if (err instanceof Error) {
        message = err.message
      }

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

      // TypeScript sa che res è LoginSuccessResponse (non ha twoFactorRequired)
      store.setToken(res.token)
      store.fillUser(res.user)

      return { success: true }
    } catch (err: unknown) {
      // Narrowing sicuro
      if (err instanceof Error) {
        error.value = err.message || 'Codice 2FA non valido'
      } else if (
        typeof err === 'object' &&
        err &&
        'response' in err &&
        err.response?.data?.message
      ) {
        error.value = err.response.data.message
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
      await logout()
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
