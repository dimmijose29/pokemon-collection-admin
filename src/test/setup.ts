import { config } from '@vue/test-utils'
import { plugin as formkit, defaultConfig } from '@formkit/vue'
import { MotionPlugin } from '@vueuse/motion'

/**
 * Configurazione globale per tutti i test dei componenti.
 *
 * - FormKit: necessario per montare qualsiasi componente che usa <FormKit>
 * - MotionPlugin: necessario per la direttiva v-motion-pop usata in ErrorAlert
 */
config.global.plugins = [[formkit, defaultConfig], MotionPlugin]
