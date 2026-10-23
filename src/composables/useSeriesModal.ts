import { ref, watch } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useModalStore } from '@/stores/modal'
import { useErrorList } from '@/composables/useErrorList'
import { useToast } from '@/composables/useToast'
import SeriesApi from '@/api/series'
import type { Series, SeriesPayload } from '@/types/series'

export function useSeriesModal() {
  const modalStore = useModalStore()
  const queryClient = useQueryClient()
  const loading = ref(false)
  const { setErrors, clearErrors, allErrors } = useErrorList()
  const { show } = useToast()

  watch(
    () => modalStore.isOpen,
    (open) => {
      if (!open) clearErrors()
    },
  )

  async function handleSubmit(data: Record<string, unknown>) {
    loading.value = true
    clearErrors()
    try {
      const payload: SeriesPayload = {
        name: data.name as string,
        tcgdex_id: (data.tcgdex_id as string) || null,
        logo_url: (data.logo_url as string) || null,
      }
      if (modalStore.mode === 'create') {
        await SeriesApi.create(payload)
        show('Serie creata con successo')
      } else {
        const series = modalStore.currentData as Series
        await SeriesApi.update(series.id, payload)
        show('Serie aggiornata con successo')
      }
      await queryClient.invalidateQueries({ queryKey: ['series'] })
      modalStore.close()
    } catch (error) {
      setErrors(error)
    } finally {
      loading.value = false
    }
  }

  return { handleSubmit, loading, allErrors }
}
