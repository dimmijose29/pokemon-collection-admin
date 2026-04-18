import { ref, watch } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useModalStore } from '@/stores/modal'
import { useErrorList } from '@/composables/useErrorList'
import { useToast } from '@/composables/useToast'
import GradingCompanies from '@/api/grading-companies'
import type { GradingCompany } from '@/types/grading-company'

export function useGradingCompanyModal() {
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
        await GradingCompanies.create(data as { name: string })
        show('Compagnia di grading creata con successo')
      } else {
        const gradingCompany = modalStore.currentData as GradingCompany
        await GradingCompanies.update(gradingCompany.id, data as { name: string })
        show('Compagnia di grading aggiornata con successo')
      }
      await queryClient.invalidateQueries({ queryKey: ['grading-companies'] })
      modalStore.close()
    } catch (error) {
      setErrors(error)
    } finally {
      loading.value = false
    }
  }

  return { handleSubmit, loading, allErrors }
}
