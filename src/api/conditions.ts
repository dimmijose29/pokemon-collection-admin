import { createCrudApi } from '@/api/crud'
import type { Condition } from '@/types/condition'

export interface ConditionPayload {
  code: string
  name: string
}

export default createCrudApi<Condition, ConditionPayload>('/conditions')
