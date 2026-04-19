import https from '@/api/https'
import type { Card } from '@/types/card'

export interface CardSearchParams {
  withTrashed?: boolean
  set_id?: number | null
  series_id?: number | null
  rarity_id?: number | null
  card_type_id?: number | null
  artist_id?: number | null
  stage?: string | null
  energy_type?: string | null
  name?: string | null
  has_price?: boolean
  page?: number
  per_page?: number
}

export interface CardPage {
  data: Card[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

const Cards = {
  /** Ritorna array semplice — usato da SetCardsTable (compatibilità) */
  get: async (params: CardSearchParams = {}): Promise<Card[]> => {
    const response = await https.get('/cards', { params })
    return response.data
  },

  /** Ricerca paginata — usata dalla schermata Carte */
  search: async (params: CardSearchParams): Promise<CardPage> => {
    const response = await https.get('/cards', {
      params: { ...params, page: params.page ?? 1 },
    })
    return response.data
  },

  getById: async (id: number): Promise<Card> => {
    const response = await https.get(`/cards/${id}`)
    return response.data
  },
}

export default Cards
