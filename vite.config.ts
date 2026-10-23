import { fileURLToPath, URL } from 'node:url'

// defineConfig di vitest/config: estende quello di Vite con la chiave `test`
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    // Simula un ambiente browser (window, document, ecc.)
    environment: 'jsdom',
    // Fuso orario fisso: i test sulle date danno lo stesso risultato su ogni macchina
    env: { TZ: 'Europe/Rome' },
    // Rende disponibili describe/it/expect senza import espliciti
    globals: true,
    // File eseguito prima di ogni suite: registra plugin globali (FormKit, ecc.)
    setupFiles: ['src/test/setup.ts'],
    // Cerca i test solo in src/__tests__ — esclude la cartella tests/ del template originale
    include: ['src/__tests__/**/*.test.ts'],
    // Gli alias @/ arrivano da `resolve` qui sopra: Vitest usa la stessa config
  },
})
