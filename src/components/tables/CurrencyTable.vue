<script setup lang="ts">
import AppTable from '@/components/app/AppTable.vue'
import ActionColumn from '@/components/shared/ActionColumn.vue'
import StatusFilter from '@/components/shared/StatusFilter.vue'
import SortableHeader from '@/components/shared/SortableHeader.vue'
import AppLoading from '@/components/app/AppLoading.vue'
import { formatDate } from '@/utils/dates'
import { useModalStore } from '@/stores/modal'
import { useCrudTable } from '@/composables/useCrudTable'
import Currencies from '@/api/currencies'

const modalStore = useModalStore()

const {
  search,
  statusFilter,
  sort,
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
</script>

<template>
  <AppTable
    v-model:search="search"
    search-placeholder="Cerca..."
    :total="total"
    :loading="isLoading || isFetching"
    :refreshing="isFetching"
    @refresh="refetch()"
  >
    <template #filters>
      <StatusFilter v-model="statusFilter" />
    </template>

    <template #head>
      <tr>
        <SortableHeader
          field="code"
          label="Codice"
          :model-value="sort"
          class="w-28"
          @update:model-value="sort = $event"
        />
        <SortableHeader
          field="symbol"
          label="Simbolo"
          :model-value="sort"
          @update:model-value="sort = $event"
        />
        <SortableHeader
          field="created_at"
          label="Creato il"
          :model-value="sort"
          @update:model-value="sort = $event"
        />
        <th class="w-24"></th>
      </tr>
    </template>

    <template #body>
      <tr v-for="currency in rows" :key="currency.id" class="hover">
        <td>
          <!-- Codice ISO 4217 (es. EUR, USD) -->
          <span class="badge badge-ghost font-mono">{{ currency.code }}</span>
        </td>
        <td class="font-medium text-lg">{{ currency.symbol }}</td>
        <td class="text-base-content/60 text-sm">{{ formatDate(currency.created_at) }}</td>
        <td>
          <ActionColumn
            :actions="currency.deleted_at ? ['restore'] : ['edit', 'delete']"
            @edit="modalStore.open(currency)"
            @delete="remove(currency.id)"
            @restore="restore(currency.id)"
          />
        </td>
      </tr>
    </template>
  </AppTable>

  <AppLoading :visible="isMutating" />
</template>
