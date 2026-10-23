/**
 * Colori e classi DaisyUI per i badge Pokémon
 */

// Colori specifici per tipo energia — hex che rispecchiano i colori reali del GCC Pokémon
export const energyColors: Record<string, { bg: string; text: string; border: string }> = {
  Grass: { bg: '#4a9e3f', text: '#fff', border: '#3a7e32' },
  Fire: { bg: '#e0402a', text: '#fff', border: '#c03020' },
  Water: { bg: '#3080d0', text: '#fff', border: '#2060b0' },
  Lightning: { bg: '#d0a000', text: '#fff', border: '#b08000' },
  Psychic: { bg: '#a040b0', text: '#fff', border: '#803090' },
  Fighting: { bg: '#c05030', text: '#fff', border: '#a03020' },
  Darkness: { bg: '#3a3a4a', text: '#fff', border: '#2a2a3a' },
  Metal: { bg: '#7090a0', text: '#fff', border: '#506070' },
  Dragon: { bg: '#5050d0', text: '#fff', border: '#3030b0' },
  Fairy: { bg: '#d04080', text: '#fff', border: '#b03060' },
  Colorless: { bg: '#8090a0', text: '#fff', border: '#607080' },
  Normal: { bg: '#8090a0', text: '#fff', border: '#607080' },
}

export function getEnergyStyle(type: string): Record<string, string> {
  const c = energyColors[type]
  if (!c) return {}
  return { backgroundColor: c.bg, color: c.text, borderColor: c.border }
}

// Legacy DaisyUI badge classes — usate nella vista lista
export const cardTypeBadgeClass: Record<string, string> = {
  Pokemon: 'badge-primary',
  Trainer: 'badge-secondary',
  Energy: 'badge-warning',
  Pokémon: 'badge-primary',
}

export const stageBadgeClass: Record<string, string> = {
  Basic: 'badge-ghost',
  Stage1: 'badge-info',
  'Stage 1': 'badge-info',
  Stage2: 'badge-primary',
  'Stage 2': 'badge-primary',
  V: 'badge-accent',
  VMAX: 'badge-error',
  VSTAR: 'badge-warning',
  GX: 'badge-secondary',
  EX: 'badge-accent',
}

export function getCardTypeClass(type: string): string {
  return cardTypeBadgeClass[type] ?? 'badge-ghost'
}

export function getStageClass(stage: string): string {
  return stageBadgeClass[stage] ?? 'badge-ghost'
}
