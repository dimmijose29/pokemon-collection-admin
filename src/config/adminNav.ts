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
  BookOpen,
  Users,
  SquareStack,
  Library,
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
        label: 'Serie',
        routeName: 'series',
        path: 'serie',
        icon: Library,
        component: () => import('@/views/SeriesView.vue'),
      },
      {
        label: 'Set',
        routeName: 'sets',
        path: 'sets',
        icon: BookOpen,
        component: () => import('@/views/SetsView.vue'),
      },
      {
        label: 'Carte',
        routeName: 'cards',
        path: 'carte',
        icon: SquareStack,
        component: () => import('@/views/CardsView.vue'),
      },
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
        label: 'Utenti',
        routeName: 'users',
        path: 'utenti',
        icon: Users,
        component: () => import('@/views/UsersView.vue'),
      },
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
