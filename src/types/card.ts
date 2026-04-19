export interface CardTranslation {
  id: number
  language_id: number
  language?: { id: number; code: string; name: string }
  name: string
}

export interface Card {
  id: number
  tcgdex_id: string
  local_id: string
  image_url: string | null
  stage: string | null
  energy_types: string[] | null
  price: number | null
  set?: { id: number; name: string; logo_url: string | null; symbol_url: string | null }
  artist?: { id: number; name: string } | null
  rarity?: { id: number; name: string } | null
  card_type?: { id: number; name: string } | null
  translations?: CardTranslation[]
  created_at: string
  deleted_at?: string | null
}
