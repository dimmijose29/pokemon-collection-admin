<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
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
import Currencies from '@/api/currencies'

const modalStore = useModalStore()
const queryClient = useQueryClient()
const { show } = useToast()

const search = ref('')
const statusFilter = ref<StatusFilterValue>('active')

// Carica tutte le valute incluse le soft-deleted per gestire il filtro lato client
const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ['currencies'],
  queryFn: () => Currencies.get({ withTrashed: true }),
  staleTime: Infinity,
  placeholderData: (prev) => prev,
})

const allCurrencies = computed(() => data.value ?? [])

// Filtra per stato (attivo/eliminato) e per ricerca testuale
const currencies = computed(() => {
  let filtered = allCurrencies.value

  if (statusFilter.value === 'active') {
    filtered = filtered.filter((c) => !c.deleted_at)
  } else if (statusFilter.value === 'deleted') {
    filtered = filtered.filter((c) => !!c.deleted_at)
  }

  return filterBySearch(filtered, search.value, {
    excludeKeys: ['updated_at', 'deleted_at'],
    transformers: {
      created_at: (v) => formatDate(v as string),
    },
  })
})

const total = computed(() => currencies.value.length)

// Soft-delete
const { mutate: remove, isPending: isRemoving } = useMutation({
  mutationFn: (id: number) => Currencies.remove(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['currencies'] })
    show('Valuta eliminata', 'error')
  },
})

// Ripristino da soft-delete
const { mutate: restore, isPending: isRestoring } = useMutation({
  mutationFn: (id: number) => Currencies.restore(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['currencies'] })
    show('Valuta ripristinata')
  },
})

const isMutating = computed(() => isRemoving.value || isRestoring.value)

const sort = ref<SortState | null>(null)

const sortedCurrencies = computed(() => {
  if (!sort.value) return currencies.value
  const { field, direction } = sort.value
  const mult = direction === 'asc' ? 1 : -1
  return [...currencies.value].sort((a, b) => {
    if (field === 'created_at') return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * mult
    return String(a[field as keyof typeof a] ?? '').localeCompare(String(b[field as keyof typeof b] ?? '')) * mult
  })
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
        <SortableHeader field="code" label="Codice" :model-value="sort" class="w-28" @update:model-value="sort = $event" />
        <SortableHeader field="symbol" label="Simbolo" :model-value="sort" @update:model-value="sort = $event" />
        <SortableHeader field="created_at" label="Creato il" :model-value="sort" @update:model-value="sort = $event" />
        <th class="w-24"></th>
      </tr>
    </template>

    <template #body>
      <tr v-for="currency in sortedCurrencies" :key="currency.id" class="hover">
        <td>
          <!-- Codice ISO 4217 (es. EUR, USD) -->
          <span class="badge badge-ghost font-mono">{{ currency.code }}</span>
        </td>
        <td class="font-medium text-lg">{{ currency.symbol }}</td>
        <td class="text-base-content/60 text-sm">{{ formatDate(currency.created_at) }}</td>
        <td>
          <ActionColumn
            :actions="currency.deleted_at ? ['restore'] : ['edit', 'delete']"
            @edit="modalStore.open(currency as Record<string, unknown>)"
            @delete="remove(currency.id)"
            @restore="restore(currency.id)"
          />
        </td>
      </tr>
    </template>
  </AppTable>

  <AppLoading :visible="isMutating" />
</template>
