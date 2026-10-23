import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router'
import { authGuard } from '@/router'
import { useAuthStore } from '@/stores/auth'
import { me } from '@/api/auth'
import type { User } from '@/types/auth'

vi.mock('@/api/auth', () => ({ me: vi.fn() }))

const user = (is_admin: boolean): User => ({
  id: 1,
  email: 'u@u.it',
  username: 'u',
  is_admin,
  is_2fa_enabled: false,
})

// Solo i campi letti dalla guardia
const route = (meta: RouteLocationNormalized['meta'], name = 'qualsiasi') =>
  ({ name, meta }) as RouteLocationNormalized

const adminPage = route({ requiresAuth: true, requiresAdmin: true, title: 'Set' }, 'sets')
const loginPage = route({ requiresGuest: true }, 'login')

describe('authGuard', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    vi.mocked(me).mockReset()
  })

  it('manda al login chi non è autenticato', async () => {
    expect(await authGuard(adminPage)).toEqual({ name: 'login' })
  })

  it('lascia passare un admin e imposta il titolo', async () => {
    const auth = useAuthStore()
    auth.setToken('t')
    auth.fillUser(user(true))

    expect(await authGuard(adminPage)).toBe(true)
    expect(document.title).toBe('Set - Pokemon Collection')
  })

  it('manda a "non autorizzato" un utente non admin', async () => {
    const auth = useAuthStore()
    auth.setToken('t')
    auth.fillUser(user(false))

    expect(await authGuard(adminPage)).toEqual({ name: 'unauthorized' })
  })

  it("dopo un refresh ricarica l'utente dal token", async () => {
    useAuthStore().setToken('t')
    vi.mocked(me).mockResolvedValue(user(true))

    expect(await authGuard(adminPage)).toBe(true)
    expect(me).toHaveBeenCalledOnce()
  })

  it('con un token non più valido svuota la sessione e manda al login', async () => {
    const auth = useAuthStore()
    auth.setToken('scaduto')
    vi.mocked(me).mockRejectedValue(new Error('401'))

    expect(await authGuard(adminPage)).toEqual({ name: 'login' })
    expect(auth.token).toBe('')
  })

  it('chi è già autenticato non torna alla pagina di login', async () => {
    const auth = useAuthStore()
    auth.setToken('t')
    auth.fillUser(user(true))

    expect(await authGuard(loginPage)).toEqual({ name: 'dashboard' })
    expect(auth.token).toBe('t') // nessun logout implicito
  })

  it('le pagine pubbliche sono accessibili a tutti', async () => {
    expect(await authGuard(loginPage)).toBe(true)
    expect(await authGuard(route({}, 'not-found'))).toBe(true)
  })
})
