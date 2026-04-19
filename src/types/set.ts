export interface SetTranslation {
  id: number
  language_id: number
  language?: { id: number; code: string; name: string }
  name: string
}

export interface Set {
  id: number
  tcgdex_id: string
  name: string
  series_id: number | null
  series?: { id: number; name: string; tcgdex_id: string | null; logo_url: string | null } | null
  card_count_official: number
  card_count_total: number
  release_date: string | null
  symbol_url: string | null
  logo_url: string | null
  translations?: SetTranslation[]
  created_at: string
  deleted_at?: string | null
}

export interface SetPayload {
  name: string
  tcgdex_id?: string
  series_id?: number | null
  card_count_official?: number
  card_count_total?: number
  release_date?: string | null
  symbol_url?: string | null
  logo_url?: string | null
}
