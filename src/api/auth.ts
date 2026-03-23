// src/api/auth.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
console.log('API URL:', import.meta.env.VITE_API_URL)
// Interceptor per aggiungere token (opzionale ora, lo attiviamo dopo)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Funzione login
export const login = async (payload: { login: string; password: string; code?: string }) => {
  return api.post('/auth/login', payload)
}

// Placeholder per logout e 2FA (da implementare)
export const logout = async () => {
  return api.post('/auth/logout')
}

export const enable2FA = async () => {
  return api.post('/auth/2fa/enable')
}

export const confirm2FA = async (code: string) => {
  return api.post('/auth/2fa/confirm', { code })
}

export const disable2FA = async (code: string) => {
  return api.post('/auth/2fa/disable', { code })
}
