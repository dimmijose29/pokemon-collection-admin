import { createRouter, createWebHistory } from 'vue-router'
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

router.beforeEach(async (to, _from, next) => {
  const auth = useAuthStore()

  if (to.name === 'login') auth.clearAuth() // Pulisco auth se vado alla pagina di login

  // Token presente ma utente non ancora in memoria (es. refresh pagina)
  if (auth.token && !auth.user) {
    try {
      auth.fillUser(await me())
    } catch {
      auth.clearAuth() // token scaduto o non valido
    }
  }

  if ((to.meta.requiresAuth || to.meta.requiresAdmin) && !auth.isAuthenticated) {
    return next({ name: 'unauthorized' })
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return next({ name: 'unauthorized' })
  }

  if (to.meta.requiresGuest && auth.isAuthenticated) {
    return next({ name: 'home' })
  }

  next()
})

export default router
