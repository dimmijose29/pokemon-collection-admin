import type { RouteRecordRaw } from 'vue-router'
import { adminNavGroups } from '@/config/adminNav'

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
    meta: { requiresAuth: true },
    children: adminChildren,
  },
]
