import { ref, watch } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useModalStore } from '@/stores/modal'
import { useErrorList } from '@/composables/useErrorList'
import { useToast } from '@/composables/useToast'
import CardTypes from '@/api/card-types'
import type { CardType } from '@/types/card-type'

export function useCardTypeModal() {
  const modalStore = useModalStore()
  const queryClient = useQueryClient()
  const loading = ref(false)
  const { setErrors, clearErrors, allErrors } = useErrorList()
  const { show } = useToast()

  // Pulisce gli errori quando la modale viene chiusa
  watch(
    () => modalStore.isOpen,
    (open) => { if (!open) clearErrors() },
  )

  async function handleSubmit(data: Record<string, unknown>) {
    loading.value = true
    clearErrors()
    try {
      if (modalStore.mode === 'create') {
        await CardTypes.create(data as { name: string })
        show('Tipo carta creato con successo')
      } else {
        const cardType = modalStore.currentData as CardType
        await CardTypes.update(cardType.id, data as { name: string })
        show('Tipo carta aggiornato con successo')
      }
      // Invalida la cache così la tabella si aggiorna automaticamente
      await queryClient.invalidateQueries({ queryKey: ['card-types'] })
      modalStore.close()
    } catch (error) {
      setErrors(error)
    } finally {
      loading.value = false
    }
  }

  return { handleSubmit, loading, allErrors }
}
