<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import AppTable from '@/components/app/AppTable.vue'
import ActionColumn from '@/components/shared/ActionColumn.vue'
import StatusFilter from '@/components/shared/StatusFilter.vue'
import type { StatusFilterValue } from '@/components/shared/StatusFilter.vue'
import SortableHeader from '@/components/shared/SortableHeader.vue'
import type { SortState } from '@/components/shared/SortableHeader.vue'
import { formatDate } from '@/utils/dates'
import { filterBySearch } from '@/utils/search'
import { useModalStore } from '@/stores/modal'
import Rarities from '@/api/rarities'
import AppLoading from '@/components/app/AppLoading.vue'
import { useToast } from '@/composables/useToast'

const modalStore = useModalStore()
const queryClient = useQueryClient()
const search = ref('')
const statusFilter = ref<StatusFilterValue>('active')
const { show } = useToast()
const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ['rarities'],
  queryFn: () => Rarities.get({ withTrashed: true }),
  staleTime: Infinity,
  placeholderData: (prev) => prev,
})

const allRarities = computed(() => data.value ?? [])

const rarities = computed(() => {
  let filtered = allRarities.value

  if (statusFilter.value === 'active') {
    filtered = filtered.filter((a) => !a.deleted_at)
  } else if (statusFilter.value === 'deleted') {
    filtered = filtered.filter((a) => !!a.deleted_at)
  }

  return filterBySearch(filtered, search.value, {
    excludeKeys: ['updated_at', 'deleted_at'],
    transformers: {
      created_at: (v) => formatDate(v as string),
    },
  })
})

const total = computed(() => rarities.value.length)

// mutations
const { mutate: remove, isPending: isRemoving } = useMutation({
  mutationFn: (id: number) => Rarities.remove(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['rarities'] })
    show('Rarità eliminata con successo')
  },
})

const { mutate: restore, isPending: isRestoring } = useMutation({
  mutationFn: (id: number) => Rarities.restore(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['rarities'] })
    show('Rarità ripristinata con successo')
  },
})

const isMutating = computed(() => isRemoving.value || isRestoring.value)

const sort = ref<SortState | null>(null)

const sortedRarities = computed(() => {
  if (!sort.value) return rarities.value
  const { field, direction } = sort.value
  const mult = direction === 'asc' ? 1 : -1
  return [...rarities.value].sort((a, b) => {
    if (field === 'created_at')
      return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * mult
    return (
      String(a[field as keyof typeof a] ?? '').localeCompare(
        String(b[field as keyof typeof b] ?? ''),
      ) * mult
    )
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
        <SortableHeader
          field="name"
          label="Nome"
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
      <tr v-for="rarity in sortedRarities" :key="rarity.id" class="hover">
        <td class="font-medium">{{ rarity.name }}</td>
        <td class="text-base-content/60 text-sm">{{ formatDate(rarity.created_at) }}</td>
        <td>
          <ActionColumn
            :actions="rarity.deleted_at ? ['restore'] : ['edit', 'delete']"
            @edit="modalStore.open(rarity)"
            @delete="remove(rarity.id)"
            @restore="restore(rarity.id)"
          />
        </td>
      </tr>
    </template>
  </AppTable>

  <AppLoading :visible="isMutating" />
</template>
