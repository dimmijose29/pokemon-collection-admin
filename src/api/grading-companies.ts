import https from '@/api/https'
import type { GradingCompany } from '@/types/grading-company'

export interface GradingCompanyPayload {
  name: string
}

const GradingCompanies = {
  get: async (params: { withTrashed?: boolean } = {}): Promise<GradingCompany[]> => {
    const response = await https.get('/grading-companies', { params })
    return response.data
  },

  create: async (payload: GradingCompanyPayload): Promise<GradingCompany> => {
    const response = await https.post('/grading-companies', payload)
    return response.data
  },

  update: async (id: number, payload: GradingCompanyPayload): Promise<GradingCompany> => {
    const response = await https.put(`/grading-companies/${id}`, payload)
    return response.data
  },

  remove: async (id: number): Promise<void> => {
    await https.delete(`/grading-companies/${id}`)
  },

  restore: async (id: number): Promise<void> => {
    await https.put(`/grading-companies/${id}/restore`)
  },
}

export default GradingCompanies
