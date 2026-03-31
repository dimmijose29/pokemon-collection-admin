<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useLayoutStore } from '@/stores/layout'
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables/useAuth'
import { adminNavGroups } from '@/config/adminNav'

const layout = useLayoutStore()
const authStore = useAuthStore()
const { logout } = useAuth()
const router = useRouter()

const collapsed = computed(() => layout.sidebarCollapsed)

async function handleLogout() {
  await logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <aside
    :class="[
      'flex flex-col h-screen bg-base-200 border-r border-base-300 transition-all duration-300 ease-in-out shrink-0',
      // Mobile: fixed drawer, fuori schermo di default
      'fixed inset-y-0 left-0 z-40',
      layout.sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      // Desktop: inline nel flusso, sempre visibile
      'lg:relative lg:inset-auto lg:translate-x-0',
      // Larghezza: su mobile sempre 64, su desktop dipende da collapsed
      collapsed ? 'w-64 lg:w-[4.5rem]' : 'w-64',
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center h-16 px-4 border-b border-base-300 overflow-hidden">
      <RouterLink :to="{ name: 'dashboard' }" class="flex items-center gap-3 min-w-0">
        <img src="/img/logo.png" alt="Logo" class="w-22 shrink-0" />
      </RouterLink>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2">
      <template v-for="(group, gi) in adminNavGroups" :key="gi">
        <div
          v-if="group.label && !collapsed"
          class="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-widest text-base-content/40"
        >
          {{ group.label }}
        </div>
        <div
          v-else-if="group.label && collapsed"
          class="my-2 border-t border-base-300 lg:block hidden"
        />

        <ul class="menu menu-sm gap-0.5 p-0">
          <li v-for="item in group.items" :key="item.routeName">
            <div
              :class="collapsed ? 'lg:tooltip lg:tooltip-right' : ''"
              :data-tip="collapsed ? item.label : undefined"
            >
              <RouterLink
                :to="{ name: item.routeName }"
                activeClass="active"
                exactActiveClass="active"
                :class="[
                  'flex items-center gap-3 rounded-lg transition-colors',
                  collapsed ? 'lg:justify-center' : '',
                ]"
              >
                <component :is="item.icon" class="w-5 h-5 shrink-0" />
                <span :class="collapsed ? 'lg:hidden' : 'block'">{{ item.label }}</span>
              </RouterLink>
            </div>
          </li>
        </ul>
      </template>
    </nav>

    <!-- User + Logout -->
    <div class="border-t border-base-300 p-3 flex items-center gap-3 overflow-hidden">
      <div class="avatar placeholder shrink-0">
        <div class="bg-secondary text-primary-content rounded-full w-8">
          <span class="text-xs font-bold block text-center mt-2">
            {{ authStore.user?.username?.charAt(0)?.toUpperCase() ?? '?' }}
          </span>
        </div>
      </div>
      <div
        :class="[
          'flex-1 min-w-0 transition-all duration-200',
          collapsed ? 'opacity-0 w-0 overflow-hidden lg:hidden' : 'opacity-100',
        ]"
      >
        <p class="text-sm font-semibold truncate">{{ authStore.user?.username }}</p>
        <p class="text-xs text-base-content/50 truncate">{{ authStore.user?.email }}</p>
      </div>
      <div :class="collapsed ? 'lg:tooltip lg:tooltip-right' : ''" data-tip="Logout">
        <button @click="handleLogout" class="btn btn-ghost btn-sm btn-square shrink-0">
          <LogOut class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Collapse toggle (solo desktop) -->
    <button
      @click="layout.toggleSidebar()"
      class="hidden lg:flex absolute -right-3 top-20 btn btn-xs btn-circle btn-outline bg-base-100 border-base-300 shadow-sm z-10"
    >
      <ChevronLeft v-if="!collapsed" class="w-3 h-3" />
      <ChevronRight v-else class="w-3 h-3" />
    </button>
  </aside>
</template>
