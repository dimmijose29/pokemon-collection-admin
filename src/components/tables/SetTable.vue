<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { LayoutList } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import AppTable from '@/components/app/AppTable.vue'
import ActionColumn from '@/components/shared/ActionColumn.vue'
import StatusFilter from '@/components/shared/StatusFilter.vue'
import type { StatusFilterValue } from '@/components/shared/StatusFilter.vue'
import SortableHeader from '@/components/shared/SortableHeader.vue'
import type { SortState } from '@/components/shared/SortableHeader.vue'
import FilterSelect from '@/components/shared/FilterSelect.vue'
import AppLoading from '@/components/app/AppLoading.vue'
import { formatDate } from '@/utils/dates'
import { filterBySearch } from '@/utils/search'
import { useModalStore } from '@/stores/modal'
import { useToast } from '@/composables/useToast'
import Sets from '@/api/sets'
import type { Set } from '@/types/set'

const modalStore = useModalStore()
const queryClient = useQueryClient()
const { show } = useToast()
const router = useRouter()

const search = ref('')
const statusFilter = ref<StatusFilterValue>('active')
const seriesFilter = ref<string[]>([])
const sort = ref<SortState | null>(null)

const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ['sets'],
  queryFn: () => Sets.get({ withTrashed: true }),
  staleTime: Infinity,
  placeholderData: (prev) => prev,
})

const allSets = computed(() => data.value ?? [])

// Lista serie univoche per il filtro (nomi)
const seriesList = computed(() => {
  const names = new Set(allSets.value.map((s) => s.series?.name).filter(Boolean) as string[])
  return [...names].sort()
})

const sets = computed(() => {
  let filtered = allSets.value

  if (statusFilter.value === 'active') {
    filtered = filtered.filter((s) => !s.deleted_at)
  } else if (statusFilter.value === 'deleted') {
    filtered = filtered.filter((s) => !!s.deleted_at)
  }

  if (seriesFilter.value.length) {
    filtered = filtered.filter((s) => s.series?.name && seriesFilter.value.includes(s.series.name))
  }

  return filterBySearch(filtered, search.value, {
    excludeKeys: ['deleted_at', 'symbol_url', 'logo_url', 'tcgdex_id', 'series_id'],
    transformers: {
      release_date: (v) => (v ? formatDate(v as string) : ''),
    },
  })
})

const total = computed(() => sets.value.length)

const { mutate: remove, isPending: isRemoving } = useMutation({
  mutationFn: (id: number) => Sets.remove(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['sets'] })
    show('Set eliminato', 'error')
  },
})

const { mutate: restore, isPending: isRestoring } = useMutation({
  mutationFn: (id: number) => Sets.restore(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['sets'] })
    show('Set ripristinato')
  },
})

const isMutating = computed(() => isRemoving.value || isRestoring.value)

const sortedSets = computed(() => {
  if (!sort.value) return sets.value
  const { field, direction } = sort.value
  const mult = direction === 'asc' ? 1 : -1
  return [...sets.value].sort((a, b) => {
    if (field === 'card_count_official') return ((a.card_count_official ?? 0) - (b.card_count_official ?? 0)) * mult
    if (field === 'release_date') {
      const aD = a.release_date ? new Date(a.release_date).getTime() : 0
      const bD = b.release_date ? new Date(b.release_date).getTime() : 0
      return (aD - bD) * mult
    }
    if (field === 'series') return (a.series?.name ?? '').localeCompare(b.series?.name ?? '') * mult
    return String(a[field as keyof typeof a] ?? '').localeCompare(String(b[field as keyof typeof b] ?? '')) * mult
  })
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
        <SortableHeader field="name" label="Nome" :model-value="sort" @update:model-value="sort = $event" />
        <SortableHeader field="series" label="Serie" :model-value="sort" class="hidden md:table-cell" @update:model-value="sort = $event" />
        <SortableHeader field="card_count_official" label="Carte" :model-value="sort" class="hidden lg:table-cell w-24" @update:model-value="sort = $event" />
        <SortableHeader field="release_date" label="Uscita" :model-value="sort" class="hidden lg:table-cell" @update:model-value="sort = $event" />
        <th class="w-28"></th>
      </tr>
    </template>

    <template #body>
      <tr v-for="set in sortedSets" :key="set.id" class="hover">
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
              @edit="modalStore.open(set as Record<string, unknown>)"
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
