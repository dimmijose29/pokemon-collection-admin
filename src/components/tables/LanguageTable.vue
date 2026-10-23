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
import Languages from '@/api/languages'
import type { Language } from '@/types/language'

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
  api: Languages,
  queryKey: 'languages',
  messages: { removed: 'Lingua eliminata', restored: 'Lingua ripristinata' },
  search: {
    excludeKeys: ['deleted_at'],
    transformers: { created_at: (v) => formatDate(v as string) },
  },
})

const columns: DataColumn<Language>[] = [
  { id: 'code', label: 'Codice', class: 'w-28' },
  { id: 'name', label: 'Nome' },
  { id: 'country_code', label: 'Paese' },
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
        <!-- Codice ISO 639-1 (es. en, it) -->
        <span class="badge badge-ghost font-mono">{{ row.code }}</span>
      </template>
      <template #cell-name="{ row }">
        <span class="font-medium">{{ row.name }}</span>
      </template>
      <template #cell-country_code="{ row }">
        <!-- Codice paese ISO 3166-1 (es. US, IT) -->
        <span class="badge badge-outline font-mono text-xs">{{ row.country_code }}</span>
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
