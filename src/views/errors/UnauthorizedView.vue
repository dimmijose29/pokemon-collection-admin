<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { logout } = useAuth()

// Un utente loggato ma senza permessi va prima disconnesso, altrimenti il login lo rimanda qui
async function goToLogin() {
  await logout()
  router.push({ name: 'login' })
}

// Pokémon a tema "accesso negato" — Gengar, Spiritomb, Sableye, Umbreon, Haunter
const ids = [94, 442, 302, 197, 93]
const id = ids[Math.floor(Math.random() * ids.length)]
const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
</script>

<template>
  <div class="min-h-screen bg-base-200 flex flex-col items-center justify-center px-4 text-center">
    <div v-motion-pop class="max-w-md">
      <img :src="sprite" :alt="`Pokémon #${id}`" class="w-52 h-52 mx-auto mb-6 drop-shadow-xl" />
      <h1 class="text-8xl font-heading font-bold text-error mb-2">403</h1>
      <h2 class="text-2xl font-heading mb-3">Accesso negato!</h2>
      <p class="text-base-content/60 mb-8">
        Non hai i permessi per visualizzare questa pagina.<br />
        Effettua il login o contatta un amministratore.
      </p>
      <div class="flex gap-3 justify-center">
        <button class="btn btn-secondary btn-lg" @click="goToLogin">
          Vai al login
        </button>
        <button class="btn btn-ghost btn-lg" @click="router.back()">← Torna indietro</button>
      </div>
    </div>
  </div>
</template>
