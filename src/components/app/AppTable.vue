<script setup lang="ts">
// Guscio delle tabelle: ricerca, filtri, aggiorna e conteggio; il contenuto arriva dallo slot.
import SearchInput from '@/components/shared/SearchInput.vue'
import { RefreshCw } from 'lucide-vue-next'

defineProps<{
  searchPlaceholder?: string
  total?: number
  refreshing?: boolean
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  refresh: []
}>()

const search = defineModel<string>('search', { default: '' })
</script>

<template>
  <div class="card bg-base-100 shadow-sm border border-base-300 overflow-hidden">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-base-300">
      <!-- Riga ricerca + refresh -->
      <div class="flex items-center gap-2 w-full">
        <div class="flex-1">
          <SearchInput v-model="search" :placeholder="searchPlaceholder ?? 'Cerca...'" />
        </div>

        <!-- Azioni (es. pulsante crea) -->
        <slot name="actions" />

        <button class="btn btn-sm btn-soft gap-2" :disabled="refreshing" @click="emit('refresh')">
          <RefreshCw class="w-4 h-4" :class="refreshing ? 'animate-spin' : ''" />
          <span class="hidden sm:inline">Aggiorna</span>
        </button>
      </div>

      <!-- Filtri aggiuntivi (opzionali) -->
      <slot name="filters" />

      <div class="flex-1" />

      <span v-if="total !== undefined" class="text-sm text-base-content/50">
        {{ total }} {{ total === 1 ? 'risultato' : 'risultati' }}
      </span>
    </div>

    <!-- Contenuto: di solito BaseDataTable -->
    <slot />
  </div>
</template>
