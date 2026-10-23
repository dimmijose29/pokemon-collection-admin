import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const https = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

https.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

https.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const auth = useAuthStore()
      if (auth.token) {
        auth.clearAuth()
        // import dinamico: il router importa già le API, un import statico creerebbe un ciclo
        import('@/router').then(({ default: router }) => router.push({ name: 'login' }))
      }
    }
    return Promise.reject(error)
  },
)

export default https
