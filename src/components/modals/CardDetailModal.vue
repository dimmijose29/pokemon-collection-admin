<script setup lang="ts">
import { computed } from 'vue'
import { X, TrendingUp, ExternalLink } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import Card3DViewer from '@/components/utils/Card3DViewer.vue'
import type { Card } from '@/types/card'
import type { Set } from '@/types/set'
import { getEnergyStyle, getCardTypeClass, getStageClass } from '@/utils/pokemon'

const props = defineProps<{
  modelValue: boolean
  card: Card | null
  set?: Set | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const router = useRouter()

function close() {
  emit('update:modelValue', false)
}

function goToSet() {
  const id = setInfo.value?.id
  if (!id) return
  close()
  router.push({ name: 'set-cards', params: { id } })
}

function goToSeries() {
  const sName = seriesName(setInfo.value?.series)
  if (!sName) return
  close()
  router.push({ name: 'sets', query: { series: sName } })
}

function cardName(card: Card): string {
  const en = card.translations?.find((t) => t.language?.code === 'en')
  const it = card.translations?.find((t) => t.language?.code === 'it')
  return en?.name ?? it?.name ?? card.translations?.[0]?.name ?? card.tcgdex_id
}

const name = computed(() => (props.card ? cardName(props.card) : ''))

const formattedPrice = computed(() => {
  const p = props.card?.price
  if (p == null) return null
  const n = typeof p === 'string' ? parseFloat(p) : p
  if (isNaN(n)) return null
  return n.toFixed(2)
})

// Set info: usa il set passato come prop, altrimenti fallback alla relazione nella carta
const setInfo = computed<{
  id?: number
  tcgdex_id?: string
  name: string
  logo_url?: string | null
  series?: { id?: number; name: string } | string | null
  release_date?: string | null
} | null>(() => props.set ?? props.card?.set ?? null)

// Helper per estrarre il nome della serie indipendentemente dal tipo (oggetto o stringa legacy)
function seriesName(s: { name: string } | string | null | undefined): string | null {
  if (!s) return null
  return typeof s === 'string' ? s : s.name
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-200"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue && card"
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="close" />

        <!-- Panel -->
        <Transition
          enter-active-class="transition-all duration-250 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          leave-active-class="transition-all duration-150 ease-in"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="modelValue"
            class="relative bg-base-100 rounded-3xl shadow-2xl z-10 w-full max-w-5xl max-h-[94vh] overflow-hidden flex flex-col"
          >
            <!-- Header espansione -->
            <div
              class="relative flex items-center justify-between px-6 py-4 border-b border-base-300 bg-base-200/60 shrink-0"
            >
              <!-- Info espansione -->
              <div class="flex items-center gap-3 min-w-0">
                <img
                  v-if="setInfo?.logo_url"
                  :src="setInfo.logo_url"
                  :alt="setInfo.name"
                  class="h-7 max-w-[7rem] object-contain opacity-90"
                  :class="setInfo.id ? 'cursor-pointer hover:opacity-100 transition-opacity' : ''"
                  @click="setInfo?.id && goToSet()"
                />
                <div v-if="setInfo" class="min-w-0">
                  <!-- Nome set cliccabile -->
                  <div
                    class="font-semibold text-sm text-base-content/80 truncate flex items-center gap-1"
                    :class="
                      setInfo.id ? 'cursor-pointer hover:text-secondary transition-colors' : ''
                    "
                    @click="setInfo.id && goToSet()"
                  >
                    {{ setInfo.name }}
                    <ExternalLink v-if="setInfo.id" class="w-3 h-3 opacity-40 shrink-0" />
                  </div>
                  <!-- Serie cliccabile + anno -->
                  <div class="text-xs text-base-content/40 flex items-center gap-1.5">
                    <span
                      v-if="seriesName(setInfo.series)"
                      :class="
                        seriesName(setInfo.series)
                          ? 'cursor-pointer hover:text-secondary transition-colors'
                          : ''
                      "
                      @click="goToSeries()"
                      >{{ seriesName(setInfo.series) }}</span
                    >
                    <span v-if="seriesName(setInfo.series) && setInfo.release_date">·</span>
                    <span v-if="setInfo.release_date">{{
                      setInfo.release_date.substring(0, 4)
                    }}</span>
                  </div>
                </div>
              </div>
              <button class="btn btn-ghost btn-sm btn-square shrink-0" @click="close">
                <X class="w-4 h-4" />
              </button>
            </div>

            <!-- Body scrollabile -->
            <div class="overflow-y-auto flex-1">
              <div class="p-6 flex flex-col md:flex-row gap-8">
                <!-- Colonna sinistra: carta 3D — larghezza fissa generosa -->
                <div class="shrink-0 flex flex-col items-center gap-4 md:w-72">
                  <Card3DViewer :image-url="card.image_url" :alt="name" max-width="280px" />

                  <!-- Prezzo sotto la carta (visibile solo su mobile) -->
                  <div class="md:hidden w-full">
                    <div
                      class="bg-base-200 rounded-2xl px-4 py-3 flex items-center justify-between"
                    >
                      <div class="flex items-center gap-2 text-sm text-base-content/60">
                        <TrendingUp class="w-4 h-4" />
                        Cardmarket
                      </div>
                      <span
                        class="font-bold text-xl font-mono"
                        :class="formattedPrice ? 'text-success' : 'text-base-content/30'"
                      >
                        {{ formattedPrice ? '€ ' + formattedPrice : '—' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Colonna destra: info -->
                <div class="flex-1 min-w-0 space-y-5">
                  <!-- Nome carta + codice -->
                  <div>
                    <h2 class="font-heading font-bold text-2xl text-base-content leading-tight">
                      {{ name }}
                    </h2>
                    <p class="text-base-content/40 text-sm font-mono mt-0.5">
                      #{{ card.local_id }} · {{ card.tcgdex_id }}
                    </p>
                  </div>

                  <!-- Prezzo (desktop) -->
                  <div
                    class="hidden md:flex bg-gradient-to-r from-success/10 to-base-200 rounded-2xl px-5 py-4 items-center justify-between border border-success/20"
                  >
                    <div class="flex items-center gap-2 text-base-content/60">
                      <TrendingUp class="w-4 h-4 text-success" />
                      <span class="text-sm">Prezzo Cardmarket</span>
                    </div>
                    <span
                      class="font-bold text-2xl font-mono"
                      :class="formattedPrice ? 'text-success' : 'text-base-content/30'"
                    >
                      {{ formattedPrice ? '€ ' + formattedPrice : '—' }}
                    </span>
                  </div>

                  <!-- Badge tipo + stage + energie -->
                  <div class="flex flex-wrap gap-2 items-center">
                    <span
                      v-if="card.card_type"
                      class="badge badge-sm font-medium"
                      :class="getCardTypeClass(card.card_type.name)"
                      >{{ card.card_type.name }}</span
                    >
                    <span
                      v-if="card.stage"
                      class="badge badge-sm"
                      :class="getStageClass(card.stage)"
                      >{{ card.stage }}</span
                    >
                    <span
                      v-for="e in card.energy_types"
                      :key="e"
                      class="badge badge-sm border"
                      :style="getEnergyStyle(e)"
                      >{{ e }}</span
                    >
                  </div>

                  <!-- Dettagli tabella -->
                  <div class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    <div v-if="card.rarity" class="flex flex-col gap-0.5">
                      <span class="text-base-content/40 text-xs uppercase tracking-wider"
                        >Rarità</span
                      >
                      <span class="font-medium">{{ card.rarity.name }}</span>
                    </div>
                    <div v-if="card.artist" class="flex flex-col gap-0.5">
                      <span class="text-base-content/40 text-xs uppercase tracking-wider"
                        >Artista</span
                      >
                      <span class="font-medium">{{ card.artist.name }}</span>
                    </div>
                    <div v-if="setInfo" class="flex flex-col gap-0.5">
                      <span class="text-base-content/40 text-xs uppercase tracking-wider"
                        >Espansione</span
                      >
                      <span
                        class="font-medium flex items-center gap-1"
                        :class="
                          setInfo.id ? 'cursor-pointer hover:text-secondary transition-colors' : ''
                        "
                        @click="setInfo?.id && goToSet()"
                      >
                        {{ setInfo.name }}
                        <ExternalLink v-if="setInfo.id" class="w-3 h-3 opacity-40" />
                      </span>
                    </div>
                    <div v-if="seriesName(setInfo?.series)" class="flex flex-col gap-0.5">
                      <span class="text-base-content/40 text-xs uppercase tracking-wider"
                        >Serie</span
                      >
                      <span
                        class="font-medium flex items-center gap-1 cursor-pointer hover:text-secondary transition-colors"
                        @click="goToSeries()"
                      >
                        {{ seriesName(setInfo?.series) }}
                        <ExternalLink class="w-3 h-3 opacity-40" />
                      </span>
                    </div>
                  </div>

                  <!-- Nomi nelle varie lingue -->
                  <div v-if="card.translations?.length" class="pt-1">
                    <p class="text-xs text-base-content/40 mb-2 uppercase tracking-wider">Nomi</p>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="t in card.translations"
                        :key="t.id"
                        class="text-xs bg-base-200 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5"
                      >
                        <span class="text-base-content/40 font-mono uppercase text-[10px]">{{
                          t.language?.code
                        }}</span>
                        <span class="font-medium">{{ t.name }}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
