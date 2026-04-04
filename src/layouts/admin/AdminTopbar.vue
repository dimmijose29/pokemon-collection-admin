<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Menu, LogOut, Settings, PanelLeft, Rows3 } from 'lucide-vue-next'
import { useLayoutStore } from '@/stores/layout'
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables/useAuth'

const layout = useLayoutStore()
const authStore = useAuthStore()
const { logout } = useAuth()
const router = useRouter()

async function handleLogout() {
  await logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="h-16 bg-secondary border-b border-base-300 flex items-center px-4 gap-2 shrink-0">
    <!-- Hamburger: solo mobile -->
    <button
      v-if="layout.mode === 'sidebar'"
      @click="layout.toggleMobileSidebar()"
      class="btn btn-ghost btn-sm btn-square lg:hidden"
    >
      <Menu class="w-5 h-5" />
    </button>

    <div class="flex-1" />

    <!-- Layout mode toggle -->
    <div class="tooltip tooltip-bottom" data-tip="Cambia layout">
      <button @click="layout.toggleMode()" class="btn btn-ghost btn-sm btn-square">
        <PanelLeft v-if="layout.mode === 'topnav'" class="w-5 h-5" />
        <Rows3 v-else class="w-5 h-5" />
      </button>
    </div>

    <!-- User dropdown -->
    <div class="dropdown dropdown-end">
      <div tabindex="0" role="button" class="avatar placeholder cursor-pointer">
        <div class="bg-gray-300 text-primary-content rounded-full w-9">
          <span class="text-sm font-bold block text-center mt-2">
            {{ authStore.user?.username?.charAt(0)?.toUpperCase() ?? '?' }}
          </span>
        </div>
      </div>
      <ul
        tabindex="0"
        class="dropdown-content menu menu-sm bg-base-100 rounded-box border border-base-300 shadow-lg z-50 w-52 mt-2 p-2"
      >
        <li class="menu-title px-3 py-2">
          <div>
            <p class="font-semibold text-sm truncate">{{ authStore.user?.username }}</p>
            <p class="text-xs text-base-content/50 truncate">{{ authStore.user?.email }}</p>
          </div>
        </li>
        <li>
          <RouterLink :to="{ name: 'settings-profile' }">
            <Settings class="w-4 h-4" /> Impostazioni
          </RouterLink>
        </li>
        <li class="border-t border-base-300 mt-1 pt-1">
          <button @click="handleLogout" class="text-error">
            <LogOut class="w-4 h-4" /> Logout
          </button>
        </li>
      </ul>
    </div>
  </header>
</template>
