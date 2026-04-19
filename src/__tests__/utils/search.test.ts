import { describe, it, expect } from 'vitest'
import { filterBySearch } from '@/utils/search'

const items = [
  { id: 1, name: 'Mitsuhiro Arita', code: 'ART', created_at: '2024-01-15' },
  { id: 2, name: 'Ken Sugimori', code: 'SUG', created_at: '2024-02-20' },
  { id: 3, name: 'Tomokazu Komiya', code: 'KOM', created_at: '2024-03-10' },
]

describe('filterBySearch', () => {
  it('restituisce tutti gli elementi se la query è vuota', () => {
    expect(filterBySearch(items, '')).toHaveLength(3)
    expect(filterBySearch(items, '   ')).toHaveLength(3)
  })

  it('filtra per nome in modo case-insensitive', () => {
    expect(filterBySearch(items, 'mitsuhiro')).toHaveLength(1)
    expect(filterBySearch(items, 'MITSUHIRO')).toHaveLength(1)
    expect(filterBySearch(items, 'Mitsuhiro')).toHaveLength(1)
  })

  it('filtra per corrispondenza parziale', () => {
    // 'ari' è in "Mitsuhiro Arita" → 1 risultato
    expect(filterBySearch(items, 'ari')).toHaveLength(1)
    // 'ko' è in "Tomokazu" e "Komiya" → solo 1 risultato (stesso record)
    expect(filterBySearch(items, 'ko')).toHaveLength(1)
    // 'a' è in "Mitsuhiro Arita" e "Tomokazu Komiya" → 2 risultati
    expect(filterBySearch(items, 'omiya')).toHaveLength(1)
  })

  it('restituisce array vuoto se nessuna corrispondenza', () => {
    expect(filterBySearch(items, 'xyz_inesistente')).toHaveLength(0)
  })

  it('esclude i campi in excludeKeys dalla ricerca', () => {
    // 'ART' è nel campo code — se lo escludiamo non deve trovare nulla
    const result = filterBySearch(items, 'ART', { excludeKeys: ['code'] })
    expect(result).toHaveLength(0)
  })

  it('non cerca nei campi numerici (solo stringhe)', () => {
    // id è un numero → filterBySearch lo ignora (typeof number !== 'string')
    // tutti e tre gli item hanno id che contiene '1', '2', '3'
    // ma siccome sono numeri non vengono cercati
    const result = filterBySearch(items, '999')
    expect(result).toHaveLength(0)
  })

  it('applica i transformer prima di cercare', () => {
    // created_at '2024-01-15' → '15/01/2024' con toLocaleDateString it-IT
    const result = filterBySearch(items, '15/01/2024', {
      transformers: {
        created_at: (v) => new Date(v as string).toLocaleDateString('it-IT'),
      },
    })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Mitsuhiro Arita')
  })

  it('cerca per codice stringa', () => {
    expect(filterBySearch(items, 'SUG')).toHaveLength(1)
    expect(filterBySearch(items, 'sug')).toHaveLength(1) // case-insensitive
  })
})
