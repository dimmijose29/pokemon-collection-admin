import { describe, it, expect } from 'vitest'
import { formatDate } from '@/utils/dates'

describe('formatDate', () => {
  it('formatta correttamente una data ISO in formato italiano', () => {
    // 2024-03-21 → 21/03/2024
    expect(formatDate('2024-03-21T00:00:00.000Z')).toMatch(/21/)
    expect(formatDate('2024-03-21T00:00:00.000Z')).toMatch(/2024/)
  })

  it('restituisce una stringa non vuota per date valide', () => {
    expect(formatDate('2024-01-01T00:00:00.000Z')).not.toBe('')
  })

  it('gestisce date in formato stringa semplice', () => {
    const result = formatDate('2023-12-25 10:00:00')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})
