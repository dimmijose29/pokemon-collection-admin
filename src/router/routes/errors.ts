import type { RouteRecordRaw } from 'vue-router'

export const errorRoutes: RouteRecordRaw[] = [
  {
    path: '/non-autorizzato',
    name: 'unauthorized',
    component: () => import('@/views/errors/UnauthorizedView.vue'),
  },
  {
    // Catch-all — deve essere sempre l'ultima
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/errors/NotFoundView.vue'),
  },
]
