<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { Table } from 'lucide-vue-next'
import AppTable from '@/components/app/AppTable.vue'
import ActionColumn from '@/components/shared/ActionColumn.vue'
import StatusFilter from '@/components/shared/StatusFilter.vue'
import type { StatusFilterValue } from '@/components/shared/StatusFilter.vue'
import { formatDate } from '@/utils/dates'
import { filterBySearch } from '@/utils/search'
import { useModalStore } from '@/stores/modal'
import Artists from '@/api/artists'
import AppLoading from '@/components/app/AppLoading.vue'

const modalStore = useModalStore()
const queryClient = useQueryClient()
const search = ref('')
const statusFilter = ref<StatusFilterValue>('active')

const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ['artists'],
  queryFn: () => Artists.get({ withTrashed: true }),
  staleTime: Infinity,
  placeholderData: (prev) => prev,
})

const allArtists = computed(() => data.value ?? [])

const artists = computed(() => {
  let filtered = allArtists.value

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

const total = computed(() => artists.value.length)

// mutations
const { mutate: remove, isPending: isRemoving } = useMutation({
  mutationFn: (id: number) => Artists.remove(id),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['artists'] }),
})

const { mutate: restore, isPending: isRestoring } = useMutation({
  mutationFn: (id: number) => Artists.restore(id),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['artists'] }),
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
      <tr v-for="artist in artists" :key="artist.id" class="hover">
        <td class="font-medium">{{ artist.name }}</td>
        <td class="text-base-content/60 text-sm">{{ formatDate(artist.created_at) }}</td>
        <td>
          <ActionColumn
            :actions="artist.deleted_at ? ['restore'] : ['edit', 'delete']"
            @edit="modalStore.open(artist as Record<string, unknown>)"
            @delete="remove(artist.id)"
            @restore="restore(artist.id)"
          />
        </td>
      </tr>
    </template>
  </AppTable>

  <AppLoading :visible="isMutating" />
</template>
