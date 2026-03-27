import { ref, computed } from 'vue'
import axios from 'axios'

export interface ErrorList {
  message: string
  errors: Record<string, string[]>
}

export function useErrorList() {
  const errorResponse = ref<ErrorList | null>(null)

  function clearErrors() {
    errorResponse.value = null
  }

  function setErrors(err: unknown) {
    if (axios.isAxiosError(err) && err.response?.status === 422) {
      errorResponse.value = err.response.data as ErrorList
    } else if (axios.isAxiosError(err) && err.response?.data?.message) {
      errorResponse.value = {
        message: err.response.data.message,
        errors: {},
      }
    } else {
      errorResponse.value = {
        message: 'Errore generico',
        errors: {},
      }
    }
  }

  const generalError = computed(() => {
    if (!errorResponse.value) return ''
    return errorResponse.value.message || 'Errore sconosciuto'
  })

  function getFieldErrors(field: string): string[] {
    return errorResponse.value?.errors?.[field] || []
  }

  const allErrors = computed(() => {
    if (!errorResponse.value) return []
    const fieldErrors = Object.values(errorResponse.value.errors || {}).flat()
    // Se ci sono errori di campo, mostrali. Altrimenti mostra il messaggio generale.
    if (fieldErrors.length > 0) {
      return fieldErrors.filter(Boolean)
    }
    return errorResponse.value.message ? [errorResponse.value.message] : []
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
