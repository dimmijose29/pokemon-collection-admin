import { ref, watch } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useErrorList } from '@/composables/useErrorList'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import Users from '@/api/users'
import type { User } from '@/types/user'

export function useUserEditModal() {
  const queryClient = useQueryClient()
  const authStore = useAuthStore()
  const loading = ref(false)
  const isOpen = ref(false)
  const editingUser = ref<User | null>(null)
  const { setErrors, clearErrors, allErrors } = useErrorList()
  const { show } = useToast()

  watch(isOpen, (open) => {
    if (!open) {
      clearErrors()
      setTimeout(() => { editingUser.value = null }, 300)
    }
  })

  function openEdit(user: User) {
    editingUser.value = user
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  async function handleSubmit(data: FormData | Record<string, unknown>) {
    if (!editingUser.value) return
    loading.value = true
    clearErrors()
    try {
      const updated = await Users.update(editingUser.value.id, data)
      show('Utente aggiornato con successo')
      // Se ho modificato l'utente loggato, aggiorno anche l'auth store
      if (authStore.user && authStore.user.id === updated.id) {
        authStore.fillUser({ ...authStore.user, ...updated })
      }
      await queryClient.invalidateQueries({ queryKey: ['users'] })
      close()
    } catch (error) {
      setErrors(error)
    } finally {
      loading.value = false
    }
  }

  return { isOpen, loading, allErrors, editingUser, openEdit, close, handleSubmit }
}
