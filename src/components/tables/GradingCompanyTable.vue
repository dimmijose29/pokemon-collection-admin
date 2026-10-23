<script setup lang="ts">
import AppTable from '@/components/app/AppTable.vue'
import ActionColumn from '@/components/shared/ActionColumn.vue'
import StatusFilter from '@/components/shared/StatusFilter.vue'
import SortableHeader from '@/components/shared/SortableHeader.vue'
import AppLoading from '@/components/app/AppLoading.vue'
import { formatDate } from '@/utils/dates'
import { useModalStore } from '@/stores/modal'
import { useCrudTable } from '@/composables/useCrudTable'
import GradingCompanies from '@/api/grading-companies'

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
  api: GradingCompanies,
  queryKey: 'grading-companies',
  messages: {
    removed: 'Compagnia di grading eliminata',
    restored: 'Compagnia di grading ripristinata',
  },
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
          field="name"
          label="Nome"
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
      <tr v-for="company in rows" :key="company.id" class="hover">
        <td class="font-medium">{{ company.name }}</td>
        <td class="text-base-content/60 text-sm">{{ formatDate(company.created_at) }}</td>
        <td>
          <ActionColumn
            :actions="company.deleted_at ? ['restore'] : ['edit', 'delete']"
            @edit="modalStore.open(company)"
            @delete="remove(company.id)"
            @restore="restore(company.id)"
          />
        </td>
      </tr>
    </template>
  </AppTable>

  <AppLoading :visible="isMutating" />
</template>
