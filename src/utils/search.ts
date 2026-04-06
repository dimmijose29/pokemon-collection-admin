// src/utils/search.ts

type Transformer<T> = Partial<Record<keyof T, (value: unknown) => string>>

/**
 * Filtra un array di oggetti cercando la query su tutti i valori stringa.
 * - excludeKeys: campi da ignorare completamente
 * - transformers: funzioni per convertire un campo prima di cercarlo
 *   (es. formattare una data ISO in "gg/mm/aaaa")
 */
export function filterBySearch<T extends Record<string, unknown>>(
  items: T[],
  query: string,
  options: {
    excludeKeys?: (keyof T)[]
    transformers?: Transformer<T>
  } = {},
): T[] {
  const q = query.trim().toLowerCase()
  if (!q) return items

  const { excludeKeys = [], transformers = {} } = options

  return items.filter((item) =>
    Object.entries(item).some(([key, value]) => {
      if (excludeKeys.includes(key as keyof T)) return false

      const transform = transformers[key as keyof T]
      const searchable = transform ? transform(value) : typeof value === 'string' ? value : null

      if (!searchable) return false
      return searchable.toLowerCase().includes(q)
    }),
  )
}
