import { useAuthStore } from '@/stores/auth'
import { login, logout } from '@/api/auth' // creiamo api/auth dopo

export function useAuth() {
  const store = useAuthStore()

  async function login_check(credentials: { login: string; password: string; code?: string }) {
    const res = await login(credentials)

    if (res.data.two_factor_required) {
      return { twoFactorRequired: true }
    }

    store.setToken(res.data.token)
    await store.fetchUser()

    return { success: true }
  }

  async function logout() {
    await logout()
    store.clearAuth()
  }

  return {
    login_check,
    logout,
    isAuthenticated: store.isAuthenticated,
    isAdmin: store.isAdmin,
    user: store.user,
  }
}
