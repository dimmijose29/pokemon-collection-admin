import { createCrudApi } from '@/api/crud'
import type { CardType } from '@/types/card-type'

export interface CardTypePayload {
  name: string
}

export default createCrudApi<CardType, CardTypePayload>('/card-types')
