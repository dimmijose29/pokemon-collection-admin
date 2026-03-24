import axios from 'axios'
import type { LoginCredentials, LoginResponse, LoginSuccessResponse } from '@/types/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor per token (opzionale, ma utile)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor errori (opzionale, ma utile per gestire 401 globalmente)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Qui potresti fare logout automatico, ma per ora lasciamo
    }
    return Promise.reject(error)
  },
)

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

export const verify2FA = async (code: string): Promise<LoginSuccessResponse> => {
  const response = await api.post('/auth/2fa/verify', { code })
  return response.data
}

export const enable2FA = async () => {
  const response = await api.post('/auth/2fa/enable')
  return response.data
}

export const confirm2FA = async (code: string) => {
  const response = await api.post('/auth/2fa/confirm', { code })
  return response.data
}

export const disable2FA = async () => {
  const response = await api.post('/auth/2fa/disable')
  return response.data
}

export const logout = async () => {
  await api.post('/auth/logout')
}
