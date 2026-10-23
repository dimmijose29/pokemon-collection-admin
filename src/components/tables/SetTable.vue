<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { LayoutList } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import AppTable from '@/components/app/AppTable.vue'
import BaseDataTable from '@/components/base/BaseDataTable.vue'
import type { DataColumn } from '@/components/base/dataTable'
import ActionColumn from '@/components/shared/ActionColumn.vue'
import StatusFilter from '@/components/shared/StatusFilter.vue'
import FilterSelect from '@/components/shared/FilterSelect.vue'
import AppLoading from '@/components/app/AppLoading.vue'
import { formatDate } from '@/utils/dates'
import { useModalStore } from '@/stores/modal'
import { useCrudTable } from '@/composables/useCrudTable'
import Sets from '@/api/sets'
import type { Set } from '@/types/set'

const modalStore = useModalStore()
const router = useRouter()
const route = useRoute()

const seriesFilter = ref<string[]>([])

const {
  search,
  statusFilter,
  all,
  rows,
  total,
  isLoading,
  isFetching,
  refetch,
  remove,
  restore,
  isMutating,
} = useCrudTable({
  api: Sets,
  queryKey: 'sets',
  messages: { removed: 'Set eliminato', restored: 'Set ripristinato' },
  search: {
    excludeKeys: ['deleted_at', 'symbol_url', 'logo_url', 'tcgdex_id', 'series_id'],
    transformers: { release_date: (v) => (v ? formatDate(v as string) : '') },
  },
  filter: (list) =>
    seriesFilter.value.length
      ? list.filter((s) => s.series?.name && seriesFilter.value.includes(s.series.name))
      : list,
})

const columns: DataColumn<Set>[] = [
  { id: 'logo', class: 'w-20' },
  { id: 'name', label: 'Nome' },
  { id: 'series', label: 'Serie', accessor: (s) => s.series?.name, class: 'hidden md:table-cell' },
  { id: 'card_count_official', label: 'Carte', class: 'hidden lg:table-cell w-24' },
  { id: 'release_date', label: 'Uscita', class: 'hidden lg:table-cell' },
  { id: 'actions', class: 'w-28' },
]

// Nomi delle serie presenti, per il filtro
const seriesList = computed(() => {
  const names = new Set(all.value.map((s) => s.series?.name).filter(Boolean) as string[])
  return [...names].sort()
})

// Pre-popola il filtro serie dal query param (es. navigando da SeriesTable → "Vedi set")
onMounted(() => {
  const q = route.query.series
  if (q) {
    seriesFilter.value = Array.isArray(q) ? (q.filter(Boolean) as string[]) : [q as string]
  }
})
</script>

<template>
  <AppTable
    v-model:search="search"
    search-placeholder="Cerca set..."
    :total="total"
    :refreshing="isFetching"
    @refresh="refetch()"
  >
    <template #filters>
      <FilterSelect
        v-model="seriesFilter"
        :options="seriesList"
        placeholder="Tutte le serie"
        multiple
      />
      <StatusFilter v-model="statusFilter" />
    </template>

    <BaseDataTable :rows="rows" :columns="columns" :loading="isLoading">
      <template #cell-logo="{ row }">
        <img
          v-if="row.logo_url"
          :src="row.logo_url"
          :alt="row.name"
          class="h-10 max-w-[5rem] object-contain"
        />
        <span v-else class="text-base-content/30 text-xs">—</span>
      </template>
      <template #cell-name="{ row }">
        <div class="font-medium">{{ row.name }}</div>
        <div class="text-base-content/40 text-xs">{{ row.tcgdex_id }}</div>
      </template>
      <template #cell-series="{ row }">
        <span class="text-base-content/60 text-sm">{{ row.series?.name ?? '—' }}</span>
      </template>
      <template #cell-card_count_official="{ row }">
        <span class="text-sm">
          <span class="font-medium">{{ row.card_count_official }}</span>
          <span class="text-base-content/40"> / {{ row.card_count_total }}</span>
        </span>
      </template>
      <template #cell-release_date="{ row }">
        <span class="text-base-content/60 text-sm">
          {{ row.release_date ? formatDate(row.release_date) : '—' }}
        </span>
      </template>
      <template #cell-actions="{ row }">
        <div class="flex items-center gap-1">
          <button
            v-if="!row.deleted_at"
            class="btn btn-ghost btn-xs tooltip tooltip-top"
            data-tip="Vedi carte"
            aria-label="Vedi carte"
            @click="router.push({ name: 'set-cards', params: { id: row.id } })"
          >
            <LayoutList class="w-4 h-4" />
          </button>
          <ActionColumn
            :actions="row.deleted_at ? ['restore'] : ['edit', 'delete']"
            @edit="modalStore.open(row)"
            @delete="remove(row.id)"
            @restore="restore(row.id)"
          />
        </div>
      </template>
    </BaseDataTable>
  </AppTable>

  <AppLoading :visible="isMutating" />
</template>
