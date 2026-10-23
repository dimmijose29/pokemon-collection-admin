<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { LayoutList } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import AppTable from '@/components/app/AppTable.vue'
import ActionColumn from '@/components/shared/ActionColumn.vue'
import StatusFilter from '@/components/shared/StatusFilter.vue'
import SortableHeader from '@/components/shared/SortableHeader.vue'
import FilterSelect from '@/components/shared/FilterSelect.vue'
import AppLoading from '@/components/app/AppLoading.vue'
import { formatDate } from '@/utils/dates'
import { useModalStore } from '@/stores/modal'
import { useCrudTable } from '@/composables/useCrudTable'
import Sets from '@/api/sets'

const modalStore = useModalStore()
const router = useRouter()
const route = useRoute()

const seriesFilter = ref<string[]>([])

const {
  search,
  statusFilter,
  sort,
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
  sorters: {
    series: (a, b) => (a.series?.name ?? '').localeCompare(b.series?.name ?? ''),
  },
})

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
    :loading="isLoading || isFetching"
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
          field="series"
          label="Serie"
          :model-value="sort"
          class="hidden md:table-cell"
          @update:model-value="sort = $event"
        />
        <SortableHeader
          field="card_count_official"
          label="Carte"
          :model-value="sort"
          class="hidden lg:table-cell w-24"
          @update:model-value="sort = $event"
        />
        <SortableHeader
          field="release_date"
          label="Uscita"
          :model-value="sort"
          class="hidden lg:table-cell"
          @update:model-value="sort = $event"
        />
        <th class="w-28"></th>
      </tr>
    </template>

    <template #body>
      <tr v-for="set in rows" :key="set.id" class="hover">
        <!-- Logo -->
        <td>
          <img
            v-if="set.logo_url"
            :src="set.logo_url"
            :alt="set.name"
            class="h-10 max-w-[5rem] object-contain"
          />
          <span v-else class="text-base-content/30 text-xs">—</span>
        </td>

        <!-- Nome + tcgdex_id -->
        <td>
          <div class="font-medium">{{ set.name }}</div>
          <div class="text-base-content/40 text-xs">{{ set.tcgdex_id }}</div>
        </td>

        <!-- Serie -->
        <td class="hidden md:table-cell text-base-content/60 text-sm">
          {{ set.series?.name ?? '—' }}
        </td>

        <!-- Carte -->
        <td class="hidden lg:table-cell text-sm">
          <span class="font-medium">{{ set.card_count_official }}</span>
          <span class="text-base-content/40"> / {{ set.card_count_total }}</span>
        </td>

        <!-- Data uscita -->
        <td class="hidden lg:table-cell text-base-content/60 text-sm">
          {{ set.release_date ? formatDate(set.release_date) : '—' }}
        </td>

        <!-- Azioni -->
        <td>
          <div class="flex items-center gap-1">
            <!-- Link alle carte del set -->
            <button
              v-if="!set.deleted_at"
              class="btn btn-ghost btn-xs tooltip tooltip-top"
              data-tip="Vedi carte"
              @click="router.push({ name: 'set-cards', params: { id: set.id } })"
            >
              <LayoutList class="w-4 h-4" />
            </button>
            <ActionColumn
              :actions="set.deleted_at ? ['restore'] : ['edit', 'delete']"
              @edit="modalStore.open(set)"
              @delete="remove(set.id)"
              @restore="restore(set.id)"
            />
          </div>
        </td>
      </tr>
    </template>
  </AppTable>

  <AppLoading :visible="isMutating" />
</template>
