import { createCrudApi } from '@/api/crud'
import type { Currency } from '@/types/currency'

export interface CurrencyPayload {
  code: string
  symbol: string
}

export default createCrudApi<Currency, CurrencyPayload>('/currencies')
