import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types/auth'

const admin: User = {
  id: 1,
  email: 'a@a.it',
  username: 'admin',
  is_admin: true,
  is_2fa_enabled: false,
}

describe('auth store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it("legge il token salvato all'avvio (refresh della pagina)", () => {
    localStorage.setItem('token', 'salvato')
    setActivePinia(createPinia())
    const auth = useAuthStore()

    expect(auth.token).toBe('salvato')
    expect(auth.isAuthenticated).toBe(true)
    expect(auth.isAdmin).toBe(false) // utente non ancora caricato
  })

  it('setToken salva il token e autentica', () => {
    const auth = useAuthStore()
    auth.setToken('abc')

    expect(localStorage.getItem('token')).toBe('abc')
    expect(auth.isAuthenticated).toBe(true)
  })

  it("isAdmin dipende dall'utente caricato", () => {
    const auth = useAuthStore()
    auth.fillUser(admin)
    expect(auth.isAdmin).toBe(true)

    auth.fillUser({ ...admin, is_admin: false })
    expect(auth.isAdmin).toBe(false)
  })

  it('clearAuth azzera token, utente e flag insieme', () => {
    const auth = useAuthStore()
    auth.setToken('abc')
    auth.fillUser(admin)

    auth.clearAuth()

    expect(localStorage.getItem('token')).toBeNull()
    expect(auth.user).toBeNull()
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.isAdmin).toBe(false)
  })
})
