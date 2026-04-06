import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ModalMode = 'create' | 'edit'

export const useModalStore = defineStore('modal', () => {
  const isOpen = ref(false)
  const mode = ref<ModalMode>('create')
  const currentData = ref<Record<string, unknown> | null>(null)

  function open(data: Record<string, unknown> | null = null) {
    mode.value = data ? 'edit' : 'create'
    currentData.value = data
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
    setTimeout(() => {
      currentData.value = null
    }, 300)
  }

  return { isOpen, mode, currentData, open, close }
})
