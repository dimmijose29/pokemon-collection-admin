import { ref, watch } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useModalStore } from '@/stores/modal'
import { useErrorList } from '@/composables/useErrorList'
import { useToast } from '@/composables/useToast'
import Rarities from '@/api/rarities'
import type { Rarity } from '@/types/rarity'

export function useRarityModal() {
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
      if (modalStore.mode === 'create') {
        await Rarities.create(data as { name: string })
        show('Rarità creata con successo')
      } else {
        const rarity = modalStore.currentData as Rarity
        await Rarities.update(rarity.id, data as { name: string })
        show('Rarità aggiornata con successo')
      }
      await queryClient.invalidateQueries({ queryKey: ['rarities'] })
      modalStore.close()
    } catch (error) {
      setErrors(error)
    } finally {
      loading.value = false
    }
  }

  return { handleSubmit, loading, allErrors }
}
