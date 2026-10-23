<script setup lang="ts">
import AppTable from '@/components/app/AppTable.vue'
import ActionColumn from '@/components/shared/ActionColumn.vue'
import StatusFilter from '@/components/shared/StatusFilter.vue'
import SortableHeader from '@/components/shared/SortableHeader.vue'
import AppLoading from '@/components/app/AppLoading.vue'
import { formatDate } from '@/utils/dates'
import { useModalStore } from '@/stores/modal'
import { useCrudTable } from '@/composables/useCrudTable'
import Languages from '@/api/languages'

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
  api: Languages,
  queryKey: 'languages',
  messages: { removed: 'Lingua eliminata', restored: 'Lingua ripristinata' },
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
          field="country_code"
          label="Paese"
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
      <tr v-for="language in rows" :key="language.id" class="hover">
        <td>
          <!-- Codice ISO 639-1 (es. en, it) -->
          <span class="badge badge-ghost font-mono">{{ language.code }}</span>
        </td>
        <td class="font-medium">{{ language.name }}</td>
        <td>
          <!-- Codice paese ISO 3166-1 (es. US, IT) -->
          <span class="badge badge-outline font-mono text-xs">{{ language.country_code }}</span>
        </td>
        <td class="text-base-content/60 text-sm">{{ formatDate(language.created_at) }}</td>
        <td>
          <ActionColumn
            :actions="language.deleted_at ? ['restore'] : ['edit', 'delete']"
            @edit="modalStore.open(language)"
            @delete="remove(language.id)"
            @restore="restore(language.id)"
          />
        </td>
      </tr>
    </template>
  </AppTable>

  <AppLoading :visible="isMutating" />
</template>
