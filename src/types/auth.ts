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
  two_factor_required: true // snake_case come arriva dall'API
  message: string
  temp_token: string
}

export type LoginResponse = LoginSuccessResponse | TwoFactorChallengeResponse

export interface User {
  id: number
  email: string
  username?: string
  is_admin: boolean
}
