<script setup lang="ts">
import AppTable from '@/components/app/AppTable.vue'
import ActionColumn from '@/components/shared/ActionColumn.vue'
import StatusFilter from '@/components/shared/StatusFilter.vue'
import SortableHeader from '@/components/shared/SortableHeader.vue'
import AppLoading from '@/components/app/AppLoading.vue'
import { formatDate } from '@/utils/dates'
import { useModalStore } from '@/stores/modal'
import { useCrudTable } from '@/composables/useCrudTable'
import Conditions from '@/api/conditions'

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
  api: Conditions,
  queryKey: 'conditions',
  messages: { removed: 'Condizione eliminata', restored: 'Condizione ripristinata' },
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
      <tr v-for="condition in rows" :key="condition.id" class="hover">
        <td>
          <!-- Badge monospace per il codice breve (es. NM, LP) -->
          <span class="badge badge-ghost font-mono">{{ condition.code }}</span>
        </td>
        <td class="font-medium">{{ condition.name }}</td>
        <td class="text-base-content/60 text-sm">{{ formatDate(condition.created_at) }}</td>
        <td>
          <ActionColumn
            :actions="condition.deleted_at ? ['restore'] : ['edit', 'delete']"
            @edit="modalStore.open(condition)"
            @delete="remove(condition.id)"
            @restore="restore(condition.id)"
          />
        </td>
      </tr>
    </template>
  </AppTable>

  <AppLoading :visible="isMutating" />
</template>
