import https from '@/api/https'
import type { Artist } from '@/types/artist'

export interface ArtistPayload {
  name: string
}

const Artists = {
  get: async (params: { withTrashed?: boolean } = {}): Promise<Artist[]> => {
    const response = await https.get('/artists', { params })
    return response.data
  },

  create: async (payload: ArtistPayload): Promise<Artist> => {
    const response = await https.post('/artists', payload)
    return response.data
  },

  update: async (id: number, payload: ArtistPayload): Promise<Artist> => {
    const response = await https.put(`/artists/${id}`, payload)
    return response.data
  },

  remove: async (id: number): Promise<void> => {
    await https.delete(`/artists/${id}`)
  },

  restore: async (id: number): Promise<void> => {
    await https.put(`/artists/${id}/restore`)
  },
}

export default Artists
