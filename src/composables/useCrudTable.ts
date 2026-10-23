import { computed, ref } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import axios from 'axios'
import type { CrudApi } from '@/api/crud'
import type { StatusFilterValue } from '@/components/shared/StatusFilter.vue'
import type { SortState } from '@/components/shared/SortableHeader.vue'
import { useToast } from '@/composables/useToast'
import { filterBySearch } from '@/utils/search'

interface CrudRow {
  id: number
  deleted_at?: string | null
}

type Comparator<T> = (a: T, b: T) => number

interface CrudTableOptions<T extends CrudRow> {
  api: Pick<CrudApi<T, unknown>, 'get' | 'remove' | 'restore'>
  /** Prefisso della query (es. 'artists'): la lista usa [queryKey, { withTrashed: true }]. */
  queryKey: string
  messages: { removed: string; restored: string }
  /** Opzioni di filterBySearch (campi esclusi, trasformazioni prima della ricerca). */
  search?: Parameters<typeof filterBySearch<T>>[2]
  /** Filtri aggiuntivi della tabella, applicati dopo stato ed eliminati. */
  filter?: (rows: T[]) => T[]
  /** Confronti personalizzati per campo; gli altri campi usano compareValues. */
  sorters?: Partial<Record<string, Comparator<T>>>
}

/**
 * Confronto di default: date ISO e numeri per valore, il resto come stringa.
 */
function compareValues(a: unknown, b: unknown): number {
  if (typeof a === 'number' || typeof b === 'number') return (Number(a) || 0) - (Number(b) || 0)
  const aDate = typeof a === 'string' ? Date.parse(a) : NaN
  const bDate = typeof b === 'string' ? Date.parse(b) : NaN
  if (!isNaN(aDate) && !isNaN(bDate) && /^\d{4}-\d{2}-\d{2}/.test(String(a))) return aDate - bDate
  return String(a ?? '').localeCompare(String(b ?? ''))
}

/**
 * Logica comune delle tabelle di catalogo: caricamento (eliminati inclusi),
 * filtro attivi/eliminati, ricerca, ordinamento ed eliminazione/ripristino con toast.
 */
export function useCrudTable<T extends CrudRow>(options: CrudTableOptions<T>) {
  const queryClient = useQueryClient()
  const { show } = useToast()

  const search = ref('')
  const statusFilter = ref<StatusFilterValue>('active')
  const sort = ref<SortState | null>(null)

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

  const rows = computed(() => {
    if (!sort.value) return filtered.value
    const { field, direction } = sort.value
    const mult = direction === 'asc' ? 1 : -1
    const compare =
      options.sorters?.[field] ??
      ((a: T, b: T) => compareValues(a[field as keyof T], b[field as keyof T]))
    return [...filtered.value].sort((a, b) => compare(a, b) * mult)
  })

  const total = computed(() => filtered.value.length)

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
    sort,
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
