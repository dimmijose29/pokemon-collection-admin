<script setup lang="ts">
import { useRouter } from 'vue-router'
import { LayoutList } from 'lucide-vue-next'
import AppTable from '@/components/app/AppTable.vue'
import ActionColumn from '@/components/shared/ActionColumn.vue'
import StatusFilter from '@/components/shared/StatusFilter.vue'
import SortableHeader from '@/components/shared/SortableHeader.vue'
import AppLoading from '@/components/app/AppLoading.vue'
import { formatDate } from '@/utils/dates'
import { useModalStore } from '@/stores/modal'
import { useCrudTable } from '@/composables/useCrudTable'
import SeriesApi from '@/api/series'

const modalStore = useModalStore()
const router = useRouter()

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
  api: SeriesApi,
  queryKey: 'series',
  messages: { removed: 'Serie eliminata', restored: 'Serie ripristinata' },
  search: {
    excludeKeys: ['deleted_at', 'logo_url'],
    transformers: { created_at: (v) => formatDate(v as string) },
  },
})
</script>

<template>
  <AppTable
    v-model:search="search"
    search-placeholder="Cerca serie..."
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
        <th class="w-20"></th>
        <SortableHeader
          field="name"
          label="Nome"
          :model-value="sort"
          @update:model-value="sort = $event"
        />
        <SortableHeader
          field="tcgdex_id"
          label="TCGdex ID"
          :model-value="sort"
          class="hidden md:table-cell"
          @update:model-value="sort = $event"
        />
        <SortableHeader
          field="sets_count"
          label="Set"
          :model-value="sort"
          class="hidden lg:table-cell w-20"
          @update:model-value="sort = $event"
        />
        <SortableHeader
          field="created_at"
          label="Creata il"
          :model-value="sort"
          class="hidden lg:table-cell"
          @update:model-value="sort = $event"
        />
        <th class="w-28"></th>
      </tr>
    </template>

    <template #body>
      <tr v-for="series in rows" :key="series.id" class="hover">
        <!-- Logo -->
        <td>
          <img
            v-if="series.logo_url"
            :src="series.logo_url"
            :alt="series.name"
            class="h-8 max-w-[5rem] object-contain opacity-80"
          />
          <span v-else class="text-base-content/20 text-xs">—</span>
        </td>

        <!-- Nome -->
        <td>
          <div class="font-medium">{{ series.name }}</div>
        </td>

        <!-- TCGdex ID -->
        <td class="hidden md:table-cell text-base-content/50 text-sm font-mono">
          {{ series.tcgdex_id ?? '—' }}
        </td>

        <!-- Conteggio set -->
        <td class="hidden lg:table-cell">
          <span class="badge badge-ghost badge-sm">{{ series.sets_count ?? 0 }} set</span>
        </td>

        <!-- Data creazione -->
        <td class="hidden lg:table-cell text-base-content/50 text-sm">
          {{ formatDate(series.created_at) }}
        </td>

        <!-- Azioni -->
        <td>
          <div class="flex items-center gap-1">
            <button
              v-if="!series.deleted_at"
              class="btn btn-ghost btn-xs tooltip tooltip-top"
              data-tip="Vedi set"
              @click="router.push({ name: 'sets', query: { series: series.name } })"
            >
              <LayoutList class="w-4 h-4" />
            </button>
            <ActionColumn
              :actions="series.deleted_at ? ['restore'] : ['edit', 'delete']"
              @edit="modalStore.open(series)"
              @delete="remove(series.id)"
              @restore="restore(series.id)"
            />
          </div>
        </td>
      </tr>
    </template>
  </AppTable>

  <AppLoading :visible="isMutating" />
</template>
