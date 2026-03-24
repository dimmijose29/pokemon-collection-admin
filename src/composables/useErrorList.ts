import { ref, computed } from 'vue'
import axios from 'axios'

export interface ErrorList {
  message: string
  errors: Record<string, string[]> // campo → array di messaggi
}

export function useErrorList() {
  const errorResponse = ref<ErrorList | null>(null)

  // Reset errori
  function clearErrors() {
    errorResponse.value = null
  }

  // Imposta errori da risposta API
  function setErrors(err: unknown) {
    if (axios.isAxiosError(err) && err.response?.status === 422) {
      errorResponse.value = err.response.data as ErrorList
    } else {
      errorResponse.value = {
        message: 'Errore generico',
        errors: {},
      }
    }
  }

  // Errore generale (primo messaggio o fallback)
  const generalError = computed(() => {
    if (!errorResponse.value) return ''
    return errorResponse.value.message || 'Errore sconosciuto'
  })

  // Errori per campo specifico
  function getFieldErrors(field: string): string[] {
    return errorResponse.value?.errors?.[field] || []
  }

  // Tutti gli errori come array flat (utile per toast o alert unico)
  const allErrors = computed(() => {
    if (!errorResponse.value) return []
    console.log('Error response for allErrors:', errorResponse.value)
    console.log('Field errors:', Object.values(errorResponse.value.errors || {}).flat()) // debug
    const fieldErrors = Object.values(errorResponse.value.errors || {}).flat()
    console.log([...fieldErrors].filter(Boolean)) // debug
    return [...fieldErrors].filter(Boolean)
  })

  return {
    errorResponse,
    generalError,
    getFieldErrors,
    allErrors,
    setErrors,
    clearErrors,
  }
}
