<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// Pokémon a tema "perso" — Snorlax, Psyduck, Magikarp, Zubat, Meowth
const ids = [143, 54, 129, 41, 52]
const id = ids[Math.floor(Math.random() * ids.length)]
const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
</script>

<template>
  <div class="min-h-screen bg-base-200 flex flex-col items-center justify-center px-4 text-center">
    <div v-motion-pop class="max-w-md">
      <img :src="sprite" :alt="`Pokémon #${id}`" class="w-52 h-52 mx-auto mb-6 drop-shadow-xl" />
      <h1 class="text-8xl font-heading font-bold text-primary mb-2">404</h1>
      <h2 class="text-2xl font-heading mb-3">Pagina non trovata!</h2>
      <p class="text-base-content/60 mb-8">
        Questo Pokémon sembra essersi perso...<br />
        La pagina che cerchi non esiste.
      </p>
      <div class="flex gap-3 justify-center">
        <button class="btn btn-secondary btn-lg" @click="router.back()">← Torna indietro</button>
        <button class="btn btn-ghost btn-lg" @click="router.push({ name: 'login' })">Home</button>
      </div>
    </div>
  </div>
</template>
