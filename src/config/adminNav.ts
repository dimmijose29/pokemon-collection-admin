import {
  LayoutDashboard,
  Palette,
  Star,
  Layers,
  Package,
  ShieldCheck,
  Languages,
  DollarSign,
  Settings,
} from 'lucide-vue-next'
import type { Component } from 'vue'

export interface NavItem {
  label: string
  routeName: string
  path: string
  icon: Component
  component: () => Promise<Component>
}

export interface NavGroup {
  label?: string
  items: NavItem[]
}

export const adminNavGroups: NavGroup[] = [
  {
    items: [
      {
        label: 'Dashboard',
        routeName: 'dashboard',
        path: 'dashboard',
        icon: LayoutDashboard,
        component: () => import('@/views/DashboardView.vue'),
      },
    ],
  },
  {
    label: 'Catalogo',
    items: [
      {
        label: 'Artisti',
        routeName: 'artists',
        path: 'artisti',
        icon: Palette,
        component: () => import('@/views/ArtistsView.vue'),
      },
      {
        label: 'Rarità',
        routeName: 'rarities',
        path: 'rarita',
        icon: Star,
        component: () => import('@/views/RaritiesView.vue'),
      },
      {
        label: 'Tipi carta',
        routeName: 'card-types',
        path: 'tipi-carta',
        icon: Layers,
        component: () => import('@/views/CardTypesView.vue'),
      },
      {
        label: 'Condizioni',
        routeName: 'conditions',
        path: 'condizioni',
        icon: ShieldCheck,
        component: () => import('@/views/ConditionsView.vue'),
      },
      {
        label: 'Lingue',
        routeName: 'languages',
        path: 'lingue',
        icon: Languages,
        component: () => import('@/views/LanguagesView.vue'),
      },
      {
        label: 'Valute',
        routeName: 'currencies',
        path: 'valute',
        icon: DollarSign,
        component: () => import('@/views/CurrenciesView.vue'),
      },
      {
        label: 'Grading',
        routeName: 'grading-companies',
        path: 'grading',
        icon: Package,
        component: () => import('@/views/GradingCompaniesView.vue'),
      },
    ],
  },
  {
    label: 'Sistema',
    items: [
      {
        label: 'Impostazioni',
        routeName: 'settings-profile',
        path: 'impostazioni',
        icon: Settings,
        component: () => import('@/views/SettingsView.vue'),
      },
    ],
  },
]
