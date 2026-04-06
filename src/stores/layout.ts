import { defineStore } from 'pinia'
import { ref } from 'vue'

type LayoutMode = 'sidebar' | 'topnav'

const LIGHT_THEME = 'pokemon'
const DARK_THEME = 'pokemon-dark'
const FONT_SIZES = [13, 14, 15, 16, 17, 18] // px, level 0-5

export const useLayoutStore = defineStore('layout', () => {
  const mode = ref<LayoutMode>((localStorage.getItem('layout-mode') as LayoutMode) || 'sidebar')
  const sidebarCollapsed = ref(localStorage.getItem('sidebar-collapsed') === 'true')
  const sidebarOpen = ref(false)
  const darkMode = ref(localStorage.getItem('dark-mode') === 'true')
  const fontSizeLevel = ref(parseInt(localStorage.getItem('font-size-level') ?? '1'))

  // --- Applicazione iniziale ---
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', darkMode.value ? DARK_THEME : LIGHT_THEME)
  }

  function applyFontSize() {
    document.documentElement.style.fontSize = `${FONT_SIZES[fontSizeLevel.value]}px`
  }

  applyTheme()
  applyFontSize()

  // --- Azioni ---
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

  function toggleDarkMode() {
    darkMode.value = !darkMode.value
    localStorage.setItem('dark-mode', String(darkMode.value))
    applyTheme()
  }

  function setFontSizeLevel(level: number) {
    fontSizeLevel.value = level
    localStorage.setItem('font-size-level', String(level))
    applyFontSize()
  }

  return {
    mode,
    sidebarCollapsed,
    sidebarOpen,
    darkMode,
    fontSizeLevel,
    setMode,
    toggleMode,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    toggleMobileSidebar,
    toggleDarkMode,
    setFontSizeLevel,
  }
})
