import https from '@/api/https'
import type { Stats } from '@/types/stats'

const StatsApi = {
  get: async (): Promise<Stats> => {
    const response = await https.get('/stats')
    return response.data
  },
}

export default StatsApi
