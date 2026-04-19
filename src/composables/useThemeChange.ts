import { onMounted, onUnmounted } from 'vue'

/**
 * Chiama il callback ogni volta che l'attributo data-theme cambia sull'elemento html.
 * Usato dai grafici Chart.js per ricostruirsi con i colori del nuovo tema.
 */
export function useThemeChange(callback: () => void) {
  let observer: MutationObserver | null = null

  onMounted(() => {
    observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'data-theme') {
          callback()
          break
        }
      }
    })
    observer.observe(document.documentElement, { attributes: true })
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })
}
