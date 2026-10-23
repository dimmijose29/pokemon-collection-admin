import { describe, it, expect } from 'vitest'
import { parseErrors } from '@/utils/parseErrors'

describe('parseErrors', () => {
  it('restituisce il fallback se viene passato un valore falsy', () => {
    expect(parseErrors(null)).toEqual(['Si è verificato un errore'])
    expect(parseErrors(undefined)).toEqual(['Si è verificato un errore'])
    expect(parseErrors('')).toEqual(['Si è verificato un errore'])
  })

  it('restituisce il fallback personalizzato', () => {
    expect(parseErrors(null, 'Errore custom')).toEqual(['Errore custom'])
  })

  it('restituisce un array con la stringa se viene passata una stringa', () => {
    expect(parseErrors('Qualcosa è andato storto')).toEqual(['Qualcosa è andato storto'])
  })

  it("restituisce l'array filtrato se viene passato un array", () => {
    expect(parseErrors(['Errore A', 'Errore B'])).toEqual(['Errore A', 'Errore B'])
  })

  it("filtra i valori falsy dall'array", () => {
    expect(parseErrors(['Errore A', '', null, 'Errore B'])).toEqual(['Errore A', 'Errore B'])
  })

  it('restituisce il fallback se viene passato un oggetto sconosciuto', () => {
    expect(parseErrors({ foo: 'bar' })).toEqual(['Si è verificato un errore'])
  })
})
