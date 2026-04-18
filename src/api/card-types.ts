import https from '@/api/https'
import type { CardType } from '@/types/card-type'

export interface CardTypePayload {
  name: string
}

const CardTypes = {
  get: async (params: { withTrashed?: boolean } = {}): Promise<CardType[]> => {
    const response = await https.get('/card-types', { params })
    return response.data
  },

  create: async (payload: CardTypePayload): Promise<CardType> => {
    const response = await https.post('/card-types', payload)
    return response.data
  },

  update: async (id: number, payload: CardTypePayload): Promise<CardType> => {
    const response = await https.put(`/card-types/${id}`, payload)
    return response.data
  },

  remove: async (id: number): Promise<void> => {
    await https.delete(`/card-types/${id}`)
  },

  restore: async (id: number): Promise<void> => {
    await https.put(`/card-types/${id}/restore`)
  },
}

export default CardTypes
