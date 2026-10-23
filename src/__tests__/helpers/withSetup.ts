import { createApp } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

/**
 * Esegue un composable dentro un'app Vue minima con Pinia e TanStack Query,
 * come farebbe un componente. Restituisce il risultato e una funzione per smontare.
 */
export function withSetup<T>(composable: () => T) {
  let result!: T
  const pinia = createPinia()
  setActivePinia(pinia)
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const app = createApp({
    setup() {
      result = composable()
      return () => null
    },
  })
  app.use(pinia)
  app.use(VueQueryPlugin, { queryClient })
  app.mount(document.createElement('div'))
  return { result, queryClient, unmount: () => app.unmount() }
}
