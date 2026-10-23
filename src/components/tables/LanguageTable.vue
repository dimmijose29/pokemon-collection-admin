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
import Languages from '@/api/languages'

const modalStore = useModalStore()
const queryClient = useQueryClient()
const { show } = useToast()

const search = ref('')
const statusFilter = ref<StatusFilterValue>('active')

// Carica tutte le lingue incluse le soft-deleted per gestire il filtro lato client
const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ['languages'],
  queryFn: () => Languages.get({ withTrashed: true }),
  staleTime: Infinity,
  placeholderData: (prev) => prev,
})

const allLanguages = computed(() => data.value ?? [])

// Filtra per stato (attivo/eliminato) e per ricerca testuale
const languages = computed(() => {
  let filtered = allLanguages.value

  if (statusFilter.value === 'active') {
    filtered = filtered.filter((l) => !l.deleted_at)
  } else if (statusFilter.value === 'deleted') {
    filtered = filtered.filter((l) => !!l.deleted_at)
  }

  return filterBySearch(filtered, search.value, {
    excludeKeys: ['deleted_at'],
    transformers: {
      created_at: (v) => formatDate(v as string),
    },
  })
})

const total = computed(() => languages.value.length)

// Soft-delete
const { mutate: remove, isPending: isRemoving } = useMutation({
  mutationFn: (id: number) => Languages.remove(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['languages'] })
    show('Lingua eliminata', 'error')
  },
})

// Ripristino da soft-delete
const { mutate: restore, isPending: isRestoring } = useMutation({
  mutationFn: (id: number) => Languages.restore(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['languages'] })
    show('Lingua ripristinata')
  },
})

const isMutating = computed(() => isRemoving.value || isRestoring.value)

const sort = ref<SortState | null>(null)

const sortedLanguages = computed(() => {
  if (!sort.value) return languages.value
  const { field, direction } = sort.value
  const mult = direction === 'asc' ? 1 : -1
  return [...languages.value].sort((a, b) => {
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
        <SortableHeader field="name" label="Nome" :model-value="sort" @update:model-value="sort = $event" />
        <SortableHeader field="country_code" label="Paese" :model-value="sort" @update:model-value="sort = $event" />
        <SortableHeader field="created_at" label="Creato il" :model-value="sort" @update:model-value="sort = $event" />
        <th class="w-24"></th>
      </tr>
    </template>

    <template #body>
      <tr v-for="language in sortedLanguages" :key="language.id" class="hover">
        <td>
          <!-- Codice ISO 639-1 (es. en, it) -->
          <span class="badge badge-ghost font-mono">{{ language.code }}</span>
        </td>
        <td class="font-medium">{{ language.name }}</td>
        <td>
          <!-- Codice paese ISO 3166-1 (es. US, IT) -->
          <span class="badge badge-outline font-mono text-xs">{{ language.country_code }}</span>
        </td>
        <td class="text-base-content/60 text-sm">{{ formatDate(language.created_at) }}</td>
        <td>
          <ActionColumn
            :actions="language.deleted_at ? ['restore'] : ['edit', 'delete']"
            @edit="modalStore.open(language)"
            @delete="remove(language.id)"
            @restore="restore(language.id)"
          />
        </td>
      </tr>
    </template>
  </AppTable>

  <AppLoading :visible="isMutating" />
</template>
