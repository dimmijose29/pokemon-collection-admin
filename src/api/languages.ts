import { createCrudApi } from '@/api/crud'
import type { Language } from '@/types/language'

export interface LanguagePayload {
  code: string
  name: string
  country_code: string
}

export default createCrudApi<Language, LanguagePayload>('/languages')
