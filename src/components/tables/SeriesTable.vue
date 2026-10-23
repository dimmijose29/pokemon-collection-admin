<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { LayoutList } from 'lucide-vue-next'
import AppTable from '@/components/app/AppTable.vue'
import ActionColumn from '@/components/shared/ActionColumn.vue'
import StatusFilter from '@/components/shared/StatusFilter.vue'
import type { StatusFilterValue } from '@/components/shared/StatusFilter.vue'
import SortableHeader from '@/components/shared/SortableHeader.vue'
import type { SortState } from '@/components/shared/SortableHeader.vue'
import AppLoading from '@/components/app/AppLoading.vue'
import { formatDate } from '@/utils/dates'
import { filterBySearch } from '@/utils/search'
import { useModalStore } from '@/stores/modal'
import { useToast } from '@/composables/useToast'
import SeriesApi from '@/api/series'
import type { Series } from '@/types/series'

const modalStore = useModalStore()
const queryClient = useQueryClient()
const router = useRouter()
const { show } = useToast()

const search = ref('')
const statusFilter = ref<StatusFilterValue>('active')
const sort = ref<SortState | null>(null)

const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ['series', { withTrashed: true }],
  queryFn: () => SeriesApi.get({ withTrashed: true }),
  staleTime: Infinity,
  placeholderData: (prev) => prev,
})

const allSeries = computed(() => data.value ?? [])

const filtered = computed(() => {
  let list = allSeries.value
  if (statusFilter.value === 'active') list = list.filter((s) => !s.deleted_at)
  else if (statusFilter.value === 'deleted') list = list.filter((s) => !!s.deleted_at)
  return filterBySearch(list, search.value, {
    excludeKeys: ['deleted_at', 'logo_url'],
    transformers: { created_at: (v) => formatDate(v as string) },
  })
})

const sorted = computed(() => {
  if (!sort.value) return filtered.value
  const { field, direction } = sort.value
  const mult = direction === 'asc' ? 1 : -1
  return [...filtered.value].sort((a, b) => {
    if (field === 'sets_count') return ((a.sets_count ?? 0) - (b.sets_count ?? 0)) * mult
    if (field === 'created_at')
      return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * mult
    return (
      String(a[field as keyof Series] ?? '').localeCompare(String(b[field as keyof Series] ?? '')) *
      mult
    )
  })
})

const { mutate: remove, isPending: isRemoving } = useMutation({
  mutationFn: (id: number) => SeriesApi.remove(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['series'] })
    show('Serie eliminata', 'error')
  },
})

const { mutate: restore, isPending: isRestoring } = useMutation({
  mutationFn: (id: number) => SeriesApi.restore(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['series'] })
    show('Serie ripristinata')
  },
})

const isMutating = computed(() => isRemoving.value || isRestoring.value)
</script>

<template>
  <AppTable
    v-model:search="search"
    search-placeholder="Cerca serie..."
    :total="sorted.length"
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
      <tr v-for="series in sorted" :key="series.id" class="hover">
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
