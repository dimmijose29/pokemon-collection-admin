import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { AxiosError, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios'
import https from '@/api/https'
import { useAuthStore } from '@/stores/auth'

const push = vi.fn()
vi.mock('@/router', () => ({ default: { push: (...args: unknown[]) => push(...args) } }))

// Adapter finto: risponde con lo status indicato e restituisce la config ricevuta
function respondWith(status: number): AxiosAdapter {
  return async (config: InternalAxiosRequestConfig) => {
    const response = { data: { config }, status, statusText: '', headers: {}, config }
    if (status >= 400) throw new AxiosError('errore', String(status), config, null, response)
    return response
  }
}

const flush = () => new Promise((r) => setTimeout(r, 0))

describe('client HTTP', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    push.mockClear()
  })

  it("aggiunge il token Bearer quando c'è", async () => {
    useAuthStore().setToken('abc')
    const res = await https.get('/qualcosa', { adapter: respondWith(200) })
    expect(res.data.config.headers.Authorization).toBe('Bearer abc')
  })

  it('non aggiunge Authorization senza token', async () => {
    const res = await https.get('/qualcosa', { adapter: respondWith(200) })
    expect(res.data.config.headers.Authorization).toBeUndefined()
  })

  it('su 401 svuota la sessione e torna al login', async () => {
    const auth = useAuthStore()
    auth.setToken('scaduto')

    await expect(https.get('/auth/me', { adapter: respondWith(401) })).rejects.toBeInstanceOf(
      AxiosError,
    )
    await flush()

    expect(auth.isAuthenticated).toBe(false)
    expect(localStorage.getItem('token')).toBeNull()
    expect(push).toHaveBeenCalledWith({ name: 'login' })
  })

  it('su 401 senza sessione (es. login sbagliato) non reindirizza', async () => {
    await expect(
      https.post('/auth/2fa/verify', {}, { adapter: respondWith(401) }),
    ).rejects.toThrow()
    await flush()
    expect(push).not.toHaveBeenCalled()
  })

  it('gli altri errori non toccano la sessione', async () => {
    const auth = useAuthStore()
    auth.setToken('valido')

    await expect(https.get('/x', { adapter: respondWith(500) })).rejects.toThrow()
    await flush()

    expect(auth.isAuthenticated).toBe(true)
    expect(push).not.toHaveBeenCalled()
  })
})
