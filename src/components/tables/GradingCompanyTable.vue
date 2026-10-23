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
import GradingCompanies from '@/api/grading-companies'

const modalStore = useModalStore()
const queryClient = useQueryClient()
const { show } = useToast()

const search = ref('')
const statusFilter = ref<StatusFilterValue>('active')

// Carica tutte le compagnie di grading incluse le soft-deleted per gestire il filtro lato client
const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ['grading-companies'],
  queryFn: () => GradingCompanies.get({ withTrashed: true }),
  staleTime: Infinity,
  placeholderData: (prev) => prev,
})

const allGradingCompanies = computed(() => data.value ?? [])

// Filtra per stato (attivo/eliminato) e per ricerca testuale
const gradingCompanies = computed(() => {
  let filtered = allGradingCompanies.value

  if (statusFilter.value === 'active') {
    filtered = filtered.filter((g) => !g.deleted_at)
  } else if (statusFilter.value === 'deleted') {
    filtered = filtered.filter((g) => !!g.deleted_at)
  }

  return filterBySearch(filtered, search.value, {
    excludeKeys: ['deleted_at'],
    transformers: {
      created_at: (v) => formatDate(v as string),
    },
  })
})

const total = computed(() => gradingCompanies.value.length)

// Soft-delete
const { mutate: remove, isPending: isRemoving } = useMutation({
  mutationFn: (id: number) => GradingCompanies.remove(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['grading-companies'] })
    show('Compagnia di grading eliminata', 'error')
  },
})

// Ripristino da soft-delete
const { mutate: restore, isPending: isRestoring } = useMutation({
  mutationFn: (id: number) => GradingCompanies.restore(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['grading-companies'] })
    show('Compagnia di grading ripristinata')
  },
})

const isMutating = computed(() => isRemoving.value || isRestoring.value)

const sort = ref<SortState | null>(null)

const sortedGradingCompanies = computed(() => {
  if (!sort.value) return gradingCompanies.value
  const { field, direction } = sort.value
  const mult = direction === 'asc' ? 1 : -1
  return [...gradingCompanies.value].sort((a, b) => {
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
        <SortableHeader field="name" label="Nome" :model-value="sort" @update:model-value="sort = $event" />
        <SortableHeader field="created_at" label="Creato il" :model-value="sort" @update:model-value="sort = $event" />
        <th class="w-24"></th>
      </tr>
    </template>

    <template #body>
      <tr v-for="company in sortedGradingCompanies" :key="company.id" class="hover">
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
