<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { LogOut, Settings, PanelLeft, Menu, X } from 'lucide-vue-next'
import { useLayoutStore } from '@/stores/layout'
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables/useAuth'
import { adminNavGroups } from '@/config/adminNav'

const layout = useLayoutStore()
const authStore = useAuthStore()
const { logout } = useAuth()
const router = useRouter()
const route = useRoute()

const allItems = adminNavGroups.flatMap((g) => g.items)
const mobileMenuOpen = ref(false)

// Chiude menu mobile ad ogni navigazione
import { watch } from 'vue'
watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false
  },
)

async function handleLogout() {
  await logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div>
    <header
      class="h-16 bg-base-100 border-b border-base-300 flex items-center px-4 md:px-6 gap-4 shrink-0"
    >
      <!-- Logo -->
      <RouterLink :to="{ name: 'dashboard' }" class="flex items-center gap-2 shrink-0">
        <img src="/img/logo.png" alt="Logo" class="w-22" />
      </RouterLink>

      <!-- Nav items: solo desktop -->
      <nav class="hidden lg:flex flex-1 overflow-x-auto">
        <ul class="menu menu-horizontal menu-sm gap-1 flex-nowrap p-0">
          <li v-for="item in allItems" :key="item.routeName">
            <RouterLink
              :to="{ name: item.routeName }"
              activeClass="active"
              exactActiveClass="active"
              class="flex items-center gap-2 whitespace-nowrap"
            >
              <component :is="item.icon" class="w-4 h-4" />
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <!-- Spacer su mobile -->
      <div class="flex-1 lg:hidden" />

      <!-- Layout mode toggle -->
      <div class="tooltip tooltip-bottom" data-tip="Cambia layout">
        <button @click="layout.toggleMode()" class="btn btn-ghost btn-sm btn-square">
          <PanelLeft class="w-5 h-5" />
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

      <!-- Hamburger mobile -->
      <button
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="btn btn-ghost btn-sm btn-square lg:hidden"
      >
        <X v-if="mobileMenuOpen" class="w-5 h-5" />
        <Menu v-else class="w-5 h-5" />
      </button>
    </header>

    <!-- Mobile dropdown menu -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-2"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileMenuOpen"
        class="lg:hidden bg-base-100 border-b border-base-300 shadow-md z-20 relative"
      >
        <ul class="menu menu-sm p-3 gap-0.5">
          <template v-for="(group, gi) in adminNavGroups" :key="gi">
            <li
              v-if="group.label"
              class="menu-title text-xs uppercase tracking-widest text-base-content/40 pt-3"
            >
              {{ group.label }}
            </li>
            <li v-for="item in group.items" :key="item.routeName">
              <RouterLink
                :to="{ name: item.routeName }"
                activeClass="active"
                exactActiveClass="active"
                class="flex items-center gap-3"
              >
                <component :is="item.icon" class="w-4 h-4" />
                {{ item.label }}
              </RouterLink>
            </li>
          </template>
        </ul>
      </div>
    </Transition>
  </div>
</template>
