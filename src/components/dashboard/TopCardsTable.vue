<script setup lang="ts">
import { ref } from 'vue'
import { Trophy } from 'lucide-vue-next'
import CardDetailModal from '@/components/modals/CardDetailModal.vue'
import type { StatsTopCard } from '@/types/stats'
import type { Card } from '@/types/card'
import Cards from '@/api/cards'

defineProps<{
  cards: StatsTopCard[]
}>()

function hideOnError(e: Event) {
  ;(e.target as HTMLImageElement).style.display = 'none'
}

// Modale dettaglio carta — carica il Card completo dall'API al click
const detailOpen    = ref(false)
const selectedCard  = ref<Card | null>(null)
const loadingCardId = ref<number | null>(null)

async function openCard(card: StatsTopCard) {
  loadingCardId.value = card.id
  try {
    selectedCard.value = await Cards.getById(card.id)
    detailOpen.value = true
  } finally {
    loadingCardId.value = null
  }
}
</script>

<template>
  <div class="card bg-base-100 border border-base-300 shadow-sm">
    <div class="card-body p-5">
      <div class="flex items-center gap-1.5 mb-4">
        <Trophy class="w-4 h-4 text-warning shrink-0" />
        <h3 class="font-semibold text-sm text-base-content/70">Top 10 carte più costose</h3>
      </div>

      <div class="overflow-x-auto">
        <table class="table table-sm w-full">
          <thead>
            <tr class="text-base-content/40 text-xs uppercase tracking-wider border-b border-base-200">
              <th class="w-8 font-normal pb-2">#</th>
              <th class="w-12 font-normal pb-2"></th>
              <th class="font-normal pb-2">Carta</th>
              <th class="font-normal pb-2 hidden sm:table-cell">Espansione</th>
              <th class="font-normal pb-2 text-right">Prezzo</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(card, i) in cards"
              :key="card.id"
              class="hover border-b border-base-200/50 last:border-0 cursor-pointer"
              :class="loadingCardId === card.id ? 'opacity-60' : ''"
              @click="openCard(card)"
            >
              <td class="text-base-content/25 font-mono text-xs w-8">{{ i + 1 }}</td>
              <td class="p-1.5 w-12">
                <div class="w-9 h-12 rounded-md overflow-hidden bg-base-200 shrink-0 flex items-center justify-center">
                  <span v-if="loadingCardId === card.id" class="loading loading-spinner loading-xs text-secondary" />
                  <img
                    v-else-if="card.image_url"
                    :src="card.image_url + '/low.webp'"
                    :alt="card.name"
                    class="w-full h-full object-cover"
                    @error="hideOnError"
                  />
                  <span v-else class="text-base-content/20 text-xs">?</span>
                </div>
              </td>
              <td>
                <div class="font-medium text-sm leading-tight">{{ card.name }}</div>
                <div class="text-xs text-base-content/35 font-mono">#{{ card.local_id }}</div>
              </td>
              <td class="hidden sm:table-cell">
                <div class="flex items-center gap-2">
                  <img
                    v-if="card.set_logo_url"
                    :src="card.set_logo_url"
                    :alt="card.set_name"
                    class="h-5 max-w-[4.5rem] object-contain opacity-75"
                    @error="hideOnError"
                  />
                  <span class="text-xs text-base-content/50 truncate max-w-[10rem]">{{ card.set_name }}</span>
                </div>
              </td>
              <td class="text-right">
                <span class="font-bold font-mono text-success text-sm">€ {{ card.price.toFixed(2) }}</span>
              </td>
            </tr>
            <tr v-if="!cards.length">
              <td colspan="5" class="text-center text-sm text-base-content/40 py-8">
                Nessun prezzo disponibile
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <CardDetailModal v-model="detailOpen" :card="selectedCard" />
</template>
