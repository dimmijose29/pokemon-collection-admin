import https from '@/api/https'
import type { Condition } from '@/types/condition'

export interface ConditionPayload {
  code: string
  name: string
}

const Conditions = {
  get: async (params: { withTrashed?: boolean } = {}): Promise<Condition[]> => {
    const response = await https.get('/conditions', { params })
    return response.data
  },

  create: async (payload: ConditionPayload): Promise<Condition> => {
    const response = await https.post('/conditions', payload)
    return response.data
  },

  update: async (id: number, payload: ConditionPayload): Promise<Condition> => {
    const response = await https.put(`/conditions/${id}`, payload)
    return response.data
  },

  remove: async (id: number): Promise<void> => {
    await https.delete(`/conditions/${id}`)
  },

  restore: async (id: number): Promise<void> => {
    await https.put(`/conditions/${id}/restore`)
  },
}

export default Conditions
