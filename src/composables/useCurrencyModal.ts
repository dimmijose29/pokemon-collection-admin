import { ref, watch } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useModalStore } from '@/stores/modal'
import { useErrorList } from '@/composables/useErrorList'
import { useToast } from '@/composables/useToast'
import Currencies from '@/api/currencies'
import type { Currency } from '@/types/currency'

export function useCurrencyModal() {
  const modalStore = useModalStore()
  const queryClient = useQueryClient()
  const loading = ref(false)
  const { setErrors, clearErrors, allErrors } = useErrorList()
  const { show } = useToast()

  // Pulisce gli errori quando la modale viene chiusa
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
        await Currencies.create(data as { code: string; symbol: string })
        show('Valuta creata con successo')
      } else {
        const currency = modalStore.currentData as Currency
        await Currencies.update(currency.id, data as { code: string; symbol: string })
        show('Valuta aggiornata con successo')
      }
      await queryClient.invalidateQueries({ queryKey: ['currencies'] })
      modalStore.close()
    } catch (error) {
      setErrors(error)
    } finally {
      loading.value = false
    }
  }

  return { handleSubmit, loading, allErrors }
}
