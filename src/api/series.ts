import https from '@/api/https'
import type { Series, SeriesPayload } from '@/types/series'

const SeriesApi = {
  get: async (params: { withTrashed?: boolean } = {}): Promise<Series[]> => {
    const response = await https.get('/series', { params })
    return response.data
  },

  getById: async (id: number): Promise<Series> => {
    const response = await https.get(`/series/${id}`)
    return response.data
  },

  create: async (payload: SeriesPayload): Promise<Series> => {
    const response = await https.post('/series', payload)
    return response.data
  },

  update: async (id: number, payload: SeriesPayload): Promise<Series> => {
    const response = await https.put(`/series/${id}`, payload)
    return response.data
  },

  remove: async (id: number): Promise<void> => {
    await https.delete(`/series/${id}`)
  },

  restore: async (id: number): Promise<void> => {
    await https.put(`/series/${id}/restore`)
  },
}

export default SeriesApi
