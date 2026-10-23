import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import { MotionPlugin } from '@vueuse/motion'

/**
 * Configurazione globale per tutti i test dei componenti.
 *
 * - MotionPlugin: necessario per la direttiva v-motion-pop usata in ErrorAlert
 */
config.global.plugins = [MotionPlugin]

// jsdom non implementa alcune API DOM usate dai componenti headless (Reka UI / floating-ui)
Element.prototype.scrollIntoView = vi.fn()

if (!('ResizeObserver' in globalThis)) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}
