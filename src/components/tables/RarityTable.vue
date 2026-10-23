<script setup lang="ts">
import AppTable from '@/components/app/AppTable.vue'
import ActionColumn from '@/components/shared/ActionColumn.vue'
import StatusFilter from '@/components/shared/StatusFilter.vue'
import SortableHeader from '@/components/shared/SortableHeader.vue'
import AppLoading from '@/components/app/AppLoading.vue'
import { formatDate } from '@/utils/dates'
import { useModalStore } from '@/stores/modal'
import { useCrudTable } from '@/composables/useCrudTable'
import Rarities from '@/api/rarities'

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
  api: Rarities,
  queryKey: 'rarities',
  messages: { removed: 'Rarità eliminata', restored: 'Rarità ripristinata' },
  search: {
    excludeKeys: ['updated_at', 'deleted_at'],
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
      <tr v-for="rarity in rows" :key="rarity.id" class="hover">
        <td class="font-medium">{{ rarity.name }}</td>
        <td class="text-base-content/60 text-sm">{{ formatDate(rarity.created_at) }}</td>
        <td>
          <ActionColumn
            :actions="rarity.deleted_at ? ['restore'] : ['edit', 'delete']"
            @edit="modalStore.open(rarity)"
            @delete="remove(rarity.id)"
            @restore="restore(rarity.id)"
          />
        </td>
      </tr>
    </template>
  </AppTable>

  <AppLoading :visible="isMutating" />
</template>
