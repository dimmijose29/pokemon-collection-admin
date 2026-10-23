import { createCrudApi } from '@/api/crud'
import type { GradingCompany } from '@/types/grading-company'

export interface GradingCompanyPayload {
  name: string
}

export default createCrudApi<GradingCompany, GradingCompanyPayload>('/grading-companies')
