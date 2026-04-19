<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { Eye, RotateCcw, List, LayoutGrid } from 'lucide-vue-next'
import SortableHeader from '@/components/shared/SortableHeader.vue'
import FilterSelect from '@/components/shared/FilterSelect.vue'
import type { SortState } from '@/components/shared/SortableHeader.vue'
import CardDetailModal from '@/components/modals/CardDetailModal.vue'
import Cards from '@/api/cards'
import type { Card } from '@/types/card'
import type { Set } from '@/types/set'
import { getEnergyClass, getCardTypeClass, getStageClass } from '@/utils/pokemon'

const props = defineProps<{
  setId: number
  set: Set | null
}>()

type Layout = 'list' | 'grid'

const search = ref('')
const rarityFilter = ref<string[]>([])
const cardTypeFilter = ref<string[]>([])
const energyFilter = ref<string[]>([])
const sort = ref<SortState | null>({ field: 'local_id', direction: 'asc' })
const layout = ref<Layout>('list')
const selectedCard = ref<Card | null>(null)
const detailOpen = ref(false)

const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ['cards', props.setId],
  queryFn: () => Cards.get({ set_id: props.setId }),
  staleTime: Infinity,
  placeholderData: (prev) => prev,
})

const allCards = computed(() => data.value ?? [])

// Liste univoche per i filtri
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
  () => rarityFilter.value.length > 0 || cardTypeFilter.value.length > 0 || energyFilter.value.length > 0 || !!search.value,
)

function resetFilters() {
  search.value = ''
  rarityFilter.value = []
  cardTypeFilter.value = []
  energyFilter.value = []
}

function cardName(card: Card): string {
  const it = card.translations?.find((t) => t.language?.code === 'it')
  const en = card.translations?.find((t) => t.language?.code === 'en')
  return it?.name ?? en?.name ?? card.translations?.[0]?.name ?? card.tcgdex_id
}

// Filtro
const filtered = computed(() => {
  let list = allCards.value

  if (rarityFilter.value.length) list = list.filter((c) => c.rarity?.name && rarityFilter.value.includes(c.rarity.name))
  if (cardTypeFilter.value.length) list = list.filter((c) => c.card_type?.name && cardTypeFilter.value.includes(c.card_type.name))
  if (energyFilter.value.length) list = list.filter((c) => c.energy_types?.some((e) => energyFilter.value.includes(e)))

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

// Ordinamento
const sortedCards = computed(() => {
  if (!sort.value) return filtered.value
  const { field, direction } = sort.value
  const mult = direction === 'asc' ? 1 : -1

  return [...filtered.value].sort((a, b) => {
    if (field === 'local_id') {
      const aNum = parseInt(a.local_id)
      const bNum = parseInt(b.local_id)
      if (!isNaN(aNum) && !isNaN(bNum)) return (aNum - bNum) * mult
      return a.local_id.localeCompare(b.local_id) * mult
    }
    if (field === 'name') return cardName(a).localeCompare(cardName(b)) * mult
    if (field === 'rarity') {
      return (a.rarity?.name ?? '').localeCompare(b.rarity?.name ?? '') * mult
    }
    if (field === 'price') {
      const aP = a.price != null ? parseFloat(String(a.price)) : -1
      const bP = b.price != null ? parseFloat(String(b.price)) : -1
      return (aP - bP) * mult
    }
    return 0
  })
})

const total = computed(() => sortedCards.value.length)

function openDetail(card: Card) {
  selectedCard.value = card
  detailOpen.value = true
}

function formatPrice(price: number | string | null | undefined): string {
  if (price == null) return '—'
  const n = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(n)) return '—'
  return '€ ' + n.toFixed(2)
}
</script>

<template>
  <div class="card bg-base-100 shadow-sm border border-base-300 overflow-hidden">

    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-base-300">
      <!-- Ricerca -->
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <div class="flex-1">
          <FormKit
            type="text"
            prefix-icon="search"
            outer-class="!mb-0 max-w-full"
            input-class="outline-0"
            v-model="search"
            placeholder="Cerca per nome o codice..."
          />
        </div>

        <!-- Toggle layout -->
        <div class="join">
          <button
            class="join-item btn btn-sm"
            :class="layout === 'list' ? 'btn-secondary' : 'btn-ghost'"
            title="Vista lista"
            @click="layout = 'list'"
          >
            <List class="w-4 h-4" />
          </button>
          <button
            class="join-item btn btn-sm"
            :class="layout === 'grid' ? 'btn-secondary' : 'btn-ghost'"
            title="Vista griglia"
            @click="layout = 'grid'"
          >
            <LayoutGrid class="w-4 h-4" />
          </button>
        </div>

        <button
          class="btn btn-sm btn-soft gap-2"
          :disabled="isFetching"
          @click="refetch()"
        >
          <span class="hidden sm:inline">Aggiorna</span>
        </button>
      </div>

      <!-- Filtri -->
      <div class="flex flex-wrap items-center gap-2 w-full">
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
          class="btn btn-ghost btn-sm gap-1 text-base-content/50"
          @click="resetFilters"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          Ripristina filtri
        </button>

        <div class="flex-1" />
        <span class="text-sm text-base-content/50">
          {{ total }} {{ total === 1 ? 'risultato' : 'risultati' }}
        </span>
      </div>
    </div>

    <!-- VISTA LISTA -->
    <template v-if="layout === 'list'">
      <div v-if="isLoading" class="flex items-center justify-center py-16">
        <span class="loading loading-spinner loading-xl text-secondary" />
      </div>

      <div v-else-if="total === 0" class="text-center py-16 text-base-content/40 text-sm">
        Nessuna carta trovata.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="table table-compact w-full">
          <thead class="bg-secondary/10 text-secondary text-md font-semibold">
            <tr>
              <SortableHeader field="local_id" label="#" :model-value="sort" class="w-14" @update:model-value="sort = $event" />
              <th class="w-16"></th>
              <SortableHeader field="name" label="Nome" :model-value="sort" @update:model-value="sort = $event" />
              <SortableHeader field="price" label="Prezzo" :model-value="sort" class="hidden md:table-cell w-28" @update:model-value="sort = $event" />
              <SortableHeader field="rarity" label="Rarità" :model-value="sort" class="hidden md:table-cell" @update:model-value="sort = $event" />
              <th class="hidden lg:table-cell">Tipo / Stage</th>
              <th class="hidden xl:table-cell">Artista</th>
              <th class="w-10"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="card in sortedCards"
              :key="card.id"
              class="hover"
            >
              <!-- # -->
              <td class="font-mono text-sm text-base-content/40">{{ card.local_id }}</td>

              <!-- Immagine -->
              <td>
                <img
                  v-if="card.image_url"
                  :src="card.image_url"
                  :alt="`Carta ${card.local_id}`"
                  class="h-12 object-contain rounded cursor-pointer hover:scale-110 transition-transform duration-150"
                  @click="openDetail(card)"
                />
                <div v-else class="w-8 h-12 bg-base-200 rounded flex items-center justify-center">
                  <span class="text-base-content/20 text-xs">?</span>
                </div>
              </td>

              <!-- Nome + energie colorate -->
              <td>
                <div class="font-medium">{{ cardName(card) }}</div>
                <div v-if="card.energy_types?.length" class="flex gap-1 mt-1 flex-wrap">
                  <span
                    v-for="t in card.energy_types"
                    :key="t"
                    class="badge badge-xs"
                    :class="getEnergyClass(t)"
                  >{{ t }}</span>
                </div>
              </td>

              <!-- Prezzo -->
              <td class="hidden md:table-cell text-sm font-mono" :class="card.price ? 'text-success' : 'text-base-content/30'">
                {{ formatPrice(card.price) }}
              </td>

              <!-- Rarità -->
              <td class="hidden md:table-cell text-sm text-base-content/70">{{ card.rarity?.name ?? '—' }}</td>

              <!-- Tipo + Stage affiancati -->
              <td class="hidden lg:table-cell">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span
                    v-if="card.card_type"
                    class="badge badge-xs"
                    :class="getCardTypeClass(card.card_type.name)"
                  >{{ card.card_type.name }}</span>
                  <span
                    v-if="card.stage"
                    class="badge badge-xs"
                    :class="getStageClass(card.stage)"
                  >{{ card.stage }}</span>
                </div>
              </td>

              <!-- Artista -->
              <td class="hidden xl:table-cell text-sm text-base-content/60">{{ card.artist?.name ?? '—' }}</td>

              <!-- Azioni -->
              <td>
                <button
                  class="btn btn-ghost btn-xs btn-square tooltip tooltip-top"
                  data-tip="Dettaglio"
                  @click="openDetail(card)"
                >
                  <Eye class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- VISTA GRIGLIA -->
    <template v-else>
      <div v-if="isLoading" class="flex items-center justify-center py-16">
        <span class="loading loading-spinner loading-xl text-secondary" />
      </div>

      <div v-else-if="total === 0" class="text-center py-16 text-base-content/40 text-sm">
        Nessuna carta trovata.
      </div>

      <div v-else class="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <div
          v-for="card in sortedCards"
          :key="card.id"
          class="group cursor-pointer flex flex-col"
          @click="openDetail(card)"
        >
          <!-- Immagine carta -->
          <div class="relative rounded-xl overflow-hidden bg-base-200 aspect-[2.5/3.5] flex items-center justify-center transition-transform duration-200 group-hover:scale-105 group-hover:shadow-xl">
            <img
              v-if="card.image_url"
              :src="card.image_url"
              :alt="cardName(card)"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-base-content/20 text-xs">?</span>
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-xl" />
          </div>

          <!-- Info sotto -->
          <div class="mt-2 px-0.5">
            <div class="font-medium text-sm truncate">{{ cardName(card) }}</div>
            <div class="flex items-center justify-between mt-0.5 gap-1">
              <span class="text-base-content/40 text-xs font-mono">#{{ card.local_id }}</span>
              <span
                class="text-xs font-mono font-semibold shrink-0"
                :class="card.price ? 'text-success' : 'text-base-content/25'"
              >
                {{ formatPrice(card.price) }}
              </span>
            </div>
            <!-- Tipo + Stage -->
            <div class="flex items-center gap-1 mt-1 flex-wrap">
              <span
                v-if="card.card_type"
                class="badge badge-xs"
                :class="getCardTypeClass(card.card_type.name)"
              >{{ card.card_type.name }}</span>
              <span
                v-if="card.stage"
                class="badge badge-xs"
                :class="getStageClass(card.stage)"
              >{{ card.stage }}</span>
            </div>
            <div v-if="card.rarity?.name" class="text-base-content/40 text-xs truncate mt-0.5">
              {{ card.rarity.name }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>

  <CardDetailModal v-model="detailOpen" :card="selectedCard" :set="set" />
</template>
