export interface Artist {
  id: number
  name: string
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

// Laravel Resource Collection: { data: [], meta: { total, last_page, ... } }
// Laravel default paginator: { data: [], total, last_page, ... } (piatto)
export interface PaginatedResponse<T> {
  data: T[]
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  // campi piatti (fallback)
  current_page?: number
  last_page?: number
  per_page?: number
  total?: number
}
