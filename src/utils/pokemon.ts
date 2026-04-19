/**
 * Colori DaisyUI per i badge Pokémon
 */

export const energyBadgeClass: Record<string, string> = {
  Grass: 'badge-success',
  Fire: 'badge-error',
  Water: 'badge-info',
  Lightning: 'badge-warning',
  Psychic: 'badge-secondary',
  Fighting: 'badge-accent',
  Darkness: 'badge-neutral',
  Metal: 'badge-ghost',
  Dragon: 'badge-primary',
  Fairy: 'badge-secondary',
  Colorless: 'badge-ghost',
  Normal: 'badge-ghost',
}

export const cardTypeBadgeClass: Record<string, string> = {
  Pokemon: 'badge-primary',
  Trainer: 'badge-secondary',
  Energy: 'badge-warning',
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

export function getEnergyClass(type: string): string {
  return energyBadgeClass[type] ?? 'badge-ghost'
}

export function getCardTypeClass(type: string): string {
  return cardTypeBadgeClass[type] ?? 'badge-ghost'
}

export function getStageClass(stage: string): string {
  return stageBadgeClass[stage] ?? 'badge-ghost'
}
