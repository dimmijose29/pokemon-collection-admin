import { createCrudApi } from '@/api/crud'
import type { Rarity } from '@/types/rarity'

export interface RarityPayload {
  name: string
}

export default createCrudApi<Rarity, RarityPayload>('/rarities')
