import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import SetForm from '@/components/forms/SetForm.vue'
import type { Set } from '@/types/set'

vi.mock('@/api/series', () => ({
  default: {
    get: vi.fn().mockResolvedValue([
      { id: 3, name: 'Sword & Shield', deleted_at: null },
      { id: 4, name: 'Base', deleted_at: '2024-01-01' },
    ]),
  },
}))

function renderForm(props: Record<string, unknown> = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(SetForm, {
    props,
    global: { plugins: [[VueQueryPlugin, { queryClient }]] },
  })
}

const submitForm = () => fireEvent.submit(document.querySelector('#set-form')!)

const set: Set = {
  id: 9,
  tcgdex_id: 'swsh1',
  name: 'Sword & Shield',
  series_id: 3,
  series: { id: 3, name: 'Sword & Shield', tcgdex_id: 'swsh', logo_url: null },
  card_count_official: 202,
  card_count_total: 216,
  release_date: '2020-02-07',
  symbol_url: null,
  logo_url: null,
  created_at: '2024-01-01',
}

describe('SetForm', () => {
  it('in creazione richiede nome e ID TCGdex', async () => {
    const { emitted } = renderForm({ variant: 'create' })
    await submitForm()

    expect(await screen.findByText('Il nome è obbligatorio')).toBeTruthy()
    expect(screen.getByText("L'ID TCGdex è obbligatorio")).toBeTruthy()
    expect(emitted().submit).toBeUndefined()
  })

  it("converte i campi nel payload dell'API (numeri, vuoti → null)", async () => {
    const { emitted } = renderForm({ variant: 'create' })
    await userEvent.type(screen.getByLabelText('Nome'), 'Rebel Clash')
    await userEvent.type(screen.getByLabelText(/ID TCGdex/), 'swsh2')
    await userEvent.type(screen.getByLabelText('Carte ufficiali'), '192')
    await submitForm()

    await waitFor(() => expect(emitted().submit).toBeTruthy())
    expect(emitted().submit![0]).toEqual([
      {
        name: 'Rebel Clash',
        tcgdex_id: 'swsh2',
        series_id: null,
        release_date: null,
        card_count_official: 192,
        card_count_total: undefined,
      },
    ])
  })

  it('in modifica mostra la serie del set e la reinvia come id numerico', async () => {
    const { emitted } = renderForm({ set, variant: 'edit' })

    await waitFor(() =>
      expect((screen.getByLabelText('Serie') as HTMLInputElement).value).toBe('Sword & Shield'),
    )
    await submitForm()

    await waitFor(() => expect(emitted().submit).toBeTruthy())
    expect(emitted().submit![0]).toMatchObject([{ series_id: 3, card_count_total: 216 }])
  })
})
