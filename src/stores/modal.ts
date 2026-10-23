import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ModalMode = 'create' | 'edit'

export const useModalStore = defineStore('modal', () => {
  const isOpen = ref(false)
  const mode = ref<ModalMode>('create')
  // Entità in modifica; ogni modale la riconverte nel proprio tipo
  const currentData = ref<object | null>(null)

  let resetTimer: ReturnType<typeof setTimeout> | undefined

  function open(data: object | null = null) {
    clearTimeout(resetTimer)
    mode.value = data ? 'edit' : 'create'
    currentData.value = data
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
    // Il reset aspetta la fine dell'animazione di chiusura
    resetTimer = setTimeout(() => {
      currentData.value = null
    }, 300)
  }

  return { isOpen, mode, currentData, open, close }
})
