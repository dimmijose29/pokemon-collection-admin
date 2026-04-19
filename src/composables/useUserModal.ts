import { ref, watch } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useErrorList } from '@/composables/useErrorList'
import { useToast } from '@/composables/useToast'
import Users from '@/api/users'

export function useUserModal() {
  const queryClient = useQueryClient()
  const loading = ref(false)
  const isOpen = ref(false)
  const { setErrors, clearErrors, allErrors } = useErrorList()
  const { show } = useToast()

  watch(isOpen, (open) => {
    if (!open) clearErrors()
  })

  function openCreate() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  async function handleSubmit(data: Record<string, unknown>) {
    loading.value = true
    clearErrors()
    try {
      await Users.create(data as { email: string; username: string; password: string; is_admin?: boolean })
      show('Utente creato con successo')
      await queryClient.invalidateQueries({ queryKey: ['users'] })
      close()
    } catch (error) {
      setErrors(error)
    } finally {
      loading.value = false
    }
  }

  return { isOpen, loading, allErrors, openCreate, close, handleSubmit }
}
