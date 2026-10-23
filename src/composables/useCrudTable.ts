import { computed, ref } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import axios from 'axios'
import type { CrudApi } from '@/api/crud'
import type { StatusFilterValue } from '@/components/shared/StatusFilter.vue'
import { useToast } from '@/composables/useToast'
import { filterBySearch } from '@/utils/search'

interface CrudRow {
  id: number
  deleted_at?: string | null
}

interface CrudTableOptions<T extends CrudRow> {
  api: Pick<CrudApi<T, unknown>, 'get' | 'remove' | 'restore'>
  /** Prefisso della query (es. 'artists'): la lista usa [queryKey, { withTrashed: true }]. */
  queryKey: string
  messages: { removed: string; restored: string }
  /** Opzioni di filterBySearch (campi esclusi, trasformazioni prima della ricerca). */
  search?: Parameters<typeof filterBySearch<T>>[2]
  /** Filtri aggiuntivi della tabella, applicati dopo stato ed eliminati. */
  filter?: (rows: T[]) => T[]
}

/**
 * Logica comune delle tabelle di catalogo: caricamento (eliminati inclusi),
 * filtro attivi/eliminati, ricerca ed eliminazione/ripristino con toast.
 */
export function useCrudTable<T extends CrudRow>(options: CrudTableOptions<T>) {
  const queryClient = useQueryClient()
  const { show } = useToast()

  const search = ref('')
  const statusFilter = ref<StatusFilterValue>('active')

  // Tutti i record, eliminati compresi: il filtro di stato è lato client
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: [options.queryKey, { withTrashed: true }],
    queryFn: () => options.api.get({ withTrashed: true }),
    staleTime: Infinity,
    placeholderData: (prev) => prev,
  })

  const all = computed(() => data.value ?? [])

  const filtered = computed(() => {
    let list = all.value
    if (statusFilter.value === 'active') list = list.filter((r) => !r.deleted_at)
    else if (statusFilter.value === 'deleted') list = list.filter((r) => !!r.deleted_at)
    if (options.filter) list = options.filter(list)
    return filterBySearch(list, search.value, options.search)
  })

  // L'ordinamento lo fa BaseDataTable (TanStack Table)
  const rows = filtered

  const total = computed(() => rows.value.length)

  function onError(error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined
    show(message || 'Operazione non riuscita', 'error')
  }

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [options.queryKey] })

  const { mutate: remove, isPending: isRemoving } = useMutation({
    mutationFn: (id: number) => options.api.remove(id),
    onSuccess: () => {
      invalidate()
      show(options.messages.removed, 'error')
    },
    onError,
  })

  const { mutate: restore, isPending: isRestoring } = useMutation({
    mutationFn: (id: number) => options.api.restore(id),
    onSuccess: () => {
      invalidate()
      show(options.messages.restored)
    },
    onError,
  })

  const isMutating = computed(() => isRemoving.value || isRestoring.value)

  return {
    search,
    statusFilter,
    all,
    rows,
    total,
    isLoading,
    isFetching,
    refetch,
    remove,
    restore,
    isMutating,
  }
}
