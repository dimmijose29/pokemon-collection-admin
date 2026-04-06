import { ref } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { setErrors } from '@formkit/core'
import { useModalStore } from '@/stores/modal'
import Artists from '@/api/artists'
import type { Artist } from '@/types/artist'

export function useArtistModal() {
  const modalStore = useModalStore()
  const queryClient = useQueryClient()
  const loading = ref(false)

  async function handleSubmit(data: Record<string, unknown>) {
    loading.value = true
    try {
      if (modalStore.mode === 'create') {
        await Artists.create(data as { name: string })
      } else {
        const artist = modalStore.currentData as Artist
        await Artists.update(artist.id, data as { name: string })
      }
      await queryClient.invalidateQueries({ queryKey: ['artists'] })
      modalStore.close()
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors('artist-form', [], error.response.data.errors)
      }
    } finally {
      loading.value = false
    }
  }

  return { handleSubmit, loading }
}
