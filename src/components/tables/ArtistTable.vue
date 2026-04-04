<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { Table, Pencil, Trash2 } from 'lucide-vue-next'
import AppTable from '@/components/app/AppTable.vue'
import { getArtists, deleteArtist } from '@/api/artists'
import { useDebounce } from '@/composables/useDebounce'
import { formatDate } from '@/utils/dates'

const queryClient = useQueryClient()
const search = ref('')
const debouncedSearch = useDebounce(search, 400)

// Reset pagina quando cambia la ricerca debouncata
watch(debouncedSearch, () => {
  page.value = 1
})

const page = ref(1)

const { data, isLoading } = useQuery({
  // La queryKey usa debouncedSearch: la fetch parte solo dopo 400ms di pausa
  queryKey: computed(() => ['artists', { search: debouncedSearch.value }]),
  queryFn: () => getArtists({ search: debouncedSearch.value }),
  placeholderData: (prev) => prev,
  staleTime: 1000 * 60 * 5, // dati freschi per 5 minuti
})

// La risposta è un array piatto
const artists = computed(() => data.value ?? [])
const total = computed(() => artists.value.length)

const { mutate: remove } = useMutation({
  mutationFn: deleteArtist,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['artists'] }),
})
</script>
<template>
  <AppTable
    v-model:search="search"
    search-placeholder="Cerca artista..."
    :total="total"
    :loading="isLoading"
  >
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
          <div class="flex items-center gap-1">
            <button
              class="btn btn-ghost btn-xs btn-square text-success tooltip tooltip-success"
              data-tip="Modifica"
              title="Modifica"
            >
              <Pencil class="w-3.5 h-3.5" />
            </button>
            <button
              class="btn btn-ghost btn-xs btn-square text-error tooltip tooltip-error"
              data-tip="Elimina"
              title="Elimina"
              @click="remove(artist.id)"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      </tr>
    </template>
  </AppTable>
</template>
