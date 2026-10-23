import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { createPinia } from 'pinia'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import LoginForm from '@/components/auth/LoginForm.vue'
import { login, verify2FA } from '@/api/auth'

const push = vi.fn()
vi.mock('vue-router', () => ({ useRouter: () => ({ push }) }))
vi.mock('@/api/auth', () => ({ login: vi.fn(), verify2FA: vi.fn(), logout: vi.fn() }))

const admin = { id: 1, email: 'a@a.it', username: 'admin', is_admin: true, is_2fa_enabled: true }

function renderForm() {
  return render(LoginForm, {
    global: {
      plugins: [createPinia(), [VueQueryPlugin, { queryClient: new QueryClient() }]],
      stubs: { RouterLink: { template: '<a><slot /></a>' } },
    },
  })
}

async function enterCredentials() {
  await userEvent.type(screen.getByLabelText('Username o email'), 'admin')
  await userEvent.type(screen.getByLabelText('Password'), 'password123')
  await userEvent.click(screen.getByRole('button', { name: 'Accedi' }))
}

describe('LoginForm', () => {
  beforeEach(() => {
    localStorage.clear()
    push.mockReset()
    vi.mocked(login).mockReset()
    vi.mocked(verify2FA).mockReset()
  })

  it("non chiama l'API se i campi sono vuoti", async () => {
    renderForm()
    await userEvent.click(screen.getByRole('button', { name: 'Accedi' }))

    expect(await screen.findByText('Inserisci username o email')).toBeTruthy()
    expect(screen.getByText('Inserisci la password')).toBeTruthy()
    expect(login).not.toHaveBeenCalled()
  })

  it('senza 2FA entra nella dashboard', async () => {
    vi.mocked(login).mockResolvedValue({ token: 'tok', user: { ...admin, is_2fa_enabled: false } })
    renderForm()
    await enterCredentials()

    await waitFor(() => expect(push).toHaveBeenCalledWith({ name: 'dashboard' }))
    expect(login).toHaveBeenCalledWith({ login: 'admin', password: 'password123' })
  })

  it('con 2FA chiede il codice e completa il login con il token temporaneo', async () => {
    vi.mocked(login).mockResolvedValue({
      two_factor_required: true,
      message: '',
      temp_token: 'tmp',
    })
    vi.mocked(verify2FA).mockResolvedValue({ token: 'tok', user: admin })
    renderForm()
    await enterCredentials()

    // Dopo la password compaiono le 6 cifre e spariscono i campi delle credenziali
    const digits = await screen.findAllByLabelText(/Cifra \d di 6/)
    expect(digits).toHaveLength(6)
    expect(screen.queryByLabelText('Password')).toBeNull()

    // L'OTP completo invia da solo il codice, una sola volta
    for (const [i, d] of [...'123456'].entries()) await userEvent.type(digits[i]!, d)

    await waitFor(() => expect(push).toHaveBeenCalledWith({ name: 'dashboard' }))
    expect(verify2FA).toHaveBeenCalledOnce()
    expect(verify2FA).toHaveBeenCalledWith('123456', 'tmp')
  })

  it("codice 2FA errato: mostra l'errore e resta sulla pagina", async () => {
    vi.mocked(login).mockResolvedValue({
      two_factor_required: true,
      message: '',
      temp_token: 'tmp',
    })
    vi.mocked(verify2FA).mockRejectedValue(new Error('Codice 2FA non valido'))
    renderForm()
    await enterCredentials()

    const digits = await screen.findAllByLabelText(/Cifra \d di 6/)
    for (const [i, d] of [...'000000'].entries()) await userEvent.type(digits[i]!, d)

    expect(await screen.findByText('Codice 2FA non valido')).toBeTruthy()
    expect(push).not.toHaveBeenCalled()
  })
})
