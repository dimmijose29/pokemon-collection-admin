import https from '@/api/https'
import type { User } from '@/types/user'

const Users = {
  get: async (params: { withTrashed?: boolean } = {}): Promise<User[]> => {
    const response = await https.get('/users', { params })
    return response.data
  },

  create: async (data: { email: string; username: string; password: string; is_admin?: boolean }): Promise<User> => {
    const response = await https.post('/users', data)
    return response.data
  },

  update: async (id: number, data: Record<string, unknown> | FormData): Promise<User> => {
    if (data instanceof FormData) {
      // Multipart per upload avatar — usiamo POST con _method:PATCH
      data.append('_method', 'PATCH')
      const response = await https.post(`/users/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    }
    const response = await https.patch(`/users/${id}`, data)
    return response.data
  },

  remove: async (id: number): Promise<void> => {
    await https.delete(`/users/${id}`)
  },

  restore: async (id: number): Promise<void> => {
    await https.put(`/users/${id}/restore`)
  },

  toggleAdmin: async (id: number, isAdmin: boolean): Promise<User> => {
    const response = await https.patch(`/users/${id}`, { is_admin: isAdmin })
    return response.data
  },
}

export default Users
