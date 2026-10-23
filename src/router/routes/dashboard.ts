import type { RouteRecordRaw } from 'vue-router'
import { adminNavGroups } from '@/config/adminNav'
import { SquareStack } from 'lucide-vue-next'

const adminChildren: RouteRecordRaw[] = adminNavGroups
  .flatMap((group) => group.items)
  .map((item) => ({
    path: item.path,
    name: item.routeName,
    component: item.component,
    meta: {
      title: item.label,
      icon: item.icon,
    },
  }))

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/admin/AdminPage.vue'),
    // meta del padre: vale per tutte le pagine figlie
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      ...adminChildren,
      // Route con parametri — non possono stare in adminNav
      {
        path: 'sets/:id/carte',
        name: 'set-cards',
        component: () => import('@/views/SetCardsView.vue'),
        meta: { title: 'Carte del set', icon: SquareStack },
      },
    ],
  },
]
