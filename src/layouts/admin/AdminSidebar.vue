<script setup lang="ts">
import { ref, computed } from 'vue'
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

// Tooltip via Teleport (unico modo affidabile dentro overflow-y-auto)
const tooltipLabel = ref('')
const tooltipX = ref(0)
const tooltipY = ref(0)

function showTooltip(event: MouseEvent, label: string) {
  if (!collapsed.value) return
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  tooltipLabel.value = label
  tooltipX.value = rect.right + 10
  tooltipY.value = rect.top + rect.height / 2
}

function hideTooltip() {
  tooltipLabel.value = ''
}

async function handleLogout() {
  await logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <aside
    :class="[
      'flex flex-col h-screen bg-base-200 border-r border-base-300',
      'transition-[width,transform] duration-300 ease-in-out shrink-0',
      'fixed inset-y-0 left-0 z-40',
      layout.sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      'lg:relative lg:inset-auto lg:translate-x-0',
      collapsed ? 'w-64 lg:w-18' : 'w-64',
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center h-16 px-4 border-b border-base-300 shrink-0 overflow-hidden">
      <RouterLink :to="{ name: 'dashboard' }" class="flex items-center gap-3">
        <!-- Mobile: sempre logo.png (lg:hidden) -->
        <img src="/img/logo.png" alt="Logo" class="w-22 shrink-0 lg:hidden" />
        <!-- Desktop espanso: logo.png -->
        <img
          v-if="!collapsed"
          src="/img/logo.png"
          alt="Logo"
          class="w-22 shrink-0 hidden lg:block"
        />
        <!-- Desktop collapsed: pokeball.png -->
        <img
          v-if="collapsed"
          src="/img/pokeball.png"
          alt="Logo"
          class="w-8 h-8 shrink-0 hidden lg:block"
        />
      </RouterLink>
    </div>

    <!-- Navigation: overflow-x-hidden per evitare scrollbar orizzontale -->
    <nav class="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2">
      <template v-for="(group, gi) in adminNavGroups" :key="gi">
        <!-- Group label -->
        <div
          v-if="group.label"
          class="px-3 pb-1 text-xs font-semibold uppercase tracking-widest text-base-content/40 overflow-hidden whitespace-nowrap transition-[max-height,opacity,padding] duration-300"
          :class="
            collapsed ? 'pt-2 lg:max-h-0 lg:opacity-0 lg:pt-0 lg:pb-0' : 'pt-4 max-h-10 opacity-100'
          "
        >
          {{ group.label }}
        </div>

        <ul class="menu menu-sm gap-0.5 p-0 w-full">
          <li v-for="item in group.items" :key="item.routeName" class="w-full">
            <RouterLink
              :to="{ name: item.routeName }"
              activeClass="active"
              exactActiveClass="active"
              class="flex items-center gap-3 rounded-lg transition-colors w-full overflow-hidden"
              :class="collapsed ? 'lg:justify-center' : ''"
              @mouseenter="(e) => showTooltip(e, item.label)"
              @mouseleave="hideTooltip"
            >
              <component :is="item.icon" class="w-5 h-5 shrink-0" />
              <span
                class="whitespace-nowrap transition-[max-width,opacity] duration-300 overflow-hidden"
                :class="collapsed ? 'lg:max-w-0 lg:opacity-0' : 'max-w-full opacity-100'"
              >
                {{ item.label }}
              </span>
            </RouterLink>
          </li>
        </ul>
      </template>
    </nav>

    <!-- Footer -->
    <div class="border-t border-base-300 shrink-0">
      <!-- Desktop collapsed: solo logout con tooltip DaisyUI (fuori da overflow-y-auto, funziona) -->
      <div v-if="collapsed" class="hidden lg:flex justify-center p-2">
        <div class="tooltip tooltip-right" data-tip="Logout">
          <button @click="handleLogout" class="btn btn-ghost btn-sm btn-square">
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Desktop expanded + mobile: footer completo -->
      <div class="p-3 flex items-center gap-3" :class="collapsed ? 'lg:hidden' : ''">
        <div class="avatar shrink-0" :class="authStore.user?.avatar_url ? '' : 'placeholder'">
          <div
            class="rounded-full w-8 overflow-hidden"
            :class="authStore.user?.avatar_url ? '' : 'bg-secondary text-primary-content'"
          >
            <img
              v-if="authStore.user?.avatar_url"
              :src="authStore.user.avatar_url"
              :alt="authStore.user?.username"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-xs font-bold block text-center mt-2 text-black">
              {{ authStore.user?.username?.charAt(0)?.toUpperCase() ?? '?' }}
            </span>
          </div>
        </div>
        <div class="flex-1 min-w-0 overflow-hidden">
          <p class="text-sm font-semibold truncate">{{ authStore.user?.username }}</p>
          <p class="text-xs text-base-content/50 truncate">{{ authStore.user?.email }}</p>
        </div>
        <button @click="handleLogout" class="btn btn-ghost btn-sm btn-square shrink-0">
          <LogOut class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Collapse toggle: solo desktop -->
    <button
      @click="layout.toggleSidebar()"
      class="hidden lg:flex absolute -right-3 top-20 btn btn-xs btn-circle btn-outline bg-base-100 border-base-300 shadow-sm z-10"
    >
      <ChevronLeft v-if="!collapsed" class="w-3 h-3" />
      <ChevronRight v-else class="w-3 h-3" />
    </button>
  </aside>

  <!-- Tooltip teleportato nel body: sfugge a qualsiasi overflow container -->
  <Teleport to="body">
    <div
      v-if="tooltipLabel"
      class="fixed z-[9999] pointer-events-none -translate-y-1/2"
      :style="{ top: `${tooltipY}px`, left: `${tooltipX}px` }"
    >
      <div
        class="bg-neutral text-neutral-content text-xs rounded-lg px-2.5 py-1.5 shadow-md whitespace-nowrap"
      >
        {{ tooltipLabel }}
      </div>
    </div>
  </Teleport>
</template>
