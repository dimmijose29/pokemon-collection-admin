export interface LoginCredentials {
  login: string
  password: string
  code?: string
}

export interface LoginSuccessResponse {
  user: User
  token: string
}

export interface TwoFactorChallengeResponse {
  twoFactorRequired: true
  message: string
}

export type LoginResponse = LoginSuccessResponse | TwoFactorChallengeResponse

export interface User {
  id: number
  email: string
  username?: string
  is_admin: boolean
  // Aggiungi qui eventuali altri campi che hai nel modello User
}
