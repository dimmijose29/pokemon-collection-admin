import { ref, watch } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useModalStore } from '@/stores/modal'
import { useErrorList } from '@/composables/useErrorList'
import { useToast } from '@/composables/useToast'
import Languages from '@/api/languages'
import type { Language } from '@/types/language'

export function useLanguageModal() {
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
        await Languages.create(data as { code: string; name: string; country_code: string })
        show('Lingua creata con successo')
      } else {
        const language = modalStore.currentData as Language
        await Languages.update(language.id, data as { code: string; name: string; country_code: string })
        show('Lingua aggiornata con successo')
      }
      await queryClient.invalidateQueries({ queryKey: ['languages'] })
      modalStore.close()
    } catch (error) {
      setErrors(error)
    } finally {
      loading.value = false
    }
  }

  return { handleSubmit, loading, allErrors }
}
