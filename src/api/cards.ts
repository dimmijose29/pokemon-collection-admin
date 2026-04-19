import https from '@/api/https'
import type { Card } from '@/types/card'

const Cards = {
  get: async (params: { withTrashed?: boolean; set_id?: number; rarity_id?: number } = {}): Promise<Card[]> => {
    const response = await https.get('/cards', { params })
    return response.data
  },

  getById: async (id: number): Promise<Card> => {
    const response = await https.get(`/cards/${id}`)
    return response.data
  },
}

export default Cards
