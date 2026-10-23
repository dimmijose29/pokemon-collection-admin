import { ref, watch } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useModalStore } from '@/stores/modal'
import { useErrorList } from '@/composables/useErrorList'
import { useToast } from '@/composables/useToast'
import Sets from '@/api/sets'
import type { Set, SetPayload } from '@/types/set'

export function useSetModal() {
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

  async function handleSubmit(data: SetPayload) {
    loading.value = true
    clearErrors()
    try {
      if (modalStore.mode === 'create') {
        await Sets.create(data)
        show('Set creato con successo')
      } else {
        const set = modalStore.currentData as Set
        await Sets.update(set.id, data)
        show('Set aggiornato con successo')
      }
      await queryClient.invalidateQueries({ queryKey: ['sets'] })
      modalStore.close()
    } catch (error) {
      setErrors(error)
    } finally {
      loading.value = false
    }
  }

  return { handleSubmit, loading, allErrors }
}
