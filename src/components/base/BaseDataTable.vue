<script setup lang="ts" generic="T extends { id: number }">
import { computed, ref } from 'vue'
import {
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
} from '@tanstack/vue-table'
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { DataColumn } from './dataTable'

// Tabella su TanStack Table: ordinamento e paginazione lato client sulle righe ricevute.
// Le celle si personalizzano con lo slot `cell-<id>` (riceve { row }).
const props = withDefaults(
  defineProps<{
    rows: T[]
    columns: DataColumn<T>[]
    loading?: boolean
    pageSize?: number
    emptyText?: string
  }>(),
  { loading: false, pageSize: 25, emptyText: 'Nessun risultato trovato.' },
)

defineSlots<Record<`cell-${string}`, (props: { row: T }) => unknown>>()

const sorting = ref<SortingState>([])

const columnDefs = computed<ColumnDef<T>[]>(() =>
  props.columns.map((col) => ({
    id: col.id,
    header: col.label ?? '',
    // null → undefined: sortUndefined 'last' mette in fondo solo gli undefined
    accessorFn: (row: T) =>
      (col.accessor ? col.accessor(row) : (row as Record<string, unknown>)[col.id]) ?? undefined,
    enableSorting: col.sortable ?? !!col.label,
    sortUndefined: 'last',
    ...(col.sortingFn
      ? { sortingFn: (a, b) => col.sortingFn!(a.original, b.original) }
      : { sortingFn: 'auto' }),
  })),
)

const table = useVueTable({
  get data() {
    return props.rows
  },
  get columns() {
    return columnDefs.value
  },
  state: {
    get sorting() {
      return sorting.value
    },
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
  },
  initialState: { pagination: { pageIndex: 0, pageSize: props.pageSize } },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})

const columnClass = (id: string) => props.columns.find((c) => c.id === id)?.class ?? ''

const pageCount = computed(() => table.getPageCount())
const pageIndex = computed(() => table.getState().pagination.pageIndex)

// Al massimo 5 numeri di pagina attorno a quella corrente
const visiblePages = computed(() => {
  const count = pageCount.value
  const start = Math.max(0, Math.min(pageIndex.value - 2, count - 5))
  return Array.from({ length: Math.min(5, count) }, (_, i) => start + i)
})
</script>

<template>
  <div class="overflow-x-auto">
    <table class="table table-compact w-full">
      <thead class="bg-secondary/10 text-secondary text-md font-semibold">
        <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            :class="columnClass(header.column.id)"
            :aria-sort="
              header.column.getIsSorted() === 'asc'
                ? 'ascending'
                : header.column.getIsSorted() === 'desc'
                  ? 'descending'
                  : undefined
            "
          >
            <button
              v-if="header.column.getCanSort()"
              type="button"
              class="inline-flex items-center gap-1 cursor-pointer select-none"
              @click="header.column.toggleSorting(header.column.getIsSorted() === 'asc')"
            >
              {{ header.column.columnDef.header }}
              <ArrowUp v-if="header.column.getIsSorted() === 'asc'" class="w-3.5 h-3.5" />
              <ArrowDown v-else-if="header.column.getIsSorted() === 'desc'" class="w-3.5 h-3.5" />
              <ArrowUpDown v-else class="w-3.5 h-3.5 opacity-40" />
            </button>
            <template v-else>{{ header.column.columnDef.header }}</template>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="columns.length" class="text-center py-12">
            <span class="loading loading-spinner loading-xl text-secondary" />
          </td>
        </tr>
        <tr v-else-if="rows.length === 0">
          <td :colspan="columns.length" class="text-center py-12 text-base-content/40 text-sm">
            {{ emptyText }}
          </td>
        </tr>
        <template v-else>
          <tr v-for="row in table.getRowModel().rows" :key="row.original.id" class="hover">
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              :class="columnClass(cell.column.id)"
            >
              <slot :name="`cell-${cell.column.id}`" :row="row.original">
                {{ cell.getValue() ?? '—' }}
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>

  <div
    v-if="pageCount > 1"
    class="flex items-center justify-between px-4 py-3 border-t border-base-300"
  >
    <span class="text-sm text-base-content/50">Pagina {{ pageIndex + 1 }} di {{ pageCount }}</span>
    <div class="join">
      <button
        class="join-item btn btn-sm btn-ghost"
        aria-label="Pagina precedente"
        :disabled="!table.getCanPreviousPage()"
        @click="table.previousPage()"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>
      <button
        v-for="p in visiblePages"
        :key="p"
        class="join-item btn btn-sm"
        :class="p === pageIndex ? 'btn-active' : 'btn-ghost'"
        :aria-current="p === pageIndex ? 'page' : undefined"
        @click="table.setPageIndex(p)"
      >
        {{ p + 1 }}
      </button>
      <button
        class="join-item btn btn-sm btn-ghost"
        aria-label="Pagina successiva"
        :disabled="!table.getCanNextPage()"
        @click="table.nextPage()"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
