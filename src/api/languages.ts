import https from '@/api/https'
import type { Language } from '@/types/language'

export interface LanguagePayload {
  code: string
  name: string
  country_code: string
}

const Languages = {
  get: async (params: { withTrashed?: boolean } = {}): Promise<Language[]> => {
    const response = await https.get('/languages', { params })
    return response.data
  },

  create: async (payload: LanguagePayload): Promise<Language> => {
    const response = await https.post('/languages', payload)
    return response.data
  },

  update: async (id: number, payload: LanguagePayload): Promise<Language> => {
    const response = await https.put(`/languages/${id}`, payload)
    return response.data
  },

  remove: async (id: number): Promise<void> => {
    await https.delete(`/languages/${id}`)
  },

  restore: async (id: number): Promise<void> => {
    await https.put(`/languages/${id}/restore`)
  },
}

export default Languages
