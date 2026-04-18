<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { Table } from 'lucide-vue-next'
import AppTable from '@/components/app/AppTable.vue'
import ActionColumn from '@/components/shared/ActionColumn.vue'
import StatusFilter from '@/components/shared/StatusFilter.vue'
import type { StatusFilterValue } from '@/components/shared/StatusFilter.vue'
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
    excludeKeys: ['updated_at', 'deleted_at'],
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
        <th>Nome</th>
        <th>Creato il</th>
        <th class="w-24"><Table /></th>
      </tr>
    </template>

    <template #body>
      <tr v-for="company in gradingCompanies" :key="company.id" class="hover">
        <td class="font-medium">{{ company.name }}</td>
        <td class="text-base-content/60 text-sm">{{ formatDate(company.created_at) }}</td>
        <td>
          <ActionColumn
            :actions="company.deleted_at ? ['restore'] : ['edit', 'delete']"
            @edit="modalStore.open(company as Record<string, unknown>)"
            @delete="remove(company.id)"
            @restore="restore(company.id)"
          />
        </td>
      </tr>
    </template>
  </AppTable>

  <AppLoading :visible="isMutating" />
</template>
