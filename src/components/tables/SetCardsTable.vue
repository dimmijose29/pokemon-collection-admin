<script setup lang="ts">
import SearchInput from '@/components/shared/SearchInput.vue'
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { RotateCcw } from 'lucide-vue-next'
import FilterSelect from '@/components/shared/FilterSelect.vue'
import CardGrid from '@/components/cards/CardGrid.vue'
import Cards from '@/api/cards'
import type { Card } from '@/types/card'
import type { Set } from '@/types/set'

const props = defineProps<{
  setId: number
  set: Set | null
}>()

const search = ref('')
const rarityFilter = ref<string[]>([])
const cardTypeFilter = ref<string[]>([])
const energyFilter = ref<string[]>([])

const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ['cards', computed(() => props.setId)],
  queryFn: () => Cards.get({ set_id: props.setId }),
  staleTime: Infinity,
  placeholderData: (prev) => prev,
})

const allCards = computed(() => data.value ?? [])

const rarities = computed(() => {
  const s = new Set(allCards.value.map((c) => c.rarity?.name).filter(Boolean) as string[])
  return [...s].sort()
})
const cardTypes = computed(() => {
  const s = new Set(allCards.value.map((c) => c.card_type?.name).filter(Boolean) as string[])
  return [...s].sort()
})
const energyTypes = computed(() => {
  const all = allCards.value.flatMap((c) => c.energy_types ?? [])
  return [...new Set(all)].sort()
})

const hasActiveFilters = computed(
  () =>
    rarityFilter.value.length > 0 ||
    cardTypeFilter.value.length > 0 ||
    energyFilter.value.length > 0 ||
    !!search.value,
)

function resetFilters() {
  search.value = ''
  rarityFilter.value = []
  cardTypeFilter.value = []
  energyFilter.value = []
}

function cardName(card: Card): string {
  const en = card.translations?.find((t) => t.language?.code === 'en')
  const it = card.translations?.find((t) => t.language?.code === 'it')
  return en?.name ?? it?.name ?? card.translations?.[0]?.name ?? card.tcgdex_id
}

const filtered = computed(() => {
  let list = allCards.value
  if (rarityFilter.value.length)
    list = list.filter((c) => c.rarity?.name && rarityFilter.value.includes(c.rarity.name))
  if (cardTypeFilter.value.length)
    list = list.filter((c) => c.card_type?.name && cardTypeFilter.value.includes(c.card_type.name))
  if (energyFilter.value.length)
    list = list.filter((c) => c.energy_types?.some((e) => energyFilter.value.includes(e)))
  if (search.value) {
    const q = search.value.trim().toLowerCase()
    list = list.filter(
      (c) =>
        cardName(c).toLowerCase().includes(q) ||
        c.local_id.toLowerCase().includes(q) ||
        c.tcgdex_id.toLowerCase().includes(q),
    )
  }
  return list
})
</script>

<template>
  <div class="card bg-base-100 shadow-sm border border-base-300 overflow-hidden">
    <!-- Ricerca -->
    <div class="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-base-300">
      <div class="flex-1 min-w-0">
        <SearchInput v-model="search" placeholder="Cerca per nome o codice..." />
      </div>
      <button class="btn btn-sm btn-soft gap-2" :disabled="isFetching" @click="refetch()">
        <RotateCcw class="w-3.5 h-3.5" :class="isFetching ? 'animate-spin' : ''" />
        <span class="hidden sm:inline">Aggiorna</span>
      </button>
    </div>

    <!-- Filtri -->
    <div
      class="flex flex-wrap items-center gap-2 px-4 py-2.5 border-b border-base-300 bg-base-200/30"
    >
      <FilterSelect
        v-model="rarityFilter"
        :options="rarities"
        placeholder="Tutte le rarità"
        multiple
      />
      <FilterSelect
        v-model="cardTypeFilter"
        :options="cardTypes"
        placeholder="Tutti i tipi"
        multiple
      />
      <FilterSelect
        v-model="energyFilter"
        :options="energyTypes"
        placeholder="Tutte le energie"
        multiple
      />
      <button
        v-if="hasActiveFilters"
        class="btn btn-ghost btn-sm gap-1.5 text-base-content/50"
        @click="resetFilters"
      >
        <RotateCcw class="w-3.5 h-3.5" /> Ripristina
      </button>
      <div class="flex-1" />
      <span class="text-sm text-base-content/50">{{ filtered.length }} carte</span>
    </div>

    <!-- Griglia / Lista (componente condiviso) -->
    <CardGrid :cards="filtered" :loading="isLoading" :set="set" />
  </div>
</template>
