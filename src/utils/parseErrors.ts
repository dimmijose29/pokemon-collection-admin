/**
 * Normalizza il campo error di un risultato API in un array di stringhe.
 * Usare nei form per gestire gli errori restituiti dai composables.
 */
export function parseErrors(error: unknown, fallback = 'Si è verificato un errore'): string[] {
  if (!error) return [fallback]
  if (Array.isArray(error)) return error.filter(Boolean)
  if (typeof error === 'string') return [error]
  return [fallback]
}
