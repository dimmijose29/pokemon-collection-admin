import { Chart } from 'chart.js'

/**
 * Default globali di Chart.js: font Manrope (stesso dell'app).
 * Impostati al primo import di questo modulo, che avviene solo nei componenti grafico:
 * così Chart.js resta nel chunk della dashboard e non nel bundle principale.
 */
Chart.defaults.font.family = 'Manrope, system-ui, sans-serif'
Chart.defaults.font.size = 12

/**
 * Legge i colori dal tema DaisyUI corrente (light o dark).
 *
 * Usa rgba() invece di oklch() perché Canvas 2D non risolve in modo affidabile
 * i valori CSS oklch con notazione percentuale passati come stringa.
 * I colori rgba corrispondono ai valori base-content del tema pokemon/pokemon-dark.
 */
export function getChartColors() {
  const isDark = document.documentElement.getAttribute('data-theme')?.includes('dark') ?? false

  if (isDark) {
    // base-content dark: oklch(88% 0.02 240) ≈ rgb(210, 216, 232)
    return {
      text:      'rgba(210, 216, 232, 0.90)',
      textFaint: 'rgba(210, 216, 232, 0.40)',
      grid:      'rgba(210, 216, 232, 0.09)',
      bg:        'rgb(28, 32, 44)',           // base-100 dark
    }
  } else {
    // base-content light: oklch(20% 0.05 240) ≈ rgb(32, 38, 62)
    return {
      text:      'rgba(32, 38, 62, 0.82)',
      textFaint: 'rgba(32, 38, 62, 0.40)',
      grid:      'rgba(32, 38, 62, 0.09)',
      bg:        'rgb(245, 247, 252)',         // base-100 light
    }
  }
}
