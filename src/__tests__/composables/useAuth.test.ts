import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AxiosError, type AxiosResponse } from 'axios'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth'
import { login, verify2FA, logout } from '@/api/auth'
import { withSetup } from '../helpers/withSetup'
import type { User } from '@/types/auth'

vi.mock('@/api/auth', () => ({ login: vi.fn(), verify2FA: vi.fn(), logout: vi.fn() }))

const user = (is_admin: boolean): User => ({
  id: 1,
  email: 'u@u.it',
  username: 'u',
  is_admin,
  is_2fa_enabled: false,
})

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.mocked(login).mockReset()
    vi.mocked(verify2FA).mockReset()
    vi.mocked(logout).mockReset().mockResolvedValue(undefined)
  })

  it('login riuscito di un admin: salva token e utente', async () => {
    const { result } = withSetup(() => useAuth())
    vi.mocked(login).mockResolvedValue({ token: 'tok', user: user(true) })

    await expect(result.attemptLogin({ login: 'u', password: 'p' })).resolves.toEqual({
      success: true,
    })

    const auth = useAuthStore()
    expect(auth.token).toBe('tok')
    expect(auth.isAdmin).toBe(true)
  })

  it('login di un non admin: revoca il token e mostra il motivo', async () => {
    const { result } = withSetup(() => useAuth())
    vi.mocked(login).mockResolvedValue({ token: 'tok', user: user(false) })

    const res = await result.attemptLogin({ login: 'u', password: 'p' })

    expect(res).toEqual({ success: false, error: ['Accesso riservato agli amministratori'] })
    expect(logout).toHaveBeenCalledOnce() // il token appena emesso viene revocato lato server
    expect(useAuthStore().isAuthenticated).toBe(false)
  })

  it('con 2FA attiva restituisce il token temporaneo senza autenticare', async () => {
    const { result } = withSetup(() => useAuth())
    vi.mocked(login).mockResolvedValue({
      two_factor_required: true,
      message: '',
      temp_token: 'tmp',
    })

    const res = await result.attemptLogin({ login: 'u', password: 'p' })

    expect(res).toEqual({ success: false, twoFactorRequired: true, tempToken: 'tmp' })
    expect(useAuthStore().isAuthenticated).toBe(false)
  })

  it("credenziali errate: restituisce il messaggio dell'API", async () => {
    const { result } = withSetup(() => useAuth())
    vi.mocked(login).mockRejectedValue(
      new AxiosError('422', '422', undefined, undefined, {
        status: 422,
        data: { message: 'Credenziali non valide', errors: {} },
      } as AxiosResponse),
    )

    const res = await result.attemptLogin({ login: 'u', password: 'x' })

    expect(res).toEqual({ success: false, error: ['Credenziali non valide'] })
  })

  it('codice 2FA valido: completa il login', async () => {
    const { result } = withSetup(() => useAuth())
    vi.mocked(verify2FA).mockResolvedValue({ token: 'tok', user: user(true) })

    await expect(result.verify2FACode('123456', 'tmp')).resolves.toEqual({ success: true })
    expect(verify2FA).toHaveBeenCalledWith('123456', 'tmp')
    expect(useAuthStore().token).toBe('tok')
  })

  it("codice 2FA errato: mostra il messaggio dell'API", async () => {
    const { result } = withSetup(() => useAuth())
    vi.mocked(verify2FA).mockRejectedValue(
      new AxiosError('422', '422', undefined, undefined, {
        status: 422,
        data: { message: 'Codice 2FA non valido.' },
      } as AxiosResponse),
    )

    await expect(result.verify2FACode('000000', 'tmp')).resolves.toEqual({
      success: false,
      error: 'Codice 2FA non valido.',
    })
  })

  it("logout svuota la sessione anche se l'API non risponde", async () => {
    const { result } = withSetup(() => useAuth())
    const auth = useAuthStore()
    auth.setToken('tok')
    vi.mocked(logout).mockRejectedValue(new Error('offline'))
    vi.spyOn(console, 'warn').mockImplementation(() => {})

    await result.logout()

    expect(auth.isAuthenticated).toBe(false)
  })
})
