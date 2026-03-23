<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300"
  >
    <!-- Logo o titolo opzionale in alto -->
    <div class="absolute top-8 left-1/2 transform -translate-x-1/2">
      <h1 class="text-4xl font-heading text-primary tracking-wide">Pokémon Collection</h1>
    </div>

    <!-- Contenuto centrato (la pagina login/2fa/recupero) -->
    <div class="w-full max-w-lg px-6">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
/* Gradiente di sfondo leggero ispirato a Pokémon */
.bg-gradient-to-br {
  background: linear-gradient(to bottom right, theme('colors.base-200'), theme('colors.base-300'));
}
</style>
