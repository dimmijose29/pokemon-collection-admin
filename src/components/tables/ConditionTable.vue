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
import Conditions from '@/api/conditions'

const modalStore = useModalStore()
const queryClient = useQueryClient()
const { show } = useToast()

const search = ref('')
const statusFilter = ref<StatusFilterValue>('active')

// Carica tutte le condizioni incluse le soft-deleted per gestire il filtro lato client
const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ['conditions'],
  queryFn: () => Conditions.get({ withTrashed: true }),
  staleTime: Infinity,
  placeholderData: (prev) => prev,
})

const allConditions = computed(() => data.value ?? [])

// Filtra per stato (attivo/eliminato) e per ricerca testuale
const conditions = computed(() => {
  let filtered = allConditions.value

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

const total = computed(() => conditions.value.length)

// Soft-delete
const { mutate: remove, isPending: isRemoving } = useMutation({
  mutationFn: (id: number) => Conditions.remove(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['conditions'] })
    show('Condizione eliminata', 'error')
  },
})

// Ripristino da soft-delete
const { mutate: restore, isPending: isRestoring } = useMutation({
  mutationFn: (id: number) => Conditions.restore(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['conditions'] })
    show('Condizione ripristinata')
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
        <th>Codice</th>
        <th>Nome</th>
        <th>Creato il</th>
        <th class="w-24"><Table /></th>
      </tr>
    </template>

    <template #body>
      <tr v-for="condition in conditions" :key="condition.id" class="hover">
        <td>
          <!-- Badge monospace per il codice breve (es. NM, LP) -->
          <span class="badge badge-ghost font-mono">{{ condition.code }}</span>
        </td>
        <td class="font-medium">{{ condition.name }}</td>
        <td class="text-base-content/60 text-sm">{{ formatDate(condition.created_at) }}</td>
        <td>
          <ActionColumn
            :actions="condition.deleted_at ? ['restore'] : ['edit', 'delete']"
            @edit="modalStore.open(condition as Record<string, unknown>)"
            @delete="remove(condition.id)"
            @restore="restore(condition.id)"
          />
        </td>
      </tr>
    </template>
  </AppTable>

  <AppLoading :visible="isMutating" />
</template>
