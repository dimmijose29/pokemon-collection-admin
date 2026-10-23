import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
  type RouteLocationRaw,
} from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { me } from '@/api/auth'
import { authRoutes } from './routes/auth'
import { dashboardRoutes } from './routes/dashboard'
import { errorRoutes } from './routes/errors'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...authRoutes,
    ...dashboardRoutes,
    ...errorRoutes, // catch-all sempre in fondo
  ],
})

/**
 * Guardia di autenticazione: restituisce dove reindirizzare, oppure true per proseguire.
 * Separata dal router per poterla testare senza navigazioni reali.
 */
export async function authGuard(to: RouteLocationNormalized): Promise<RouteLocationRaw | true> {
  const auth = useAuthStore()
  document.title = to.meta.title ? `${to.meta.title} - Pokemon Collection` : 'Pokemon Collection'

  // Token presente ma utente non ancora in memoria (es. refresh pagina)
  if (auth.token && !auth.user) {
    try {
      auth.fillUser(await me())
    } catch {
      auth.clearAuth() // token scaduto o non valido
    }
  }

  if ((to.meta.requiresAuth || to.meta.requiresAdmin) && !auth.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'unauthorized' }
  }

  if (to.meta.requiresGuest && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }

  return true
}

router.beforeEach(authGuard)

export default router
