import { defineStore } from 'pinia'
import { ref } from 'vue'

type LayoutMode = 'sidebar' | 'topnav'

export const useLayoutStore = defineStore('layout', () => {
  const mode = ref<LayoutMode>((localStorage.getItem('layout-mode') as LayoutMode) || 'sidebar')
  const sidebarCollapsed = ref(localStorage.getItem('sidebar-collapsed') === 'true')
  const sidebarOpen = ref(false) // stato mobile drawer (non persistito)

  function setMode(newMode: LayoutMode) {
    mode.value = newMode
    localStorage.setItem('layout-mode', newMode)
  }

  function toggleMode() {
    setMode(mode.value === 'sidebar' ? 'topnav' : 'sidebar')
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
    localStorage.setItem('sidebar-collapsed', String(sidebarCollapsed.value))
  }

  function openSidebar() {
    sidebarOpen.value = true
  }

  function closeSidebar() {
    sidebarOpen.value = false
  }

  function toggleMobileSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  return {
    mode,
    sidebarCollapsed,
    sidebarOpen,
    setMode,
    toggleMode,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    toggleMobileSidebar,
  }
})
