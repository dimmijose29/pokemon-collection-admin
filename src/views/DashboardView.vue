<script setup lang="ts">
const stats = [
  { label: 'Utenti registrati', value: '—', icon: '👤' },
  { label: 'Vetrine attive', value: '—', icon: '🏪' },
  { label: 'Carte catalogate', value: '—', icon: '🃏' },
  { label: 'Prodotti catalogati', value: '—', icon: '📦' },
]
</script>

<template>
  <div>
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="card bg-base-100 shadow-sm border border-base-300"
      >
        <div class="card-body p-5">
          <div class="flex items-center justify-between">
            <span class="text-2xl">{{ stat.icon }}</span>
            <span class="text-2xl font-bold font-heading text-base-content">{{ stat.value }}</span>
          </div>
          <p class="text-sm text-base-content/60 mt-1">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body">
        <h2 class="card-title text-base">Attività recente</h2>
        <p class="text-sm text-base-content/50">Nessun dato disponibile.</p>
      </div>
    </div>
  </div>
</template>