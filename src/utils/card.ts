import type { Card } from '@/types/card'

// --- Helpers ---

/** Preferisce inglese, poi italiano, poi prima disponibile */
export function cardName(card: Card): string {
  const en = card.translations?.find((t) => t.language?.code === 'en')
  const it = card.translations?.find((t) => t.language?.code === 'it')
  return en?.name ?? it?.name ?? card.translations?.[0]?.name ?? card.tcgdex_id
}

export function formatPrice(price: number | string | null | undefined): string {
  if (price == null) return '—'
  const n = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(n)) return '—'
  return '€ ' + n.toFixed(2)
}

/** Codice del set in maiuscolo — es. "SWSH1" */
export function setCode(card: Card): string {
  return (card.set?.tcgdex_id ?? '').toUpperCase()
}
