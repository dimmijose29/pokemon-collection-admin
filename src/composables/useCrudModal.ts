import { ref, watch } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useModalStore } from '@/stores/modal'
import { useErrorList } from '@/composables/useErrorList'
import { useToast } from '@/composables/useToast'
import type { CrudApi } from '@/api/crud'

interface CrudModalOptions<P> {
  api: Pick<CrudApi<unknown, P>, 'create' | 'update'>
  /** Prefisso delle query da invalidare dopo il salvataggio (es. 'artists'). */
  queryKey: string
  messages: { created: string; updated: string }
  /** Converte i valori del form nel payload dell'API; di default li passa così come sono. */
  toPayload?: (data: object) => P
}

/**
 * Logica di salvataggio delle modali di catalogo, condivisa da tutte le entità:
 * create o update in base alla modalità della modale, toast, invalidazione cache, errori.
 */
export function useCrudModal<P>(options: CrudModalOptions<P>) {
  const modalStore = useModalStore()
  const queryClient = useQueryClient()
  const loading = ref(false)
  const { setErrors, clearErrors, allErrors } = useErrorList()
  const { show } = useToast()
  const toPayload = options.toPayload ?? ((data: object) => data as P)

  watch(
    () => modalStore.isOpen,
    (open) => {
      if (!open) clearErrors()
    },
  )

  async function handleSubmit(data: object) {
    loading.value = true
    clearErrors()
    try {
      const payload = toPayload(data)
      if (modalStore.mode === 'create') {
        await options.api.create(payload)
        show(options.messages.created)
      } else {
        const { id } = modalStore.currentData as { id: number }
        await options.api.update(id, payload)
        show(options.messages.updated)
      }
      await queryClient.invalidateQueries({ queryKey: [options.queryKey] })
      modalStore.close()
    } catch (error) {
      setErrors(error)
    } finally {
      loading.value = false
    }
  }

  return { handleSubmit, loading, allErrors }
}
