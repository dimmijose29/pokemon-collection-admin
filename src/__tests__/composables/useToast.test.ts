import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useToast } from '@/composables/useToast'

describe('useToast', () => {
  const { toasts, show } = useToast()

  // Resetta lo stato condiviso (il ref è a livello di modulo) prima di ogni test
  beforeEach(() => {
    toasts.value = []
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('aggiunge un toast con tipo "success" di default', () => {
    show('Operazione completata')

    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0].message).toBe('Operazione completata')
    expect(toasts.value[0].type).toBe('success')
  })

  it('aggiunge un toast con tipo personalizzato', () => {
    show('Elemento eliminato', 'error')

    expect(toasts.value[0].type).toBe('error')
  })

  it('assegna id univoci a ogni toast', () => {
    show('Toast 1')
    show('Toast 2')

    expect(toasts.value[0].id).not.toBe(toasts.value[1].id)
  })

  it('rimuove il toast dopo la durata specificata', () => {
    show('Temporaneo', 'info', 3000)
    expect(toasts.value).toHaveLength(1)

    // Avanza il timer di 3 secondi
    vi.advanceTimersByTime(3000)

    expect(toasts.value).toHaveLength(0)
  })

  it('non rimuove il toast prima della scadenza', () => {
    show('Persistente', 'warning', 3000)

    vi.advanceTimersByTime(2999)

    expect(toasts.value).toHaveLength(1)
  })

  it('gestisce più toast in contemporanea', () => {
    show('A', 'success', 1000)
    show('B', 'error', 2000)

    vi.advanceTimersByTime(1000)
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0].message).toBe('B')

    vi.advanceTimersByTime(1000)
    expect(toasts.value).toHaveLength(0)
  })
})
