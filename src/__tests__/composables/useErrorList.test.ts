import { describe, it, expect, beforeEach } from 'vitest'
import axios from 'axios'
import { useErrorList } from '@/composables/useErrorList'

describe('useErrorList', () => {
  let errorList: ReturnType<typeof useErrorList>

  // Ogni test ha la propria istanza isolata del composable
  beforeEach(() => {
    errorList = useErrorList()
  })

  it('inizia senza errori', () => {
    expect(errorList.allErrors.value).toEqual([])
    expect(errorList.errorResponse.value).toBeNull()
  })

  it('clearErrors resetta lo stato', () => {
    errorList.setErrors(new Error('test'))
    errorList.clearErrors()

    expect(errorList.allErrors.value).toEqual([])
    expect(errorList.errorResponse.value).toBeNull()
  })

  it('imposta un errore generico per errori non Axios', () => {
    errorList.setErrors(new Error('errore generico'))

    expect(errorList.allErrors.value).toEqual(['Errore generico'])
  })

  it('estrae il messaggio da un errore Axios 422 con errori di campo', () => {
    // Simula una risposta 422 di Laravel con errori di validazione
    const axiosError = new axios.AxiosError('Unprocessable', '422', undefined, undefined, {
      status: 422,
      data: {
        message: 'I dati forniti non sono validi.',
        errors: {
          name: ['Il nome è obbligatorio', 'Il nome non può superare i 50 caratteri'],
          code: ['Il codice è già in uso'],
        },
      },
    } as any)

    errorList.setErrors(axiosError)

    // allErrors mostra gli errori di campo (non il messaggio generale)
    expect(errorList.allErrors.value).toContain('Il nome è obbligatorio')
    expect(errorList.allErrors.value).toContain('Il nome non può superare i 50 caratteri')
    expect(errorList.allErrors.value).toContain('Il codice è già in uso')
  })

  it('estrae il messaggio generale da un errore Axios senza errori di campo', () => {
    const axiosError = new axios.AxiosError('Forbidden', '403', undefined, undefined, {
      status: 403,
      data: { message: 'Non autorizzato' },
    } as any)

    errorList.setErrors(axiosError)

    expect(errorList.allErrors.value).toEqual(['Non autorizzato'])
  })

  it('getFieldErrors restituisce gli errori per un campo specifico', () => {
    const axiosError = new axios.AxiosError('Unprocessable', '422', undefined, undefined, {
      status: 422,
      data: {
        message: 'Errore validazione',
        errors: { name: ['Il nome è obbligatorio'] },
      },
    } as any)

    errorList.setErrors(axiosError)

    expect(errorList.getFieldErrors('name')).toEqual(['Il nome è obbligatorio'])
    expect(errorList.getFieldErrors('code')).toEqual([])
  })

  it('generalError restituisce il messaggio principale', () => {
    const axiosError = new axios.AxiosError('Not Found', '404', undefined, undefined, {
      status: 404,
      data: { message: 'Risorsa non trovata' },
    } as any)

    errorList.setErrors(axiosError)

    expect(errorList.generalError.value).toBe('Risorsa non trovata')
  })
})
