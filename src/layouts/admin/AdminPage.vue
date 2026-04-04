<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'
import AdminSidebar from '@/layouts/admin/AdminSidebar.vue'
import AdminTopbar from '@/layouts/admin/AdminTopbar.vue'
import AdminNavbar from '@/layouts/admin/AdminNavbar.vue'

const layout = useLayoutStore()
const route = useRoute()

const isSidebar = computed(() => layout.mode === 'sidebar')

// Chiude il drawer mobile ad ogni navigazione
watch(
  () => route.path,
  () => {
    layout.closeSidebar()
  },
)
</script>

<template>
  <!-- SIDEBAR MODE -->
  <div v-if="isSidebar" class="flex h-screen overflow-hidden relative">
    <!-- Backdrop mobile -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="layout.sidebarOpen"
        @click="layout.closeSidebar()"
        class="fixed inset-0 bg-black/50 z-30 lg:hidden"
      />
    </Transition>

    <AdminSidebar />

    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <AdminTopbar />
      <main class="flex-1 overflow-y-auto p-4 md:p-6 bg-base-200">
        <RouterView />
      </main>
    </div>
  </div>

  <!-- TOPNAV MODE -->
  <div v-else class="flex flex-col h-screen overflow-hidden">
    <AdminNavbar />
    <main class="flex-1 overflow-y-auto p-4 md:p-6 bg-base-200">
      <RouterView />
    </main>
  </div>
</template>
