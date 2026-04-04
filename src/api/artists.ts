import https from '@/api/https'
import type { Artist } from '@/types/artist'

export interface ArtistParams {
  search?: string
}

export const getArtists = async (params: ArtistParams = {}): Promise<Artist[]> => {
  const response = await https.get('/artists', { params })
  return response.data
}

export const deleteArtist = async (id: number): Promise<void> => {
  await https.delete(`/artists/${id}`)
}
