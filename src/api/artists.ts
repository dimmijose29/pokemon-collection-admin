import { createCrudApi } from '@/api/crud'
import type { Artist } from '@/types/artist'

export interface ArtistPayload {
  name: string
}

export default createCrudApi<Artist, ArtistPayload>('/artists')
