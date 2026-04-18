import https from '@/api/https'
import type { Rarity } from '@/types/rarity'

export interface RarityPayload {
  name: string
}

const Rarities = {
  get: async (params: { withTrashed?: boolean } = {}): Promise<Rarity[]> => {
    const response = await https.get('/rarities', { params })
    return response.data
  },

  create: async (payload: RarityPayload): Promise<Rarity> => {
    const response = await https.post('/rarities', payload)
    return response.data
  },

  update: async (id: number, payload: RarityPayload): Promise<Rarity> => {
    const response = await https.put(`/rarities/${id}`, payload)
    return response.data
  },

  remove: async (id: number): Promise<void> => {
    await https.delete(`/rarities/${id}`)
  },

  restore: async (id: number): Promise<void> => {
    await https.put(`/rarities/${id}/restore`)
  },
}

export default Rarities
