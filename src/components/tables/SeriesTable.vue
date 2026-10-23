<script setup lang="ts">
import { useRouter } from 'vue-router'
import { LayoutList } from 'lucide-vue-next'
import AppTable from '@/components/app/AppTable.vue'
import BaseDataTable from '@/components/base/BaseDataTable.vue'
import type { DataColumn } from '@/components/base/dataTable'
import ActionColumn from '@/components/shared/ActionColumn.vue'
import StatusFilter from '@/components/shared/StatusFilter.vue'
import AppLoading from '@/components/app/AppLoading.vue'
import { formatDate } from '@/utils/dates'
import { useModalStore } from '@/stores/modal'
import { useCrudTable } from '@/composables/useCrudTable'
import SeriesApi from '@/api/series'
import type { Series } from '@/types/series'

const modalStore = useModalStore()
const router = useRouter()

const {
  search,
  statusFilter,
  rows,
  total,
  isLoading,
  isFetching,
  refetch,
  remove,
  restore,
  isMutating,
} = useCrudTable({
  api: SeriesApi,
  queryKey: 'series',
  messages: { removed: 'Serie eliminata', restored: 'Serie ripristinata' },
  search: {
    excludeKeys: ['deleted_at', 'logo_url'],
    transformers: { created_at: (v) => formatDate(v as string) },
  },
})

const columns: DataColumn<Series>[] = [
  { id: 'logo', class: 'w-20' },
  { id: 'name', label: 'Nome' },
  { id: 'tcgdex_id', label: 'TCGdex ID', class: 'hidden md:table-cell' },
  {
    id: 'sets_count',
    label: 'Set',
    accessor: (s) => s.sets_count ?? 0,
    class: 'hidden lg:table-cell w-20',
  },
  { id: 'created_at', label: 'Creata il', class: 'hidden lg:table-cell' },
  { id: 'actions', class: 'w-28' },
]
</script>

<template>
  <AppTable
    v-model:search="search"
    search-placeholder="Cerca serie..."
    :total="total"
    :refreshing="isFetching"
    @refresh="refetch()"
  >
    <template #filters>
      <StatusFilter v-model="statusFilter" />
    </template>

    <BaseDataTable :rows="rows" :columns="columns" :loading="isLoading">
      <template #cell-logo="{ row }">
        <img
          v-if="row.logo_url"
          :src="row.logo_url"
          :alt="row.name"
          class="h-8 max-w-[5rem] object-contain opacity-80"
        />
        <span v-else class="text-base-content/20 text-xs">—</span>
      </template>
      <template #cell-name="{ row }">
        <span class="font-medium">{{ row.name }}</span>
      </template>
      <template #cell-tcgdex_id="{ row }">
        <span class="text-base-content/50 text-sm font-mono">{{ row.tcgdex_id ?? '—' }}</span>
      </template>
      <template #cell-sets_count="{ row }">
        <span class="badge badge-ghost badge-sm">{{ row.sets_count ?? 0 }} set</span>
      </template>
      <template #cell-created_at="{ row }">
        <span class="text-base-content/50 text-sm">{{ formatDate(row.created_at) }}</span>
      </template>
      <template #cell-actions="{ row }">
        <div class="flex items-center gap-1">
          <button
            v-if="!row.deleted_at"
            class="btn btn-ghost btn-xs tooltip tooltip-top"
            data-tip="Vedi set"
            aria-label="Vedi set"
            @click="router.push({ name: 'sets', query: { series: row.name } })"
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
