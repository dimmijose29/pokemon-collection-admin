import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/test',
      name: 'test',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/TestView.vue'),
    },
  ],
})

// router.beforeEach(async (to, from, next) => {
//   const auth = useAuthStore()

//   // Carica utente se c'è token ma non è ancora fetchato
//   if (auth.token && !auth.user) {
//     await auth.fetchUser()
//   }

//   // Rotte che richiedono autenticazione
//   if (to.meta.requiresAuth && !auth.isAuthenticated) {
//     next('/login')
//   }
//   // Rotte che richiedono admin
//   else if (to.meta.requiresAdmin && !auth.isAdmin) {
//     next('/login')
//   }
//   // Rotte guest (login) → redirect se già autenticato
//   else if (to.meta.requiresGuest && auth.isAuthenticated) {
//     next('/admin')
//   } else {
//     next()
//   }
// })

export default router
