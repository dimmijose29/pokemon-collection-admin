import https from '@/api/https'
import type { Set, SetPayload } from '@/types/set'

const Sets = {
  get: async (params: { withTrashed?: boolean; series?: string } = {}): Promise<Set[]> => {
    const response = await https.get('/sets', { params })
    return response.data
  },

  getById: async (id: number): Promise<Set> => {
    const response = await https.get(`/sets/${id}`)
    return response.data
  },

  create: async (payload: SetPayload): Promise<Set> => {
    const response = await https.post('/sets', payload)
    return response.data
  },

  update: async (id: number, payload: SetPayload): Promise<Set> => {
    const response = await https.put(`/sets/${id}`, payload)
    return response.data
  },

  remove: async (id: number): Promise<void> => {
    await https.delete(`/sets/${id}`)
  },

  restore: async (id: number): Promise<void> => {
    await https.put(`/sets/${id}/restore`)
  },
}

export default Sets
