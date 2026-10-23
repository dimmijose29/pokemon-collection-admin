import { describe, it, expect, vi, beforeEach } from 'vitest'
import https from '@/api/https'
import { createCrudApi } from '@/api/crud'

vi.mock('@/api/https', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

const http = vi.mocked(https)

describe('createCrudApi', () => {
  const api = createCrudApi<{ id: number; name: string }, { name: string }>('/artists')

  beforeEach(() => {
    vi.clearAllMocks()
    http.get.mockResolvedValue({ data: [] })
    http.post.mockResolvedValue({ data: { id: 1, name: 'A' } })
    http.put.mockResolvedValue({ data: { id: 1, name: 'B' } })
    http.delete.mockResolvedValue({ data: {} })
  })

  it("usa il path dell'entità per lista e dettaglio", async () => {
    await api.get({ withTrashed: true })
    expect(http.get).toHaveBeenCalledWith('/artists', { params: { withTrashed: true } })

    await api.getById(5)
    expect(http.get).toHaveBeenCalledWith('/artists/5')
  })

  it('crea, aggiorna, elimina e ripristina sulle rotte standard', async () => {
    await expect(api.create({ name: 'A' })).resolves.toEqual({ id: 1, name: 'A' })
    expect(http.post).toHaveBeenCalledWith('/artists', { name: 'A' })

    await api.update(1, { name: 'B' })
    expect(http.put).toHaveBeenCalledWith('/artists/1', { name: 'B' })

    await api.remove(1)
    expect(http.delete).toHaveBeenCalledWith('/artists/1')

    await api.restore(1)
    expect(http.put).toHaveBeenCalledWith('/artists/1/restore')
  })
})
