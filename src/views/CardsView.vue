<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { Search, X, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import AppPage from '@/layouts/AppPage.vue'
import CardGrid from '@/components/cards/CardGrid.vue'
import FilterSelect from '@/components/shared/FilterSelect.vue'
import Cards, { type CardSearchParams } from '@/api/cards'
import SeriesApi from '@/api/series'
import Sets from '@/api/sets'
import { getCardTypeClass, getEnergyStyle } from '@/utils/pokemon'

// --- Filtri (valori form) ---
const fName       = ref('')
const fSeriesId   = ref<number | null>(null)
const fSetId      = ref<number | null>(null)
const fRarityId   = ref<number | null>(null)
const fCardTypeId = ref<number | null>(null)
const fStage      = ref<string | null>(null)
const fEnergyType = ref<string | null>(null)
const fHasPrice   = ref(false)

// --- Filtri attivi (applicati dopo "Cerca") ---
const activeParams = ref<CardSearchParams | null>(null)
const page         = ref(1)
const filtersOpen  = ref(true)

// Reset pagina se i parametri cambiano
watch(activeParams, () => { page.value = 1 })

const hasActiveFilters = computed(() =>
  !!fName.value || !!fSeriesId.value || !!fSetId.value || !!fRarityId.value ||
  !!fCardTypeId.value || !!fStage.value || !!fEnergyType.value || fHasPrice.value
)

const activeFilterCount = computed(() =>
  [fName.value, fSeriesId.value, fSetId.value, fRarityId.value,
   fCardTypeId.value, fStage.value, fEnergyType.value, fHasPrice.value ? 1 : 0]
    .filter(Boolean).length
)

// Reset set quando cambia serie
watch(fSeriesId, () => { fSetId.value = null })

// --- Cerca ---
function cerca() {
  activeParams.value = {
    name:         fName.value || null,
    series_id:    fSeriesId.value,
    set_id:       fSetId.value,
    rarity_id:    fRarityId.value,
    card_type_id: fCardTypeId.value,
    stage:        fStage.value,
    energy_type:  fEnergyType.value,
    has_price:    fHasPrice.value || undefined,
  }
}

function resetFilters() {
  fName.value = ''
  fSeriesId.value = null
  fSetId.value = null
  fRarityId.value = null
  fCardTypeId.value = null
  fStage.value = null
  fEnergyType.value = null
  fHasPrice.value = false
  activeParams.value = null
  page.value = 1
}

// --- Query dati filtro ---
const { data: seriesList } = useQuery({
  queryKey: ['series'],
  queryFn: () => SeriesApi.get(),
  staleTime: Infinity,
})

const { data: setsList } = useQuery({
  queryKey: ['sets'],
  queryFn: () => Sets.get(),
  staleTime: Infinity,
})

const filteredSets = computed(() => {
  if (!setsList.value) return []
  const active = setsList.value.filter((s) => !s.deleted_at)
  if (!fSeriesId.value) return active
  return active.filter((s) => s.series?.id === fSeriesId.value)
})

// Rarità e tipi: estratti dai dati series/set già caricati — oppure hardcoded
const ENERGY_TYPES = [
  'Grass', 'Fire', 'Water', 'Lightning', 'Psychic',
  'Fighting', 'Darkness', 'Metal', 'Dragon', 'Colorless',
]

const CARD_TYPES = [
  { id: 1, name: 'Pokémon' },
  { id: 2, name: 'Trainer' },
  { id: 3, name: 'Energy' },
]

const STAGES = ['Basic', 'Stage 1', 'Stage 2', 'V', 'VMAX', 'VSTAR', 'GX', 'EX']

// Opzioni per FilterSelect (solo stringhe)
const seriesOptions = computed(() => seriesList.value?.map((s) => s.name) ?? [])
const setOptions    = computed(() => filteredSets.value.map((s) => s.name))

// Valori selezionati come stringa (per FilterSelect)
const selectedSeriesName = computed({
  get: () => fSeriesId.value ? (seriesList.value?.find((s) => s.id === fSeriesId.value)?.name ?? '') : '',
  set: (name: string) => {
    fSeriesId.value = seriesList.value?.find((s) => s.name === name)?.id ?? null
  },
})
const selectedSetName = computed({
  get: () => fSetId.value ? (filteredSets.value.find((s) => s.id === fSetId.value)?.name ?? '') : '',
  set: (name: string) => {
    fSetId.value = filteredSets.value.find((s) => s.name === name)?.id ?? null
  },
})

// --- Query carte (paginata, si attiva solo dopo "Cerca") ---
const searchQueryKey = computed(() => ['cards-search', activeParams.value, page.value])

const { data: result, isLoading, isFetching } = useQuery({
  queryKey: searchQueryKey,
  queryFn: () => Cards.search({ ...activeParams.value!, page: page.value, per_page: 48 }),
  staleTime: 1000 * 60 * 2,
  enabled: computed(() => activeParams.value !== null),
  placeholderData: (prev) => prev,
})

const cards = computed(() => result.value?.data ?? [])
const meta  = computed(() => result.value?.meta)
const hasSearched = computed(() => activeParams.value !== null)
</script>

<template>
  <AppPage>

    <!-- Pannello filtri -->
    <div class="card bg-base-100 border border-base-300 shadow-sm">
      <!-- Header filtri cliccabile -->
      <div
        class="flex items-center justify-between px-5 py-3.5 cursor-pointer select-none"
        @click="filtersOpen = !filtersOpen"
      >
        <div class="flex items-center gap-2">
          <SlidersHorizontal class="w-4 h-4 text-base-content/50" />
          <span class="font-semibold text-sm text-base-content/80">Filtri di ricerca</span>
          <span v-if="activeFilterCount > 0" class="badge badge-secondary badge-sm">{{ activeFilterCount }}</span>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-if="hasActiveFilters || hasSearched"
            class="btn btn-ghost btn-xs gap-1 text-base-content/40"
            @click.stop="resetFilters"
          >
            <X class="w-3 h-3" /> Reset
          </button>
          <ChevronLeft
            class="w-4 h-4 text-base-content/40 transition-transform duration-200"
            :class="filtersOpen ? '-rotate-90' : 'rotate-0'"
          />
        </div>
      </div>

      <!-- Corpo filtri -->
      <div v-show="filtersOpen" class="border-t border-base-300 p-5 space-y-4">

        <!-- Riga 1: nome + serie + set -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FormKit
            v-model="fName"
            type="text"
            prefix-icon="search"
            outer-class="!mb-0"
            input-class="outline-0"
            placeholder="Cerca per nome..."
            @keydown.enter="cerca"
          />
          <div class="flex flex-col gap-1">
            <label class="text-xs text-base-content/50 px-1">Serie</label>
            <FilterSelect
              v-model="selectedSeriesName"
              :options="seriesOptions"
              placeholder="Tutte le serie"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs text-base-content/50 px-1">Set</label>
            <FilterSelect
              v-model="selectedSetName"
              :options="setOptions"
              placeholder="Tutti i set"
            />
          </div>
        </div>

        <!-- Riga 2: stage + prezzo -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-xs text-base-content/50 px-1">Stage</label>
            <FilterSelect
              v-model="fStage"
              :options="STAGES"
              placeholder="Tutti gli stage"
            />
          </div>
          <div class="sm:col-span-2 flex items-end">
            <FormKit
              v-model="fHasPrice"
              type="checkbox"
              label="Solo carte con prezzo Cardmarket"
              outer-class="!mb-0"
            />
          </div>
        </div>

        <!-- Tipo carta (pill toggle) -->
        <div class="flex flex-wrap gap-2 items-center">
          <span class="text-xs text-base-content/40 uppercase tracking-wider w-14 shrink-0">Tipo</span>
          <button
            v-for="ct in CARD_TYPES"
            :key="ct.id"
            type="button"
            class="badge badge-md cursor-pointer transition-all duration-150"
            :class="[
              getCardTypeClass(ct.name),
              fCardTypeId === ct.id
                ? 'opacity-100 ring-2 ring-offset-2 ring-current'
                : 'opacity-40 hover:opacity-70',
            ]"
            @click="fCardTypeId = fCardTypeId === ct.id ? null : ct.id"
          >{{ ct.name }}</button>
        </div>

        <!-- Energia (pill toggle) -->
        <div class="flex flex-wrap gap-2 items-center">
          <span class="text-xs text-base-content/40 uppercase tracking-wider w-14 shrink-0">Energia</span>
          <button
            v-for="e in ENERGY_TYPES"
            :key="e"
            type="button"
            class="badge badge-md cursor-pointer border transition-all duration-150"
            :style="getEnergyStyle(e)"
            :class="fEnergyType === e ? 'opacity-100 ring-2 ring-offset-1 ring-current' : 'opacity-50 hover:opacity-80'"
            @click="fEnergyType = fEnergyType === e ? null : e"
          >{{ e }}</button>
        </div>

        <!-- Azioni -->
        <div class="flex items-center gap-3 pt-1">
          <button class="btn btn-secondary gap-2" @click="cerca">
            <Search class="w-4 h-4" />
            Cerca
          </button>
          <button v-if="hasActiveFilters" class="btn btn-ghost gap-1.5 text-base-content/50" @click="resetFilters">
            <X class="w-3.5 h-3.5" /> Reset filtri
          </button>
        </div>
      </div>
    </div>

    <!-- Risultati -->
    <template v-if="hasSearched">
      <!-- Header risultati + paginazione top -->
      <div class="flex items-center justify-between min-h-8">
        <div class="flex items-center gap-2">
          <span v-if="isFetching" class="loading loading-spinner loading-xs text-secondary" />
          <span class="text-sm text-base-content/50">
            <template v-if="meta && !isLoading">
              <span class="font-semibold text-base-content">{{ meta.total.toLocaleString('it-IT') }}</span> carte trovate
            </template>
            <template v-else-if="isLoading">Ricerca in corso...</template>
          </span>
        </div>
        <div v-if="meta && meta.last_page > 1" class="join">
          <button class="join-item btn btn-sm btn-ghost" :disabled="page === 1" @click="page--">
            <ChevronLeft class="w-4 h-4" />
          </button>
          <span class="join-item btn btn-sm btn-ghost no-animation pointer-events-none">
            {{ page }} / {{ meta.last_page }}
          </span>
          <button class="join-item btn btn-sm btn-ghost" :disabled="page === meta.last_page" @click="page++">
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Card di risultati con CardGrid -->
      <div class="card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
        <CardGrid
          :cards="cards"
          :loading="isLoading"
          empty-message="Nessuna carta corrisponde ai filtri selezionati."
        />
      </div>

      <!-- Paginazione bottom -->
      <div v-if="meta && meta.last_page > 1 && cards.length" class="flex justify-center pt-1">
        <div class="join">
          <button class="join-item btn btn-sm" :disabled="page === 1" @click="page = 1">«</button>
          <button class="join-item btn btn-sm" :disabled="page === 1" @click="page--">
            <ChevronLeft class="w-4 h-4" />
          </button>
          <template v-for="p in meta.last_page" :key="p">
            <button
              v-if="Math.abs(p - page) <= 2 || p === 1 || p === meta.last_page"
              class="join-item btn btn-sm"
              :class="p === page ? 'btn-secondary' : 'btn-ghost'"
              @click="page = p"
            >{{ p }}</button>
            <span
              v-else-if="Math.abs(p - page) === 3"
              class="join-item btn btn-sm btn-ghost no-animation pointer-events-none"
            >…</span>
          </template>
          <button class="join-item btn btn-sm" :disabled="page === meta.last_page" @click="page++">
            <ChevronRight class="w-4 h-4" />
          </button>
          <button class="join-item btn btn-sm" :disabled="page === meta.last_page" @click="page = meta.last_page">»</button>
        </div>
      </div>
    </template>

    <!-- Empty state iniziale -->
    <div v-else class="flex flex-col items-center justify-center py-24 text-center">
      <div class="relative mb-6 select-none">
        <div class="w-20 h-28 bg-base-200 rounded-2xl rotate-6 absolute -top-1 -right-4 opacity-40" />
        <div class="w-20 h-28 bg-base-200 rounded-2xl -rotate-3 absolute -top-1 -left-3 opacity-60" />
        <div class="w-20 h-28 bg-secondary/10 border border-secondary/20 rounded-2xl relative flex items-center justify-center">
          <Search class="w-8 h-8 text-secondary/40" />
        </div>
      </div>
      <p class="font-heading font-bold text-xl text-base-content/50 mt-3">Cerca una carta</p>
      <p class="text-sm text-base-content/30 mt-1.5 max-w-xs">
        Imposta i filtri e premi <strong>Cerca</strong> per sfogliare le carte del catalogo.
      </p>
    </div>

  </AppPage>
</template>
