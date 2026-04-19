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
import CardTypes from '@/api/card-types'

const modalStore = useModalStore()
const queryClient = useQueryClient()
const { show } = useToast()

const search = ref('')
const statusFilter = ref<StatusFilterValue>('active')

// Carica tutti i tipi carta inclusi i soft-deleted per gestire il filtro lato client
const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ['card-types'],
  queryFn: () => CardTypes.get({ withTrashed: true }),
  staleTime: Infinity,
  placeholderData: (prev) => prev,
})

const allCardTypes = computed(() => data.value ?? [])

// Filtra per stato (attivo/eliminato) e per ricerca testuale
const cardTypes = computed(() => {
  let filtered = allCardTypes.value

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

const total = computed(() => cardTypes.value.length)

// Soft-delete
const { mutate: remove, isPending: isRemoving } = useMutation({
  mutationFn: (id: number) => CardTypes.remove(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['card-types'] })
    show('Tipo carta eliminato', 'error')
  },
})

// Ripristino da soft-delete
const { mutate: restore, isPending: isRestoring } = useMutation({
  mutationFn: (id: number) => CardTypes.restore(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['card-types'] })
    show('Tipo carta ripristinato')
  },
})

// true mentre una qualsiasi mutation è in corso (mostra AppLoading)
const isMutating = computed(() => isRemoving.value || isRestoring.value)

const sort = ref<SortState | null>(null)

const sortedCardTypes = computed(() => {
  if (!sort.value) return cardTypes.value
  const { field, direction } = sort.value
  const mult = direction === 'asc' ? 1 : -1
  return [...cardTypes.value].sort((a, b) => {
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
      <tr v-for="cardType in sortedCardTypes" :key="cardType.id" class="hover">
        <td class="font-medium">{{ cardType.name }}</td>
        <td class="text-base-content/60 text-sm">{{ formatDate(cardType.created_at) }}</td>
        <td>
          <ActionColumn
            :actions="cardType.deleted_at ? ['restore'] : ['edit', 'delete']"
            @edit="modalStore.open(cardType as Record<string, unknown>)"
            @delete="remove(cardType.id)"
            @restore="restore(cardType.id)"
          />
        </td>
      </tr>
    </template>
  </AppTable>

  <AppLoading :visible="isMutating" />
</template>
