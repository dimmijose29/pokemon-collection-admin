export interface Series {
  id: number
  tcgdex_id: string | null
  name: string
  logo_url: string | null
  sets_count?: number
  created_at: string
  deleted_at?: string | null
}

export interface SeriesPayload {
  name: string
  tcgdex_id?: string | null
  logo_url?: string | null
}
