import https from '@/api/https'
import type { Currency } from '@/types/currency'

export interface CurrencyPayload {
  code: string
  symbol: string
}

const Currencies = {
  get: async (params: { withTrashed?: boolean } = {}): Promise<Currency[]> => {
    const response = await https.get('/currencies', { params })
    return response.data
  },

  create: async (payload: CurrencyPayload): Promise<Currency> => {
    const response = await https.post('/currencies', payload)
    return response.data
  },

  update: async (id: number, payload: CurrencyPayload): Promise<Currency> => {
    const response = await https.put(`/currencies/${id}`, payload)
    return response.data
  },

  remove: async (id: number): Promise<void> => {
    await https.delete(`/currencies/${id}`)
  },

  restore: async (id: number): Promise<void> => {
    await https.put(`/currencies/${id}/restore`)
  },
}

export default Currencies
