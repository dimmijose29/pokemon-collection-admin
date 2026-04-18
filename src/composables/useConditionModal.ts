import { ref, watch } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useModalStore } from '@/stores/modal'
import { useErrorList } from '@/composables/useErrorList'
import { useToast } from '@/composables/useToast'
import Conditions from '@/api/conditions'
import type { Condition } from '@/types/condition'

export function useConditionModal() {
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
        await Conditions.create(data as { code: string; name: string })
        show('Condizione creata con successo')
      } else {
        const condition = modalStore.currentData as Condition
        await Conditions.update(condition.id, data as { code: string; name: string })
        show('Condizione aggiornata con successo')
      }
      await queryClient.invalidateQueries({ queryKey: ['conditions'] })
      modalStore.close()
    } catch (error) {
      setErrors(error)
    } finally {
      loading.value = false
    }
  }

  return { handleSubmit, loading, allErrors }
}
