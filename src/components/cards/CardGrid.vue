<script setup lang="ts">
import { ref, computed } from 'vue'
import { Eye, List, LayoutGrid, ImageOff } from 'lucide-vue-next'
import SortableHeader from '@/components/shared/SortableHeader.vue'
import type { SortState } from '@/components/shared/SortableHeader.vue'
import CardDetailModal from '@/components/modals/CardDetailModal.vue'
import type { Card } from '@/types/card'
import type { Set } from '@/types/set'
import { getEnergyClass, getCardTypeClass, getStageClass, getEnergyStyle } from '@/utils/pokemon'
import { cardName, formatPrice, setCode } from '@/utils/card'

const props = defineProps<{
  cards: Card[]
  loading?: boolean
  set?: Set | null
  hideToolbar?: boolean
  emptyMessage?: string
}>()

const emit = defineEmits<{
  'card-click': [card: Card]
}>()

type Layout = 'list' | 'grid'
const layout = ref<Layout>('grid')
const sort = ref<SortState | null>({ field: 'local_id', direction: 'asc' })

// --- Ordinamento ---
const sorted = computed(() => {
  if (!sort.value) return props.cards
  const { field, direction } = sort.value
  const mult = direction === 'asc' ? 1 : -1
  return [...props.cards].sort((a, b) => {
    if (field === 'local_id') {
      const aNum = parseInt(a.local_id)
      const bNum = parseInt(b.local_id)
      if (!isNaN(aNum) && !isNaN(bNum)) return (aNum - bNum) * mult
      return a.local_id.localeCompare(b.local_id) * mult
    }
    if (field === 'name') return cardName(a).localeCompare(cardName(b)) * mult
    if (field === 'rarity') return (a.rarity?.name ?? '').localeCompare(b.rarity?.name ?? '') * mult
    if (field === 'price') {
      const aP = a.price != null ? parseFloat(String(a.price)) : -1
      const bP = b.price != null ? parseFloat(String(b.price)) : -1
      return (aP - bP) * mult
    }
    return 0
  })
})

// --- Modale ---
const selectedCard = ref<Card | null>(null)
const detailOpen = ref(false)

function openCard(card: Card) {
  selectedCard.value = card
  detailOpen.value = true
  emit('card-click', card)
}
</script>

<template>
  <div>
    <!-- Toolbar layout (solo se non nascosta) -->
    <div
      v-if="!hideToolbar"
      class="flex items-center justify-between px-4 py-2.5 border-b border-base-300"
    >
      <span class="text-sm text-base-content/50">
        {{ sorted.length.toLocaleString('it-IT') }} {{ sorted.length === 1 ? 'carta' : 'carte' }}
      </span>
      <div class="join">
        <button
          class="join-item btn btn-xs"
          :class="layout === 'list' ? 'btn-secondary' : 'btn-ghost'"
          title="Vista lista"
          @click="layout = 'list'"
        >
          <List class="w-3.5 h-3.5" />
        </button>
        <button
          class="join-item btn btn-xs"
          :class="layout === 'grid' ? 'btn-secondary' : 'btn-ghost'"
          title="Vista griglia"
          @click="layout = 'grid'"
        >
          <LayoutGrid class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <span class="loading loading-spinner loading-xl text-secondary" />
    </div>

    <!-- Vuoto -->
    <div v-else-if="!sorted.length" class="text-center py-16 text-base-content/40 text-sm">
      {{ emptyMessage ?? 'Nessuna carta trovata.' }}
    </div>

    <!-- VISTA LISTA -->
    <template v-else-if="layout === 'list'">
      <div class="overflow-x-auto">
        <table class="table table-compact w-full">
          <thead class="bg-secondary/10 text-secondary text-md font-semibold">
            <tr>
              <SortableHeader
                field="local_id"
                label="#"
                :model-value="sort"
                class="w-14"
                @update:model-value="sort = $event"
              />
              <th class="w-16"></th>
              <SortableHeader
                field="name"
                label="Nome"
                :model-value="sort"
                @update:model-value="sort = $event"
              />
              <SortableHeader
                field="price"
                label="Prezzo"
                :model-value="sort"
                class="hidden md:table-cell w-28"
                @update:model-value="sort = $event"
              />
              <SortableHeader
                field="rarity"
                label="Rarità"
                :model-value="sort"
                class="hidden md:table-cell"
                @update:model-value="sort = $event"
              />
              <th class="hidden lg:table-cell">Tipo / Stage</th>
              <th class="hidden xl:table-cell">Artista</th>
              <th class="w-10"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="card in sorted" :key="card.id" class="hover">
              <td class="font-mono text-sm text-base-content/40">{{ card.local_id }}</td>
              <td>
                <img
                  v-if="card.image_url"
                  :src="card.image_url"
                  :alt="`Carta ${card.local_id}`"
                  class="h-12 object-contain rounded cursor-pointer hover:scale-110 transition-transform duration-150"
                  @click="openCard(card)"
                />
                <div v-else class="w-8 h-12 bg-base-200 rounded flex items-center justify-center">
                  <ImageOff class="w-4 h-4 text-base-content/20" />
                </div>
              </td>
              <td>
                <div class="font-medium">{{ cardName(card) }}</div>
                <div v-if="card.energy_types?.length" class="flex gap-1 mt-1 flex-wrap">
                  <span
                    v-for="t in card.energy_types"
                    :key="t"
                    class="badge badge-xs border"
                    :style="getEnergyStyle(t)"
                    >{{ t }}</span
                  >
                </div>
              </td>
              <td
                class="hidden md:table-cell text-sm font-mono"
                :class="card.price ? 'text-success' : 'text-base-content/30'"
              >
                {{ formatPrice(card.price) }}
              </td>
              <td class="hidden md:table-cell text-sm text-base-content/70">
                {{ card.rarity?.name ?? '—' }}
              </td>
              <td class="hidden lg:table-cell">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span
                    v-if="card.card_type"
                    class="badge badge-xs"
                    :class="getCardTypeClass(card.card_type.name)"
                    >{{ card.card_type.name }}</span
                  >
                  <span
                    v-if="card.stage"
                    class="badge badge-xs"
                    :class="getStageClass(card.stage)"
                    >{{ card.stage }}</span
                  >
                </div>
              </td>
              <td class="hidden xl:table-cell text-sm text-base-content/60">
                {{ card.artist?.name ?? '—' }}
              </td>
              <td>
                <button
                  class="btn btn-ghost btn-xs btn-square tooltip tooltip-top"
                  data-tip="Dettaglio"
                  @click="openCard(card)"
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
      <div
        class="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
      >
        <div
          v-for="card in sorted"
          :key="card.id"
          class="group cursor-pointer rounded-xl overflow-hidden bg-base-200 border border-base-300 hover:border-secondary/40 hover:shadow-lg transition-all duration-200"
          @click="openCard(card)"
        >
          <!-- Immagine carta -->
          <div class="relative aspect-[2.5/3.5] bg-base-300 overflow-hidden">
            <img
              v-if="card.image_url"
              :src="card.image_url"
              :alt="cardName(card)"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <ImageOff class="w-8 h-8 text-base-content/15" />
            </div>

            <!-- Overlay hover -->
            <div
              class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"
            />

            <!-- Set symbol (solo nella schermata globale, in alto a sinistra) -->
            <div v-if="!set && card.set?.symbol_url" class="absolute top-1.5 left-1.5">
              <img
                :src="card.set.symbol_url"
                :alt="card.set.name"
                class="h-4 w-4 object-contain opacity-80 drop-shadow"
              />
            </div>
          </div>

          <!-- Info carta -->
          <div class="px-2.5 pt-2 pb-2.5 space-y-1.5">
            <!-- Nome + numero collezione -->
            <div class="flex items-start justify-between gap-1">
              <p class="font-semibold text-xs leading-tight text-base-content line-clamp-2">
                {{ cardName(card) }}
              </p>
              <span class="text-[10px] font-mono text-base-content/35 shrink-0 mt-px">
                #{{ card.local_id }}
              </span>
            </div>

            <!-- Codice set + rarità -->
            <div class="flex items-center justify-between gap-1">
              <span
                class="text-[10px] font-mono font-medium text-base-content/40 uppercase tracking-wide truncate"
              >
                {{ setCode(card) }}
              </span>
              <span
                v-if="card.rarity"
                class="text-[10px] text-base-content/40 shrink-0 truncate max-w-[50%] text-right"
              >
                {{ card.rarity.name }}
              </span>
            </div>

            <!-- Prezzo (stile testo, non badge) -->
            <div class="flex items-center justify-between pt-0.5 border-t border-base-300">
              <span class="text-[10px] text-base-content/30 uppercase tracking-wide"
                >Cardmarket</span
              >
              <span
                class="font-mono font-bold text-xs"
                :class="card.price != null ? 'text-emerald-500' : 'text-base-content/20'"
              >
                {{ formatPrice(card.price) }}
              </span>
            </div>

            <!-- Tipo + Stage + Energia -->
            <div class="flex flex-wrap gap-1">
              <span
                v-if="card.card_type"
                class="badge badge-xs text-[9px] py-0.5"
                :class="getCardTypeClass(card.card_type.name)"
                >{{ card.card_type.name }}</span
              >
              <span
                v-if="card.stage"
                class="badge badge-xs text-[9px] py-0.5"
                :class="getStageClass(card.stage)"
                >{{ card.stage }}</span
              >
              <span
                v-for="t in card.energy_types?.slice(0, 2)"
                :key="t"
                class="badge badge-xs text-[9px] py-0.5 border"
                :style="getEnergyStyle(t)"
                >{{ t }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Modale dettaglio -->
    <CardDetailModal v-model="detailOpen" :card="selectedCard" :set="set" />
  </div>
</template>
