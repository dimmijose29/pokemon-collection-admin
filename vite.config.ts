import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
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
    // Rende disponibili describe/it/expect senza import espliciti
    globals: true,
    // File eseguito prima di ogni suite: registra plugin globali (FormKit, ecc.)
    setupFiles: ['src/test/setup.ts'],
    // Cerca i test solo in src/__tests__ — esclude la cartella tests/ del template originale
    include: ['src/__tests__/**/*.test.ts'],
    // Resolve gli alias @/ come fa Vite in produzione
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
})
