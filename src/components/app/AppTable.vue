<script setup lang="ts">
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  searchPlaceholder?: string
  total?: number
  loading?: boolean
  refreshing?: boolean
  currentPage?: number
  totalPages?: number
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:currentPage': [page: number]
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
          <FormKit
            type="text"
            prefix-icon="search"
            outer-class="!mb-0 max-w-full"
            input-class="outline-0"
            v-model="search"
            :placeholder="searchPlaceholder ?? 'Cerca...'"
          />
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

    <!-- Tabella -->
    <div class="overflow-x-auto">
      <table class="table table-compact w-full">
        <thead class="bg-secondary/10 text-secondary text-md font-semibold">
          <slot name="head" />
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="99" class="text-center py-12">
              <span class="loading loading-spinner loading-xl text-secondary" />
            </td>
          </tr>

          <tr v-else-if="!loading && total === 0">
            <td colspan="99" class="text-center py-12 text-base-content/40 text-sm">
              Nessun risultato trovato.
            </td>
          </tr>

          <slot v-else name="body" />
        </tbody>
      </table>
    </div>

    <!-- Paginazione -->
    <div
      v-if="totalPages && totalPages > 1"
      class="flex items-center justify-between px-4 py-3 border-t border-base-300"
    >
      <span class="text-sm text-base-content/50">
        Pagina {{ currentPage }} di {{ totalPages }}
      </span>
      <div class="join">
        <button
          class="join-item btn btn-sm btn-ghost"
          :disabled="currentPage === 1"
          @click="emit('update:currentPage', (currentPage ?? 1) - 1)"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>
        <button
          v-for="p in totalPages"
          :key="p"
          class="join-item btn btn-sm"
          :class="p === currentPage ? 'btn-active' : 'btn-ghost'"
          @click="emit('update:currentPage', p)"
        >
          {{ p }}
        </button>
        <button
          class="join-item btn btn-sm btn-ghost"
          :disabled="currentPage === totalPages"
          @click="emit('update:currentPage', (currentPage ?? 1) + 1)"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
