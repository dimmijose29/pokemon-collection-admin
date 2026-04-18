import https from '@/api/https'
import type { LoginCredentials, LoginResponse, LoginSuccessResponse } from '@/types/auth'

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await https.post('/auth/login', credentials)
  return response.data
}

export const verify2FA = async (code: string, tempToken: string): Promise<LoginSuccessResponse> => {
  const response = await https.post('/auth/2fa/verify', { code, temp_token: tempToken })
  return response.data
}

export const enable2FA = async () => {
  const response = await https.post('/auth/2fa/enable')
  return response.data
}

export const confirm2FA = async (code: string) => {
  const response = await https.post('/auth/2fa/confirm', { code })
  return response.data
}

export const disable2FA = async (code: string) => {
  const response = await https.post('/auth/2fa/disable', { code })
  return response.data
}

export const cancelSetup2FA = async () => {
  const response = await https.post('/auth/2fa/cancel')
  return response.data
}

export const forgotPassword = async (email: string) => {
  const response = await https.post('/auth/forgot-password', { email })
  return response.data
}

export const me = async () => {
  const response = await https.get('/auth/me')
  return response.data
}

export const logout = async () => {
  await https.post('/auth/logout')
}

export const updateProfile = async (data: { username: string }) => {
  const response = await https.put('/auth/me', data)
  return response.data
}

export const updatePassword = async (
  userId: number,
  data: {
    password: string
    password_confirmation: string
  },
) => {
  const response = await https.put(`/auth/${userId}/update-password`, data)
  return response.data
}
