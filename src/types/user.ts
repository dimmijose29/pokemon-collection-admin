export interface User {
  id: number
  email: string
  username: string
  is_admin: boolean
  country: string | null
  preferred_currency: string | null
  birth_year: number | null
  avatar_url: string | null
  bio: string | null
  created_at: string
  deleted_at?: string | null
}
