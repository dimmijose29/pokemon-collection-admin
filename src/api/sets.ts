import { createCrudApi, type ListParams } from '@/api/crud'
import type { Set, SetPayload } from '@/types/set'

export default createCrudApi<Set, SetPayload, ListParams & { series_id?: number }>('/sets')
