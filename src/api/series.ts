import { createCrudApi } from '@/api/crud'
import type { Series, SeriesPayload } from '@/types/series'

export default createCrudApi<Series, SeriesPayload>('/series')
