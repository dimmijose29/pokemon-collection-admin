import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { AxiosError, type AxiosResponse } from 'axios'
import { useCrudTable } from '@/composables/useCrudTable'
import { useToast } from '@/composables/useToast'
import { withSetup } from '../helpers/withSetup'

interface Row {
  id: number
  name: string
  count: number
  created_at: string
  deleted_at?: string | null
}

const rows: Row[] = [
  { id: 1, name: 'Bravo', count: 10, created_at: '2024-03-01T10:00:00Z' },
  { id: 2, name: 'alfa', count: 2, created_at: '2024-01-01T10:00:00Z' },
  {
    id: 3,
    name: 'Charlie',
    count: 30,
    created_at: '2024-02-01T10:00:00Z',
    deleted_at: '2024-04-01',
  },
]

function setup(overrides: Partial<Parameters<typeof useCrudTable<Row>>[0]> = {}) {
  const api = {
    get: vi.fn().mockResolvedValue(rows),
    remove: vi.fn().mockResolvedValue(undefined),
    restore: vi.fn().mockResolvedValue(undefined),
  }
  const { result, unmount } = withSetup(() =>
    useCrudTable<Row>({
      api,
      queryKey: 'things',
      messages: { removed: 'Eliminato', restored: 'Ripristinato' },
      ...overrides,
    }),
  )
  return { table: result, api, unmount }
}

describe('useCrudTable', () => {
  beforeEach(() => {
    useToast().toasts.value = []
  })

  it('carica anche gli eliminati e di default mostra solo gli attivi', async () => {
    const { table, api } = setup()
    await flushPromises()

    expect(api.get).toHaveBeenCalledWith({ withTrashed: true })
    expect(table.rows.value.map((r) => r.id)).toEqual([1, 2])
    expect(table.total.value).toBe(2)

    table.statusFilter.value = 'deleted'
    expect(table.rows.value.map((r) => r.id)).toEqual([3])

    table.statusFilter.value = 'all'
    expect(table.total.value).toBe(3)
  })

  it('filtra con la ricerca testuale', async () => {
    const { table } = setup()
    await flushPromises()

    table.search.value = 'BRA'
    expect(table.rows.value.map((r) => r.id)).toEqual([1])
  })

  it('ordina stringhe, numeri e date per valore', async () => {
    const { table } = setup()
    await flushPromises()
    table.statusFilter.value = 'all'

    table.sort.value = { field: 'name', direction: 'asc' }
    expect(table.rows.value.map((r) => r.name)).toEqual(['alfa', 'Bravo', 'Charlie'])

    table.sort.value = { field: 'count', direction: 'desc' }
    expect(table.rows.value.map((r) => r.count)).toEqual([30, 10, 2])

    table.sort.value = { field: 'created_at', direction: 'asc' }
    expect(table.rows.value.map((r) => r.id)).toEqual([2, 3, 1])
  })

  it('applica filtri e comparatori personalizzati', async () => {
    const { table } = setup({
      filter: (list) => list.filter((r) => r.count > 5),
      sorters: { name: (a, b) => b.name.length - a.name.length },
    })
    await flushPromises()

    expect(table.rows.value.map((r) => r.id)).toEqual([1])
  })

  it("mostra un toast di errore quando l'eliminazione fallisce", async () => {
    const error = new AxiosError('fail', '403', undefined, undefined, {
      status: 403,
      data: { message: 'Non autorizzato' },
    } as AxiosResponse)
    const { table, api } = setup()
    api.remove.mockRejectedValueOnce(error)
    await flushPromises()

    table.remove(1)
    await flushPromises()

    expect(useToast().toasts.value.at(-1)).toMatchObject({
      message: 'Non autorizzato',
      type: 'error',
    })
  })
})
