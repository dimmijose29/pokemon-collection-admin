<script setup lang="ts">
import AppTable from '@/components/app/AppTable.vue'
import BaseDataTable from '@/components/base/BaseDataTable.vue'
import type { DataColumn } from '@/components/base/dataTable'
import ActionColumn from '@/components/shared/ActionColumn.vue'
import StatusFilter from '@/components/shared/StatusFilter.vue'
import AppLoading from '@/components/app/AppLoading.vue'
import { formatDate } from '@/utils/dates'
import { useModalStore } from '@/stores/modal'
import { useCrudTable } from '@/composables/useCrudTable'
import Currencies from '@/api/currencies'
import type { Currency } from '@/types/currency'

const modalStore = useModalStore()

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
  api: Currencies,
  queryKey: 'currencies',
  messages: { removed: 'Valuta eliminata', restored: 'Valuta ripristinata' },
  search: {
    excludeKeys: ['deleted_at'],
    transformers: { created_at: (v) => formatDate(v as string) },
  },
})

const columns: DataColumn<Currency>[] = [
  { id: 'code', label: 'Codice', class: 'w-28' },
  { id: 'symbol', label: 'Simbolo' },
  { id: 'created_at', label: 'Creato il' },
  { id: 'actions', class: 'w-24' },
]
</script>

<template>
  <AppTable
    v-model:search="search"
    search-placeholder="Cerca..."
    :total="total"
    :refreshing="isFetching"
    @refresh="refetch()"
  >
    <template #filters>
      <StatusFilter v-model="statusFilter" />
    </template>

    <BaseDataTable :rows="rows" :columns="columns" :loading="isLoading">
      <template #cell-code="{ row }">
        <!-- Codice ISO 4217 (es. EUR, USD) -->
        <span class="badge badge-ghost font-mono">{{ row.code }}</span>
      </template>
      <template #cell-symbol="{ row }">
        <span class="font-medium text-lg">{{ row.symbol }}</span>
      </template>
      <template #cell-created_at="{ row }">
        <span class="text-base-content/60 text-sm">{{ formatDate(row.created_at) }}</span>
      </template>
      <template #cell-actions="{ row }">
        <ActionColumn
          :actions="row.deleted_at ? ['restore'] : ['edit', 'delete']"
          @edit="modalStore.open(row)"
          @delete="remove(row.id)"
          @restore="restore(row.id)"
        />
      </template>
    </BaseDataTable>
  </AppTable>

  <AppLoading :visible="isMutating" />
</template>
