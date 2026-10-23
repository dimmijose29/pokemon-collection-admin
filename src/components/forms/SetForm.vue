<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type { Set, SetPayload } from '@/types/set'
import SeriesApi from '@/api/series'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'

const props = defineProps<{
  set?: Set | null
  variant?: 'create' | 'edit'
  errors?: string[]
}>()

const emit = defineEmits<{
  submit: [data: SetPayload]
}>()

// Stessa chiave del filtro serie in CardsView: la cache è condivisa
const { data: seriesList } = useQuery({
  queryKey: ['series', { withTrashed: false }],
  queryFn: () => SeriesApi.get(),
  staleTime: Infinity,
})

const seriesOptions = computed(() => [
  { label: 'Nessuna serie', value: '' },
  ...(seriesList.value ?? [])
    .filter((s) => !s.deleted_at)
    .map((s) => ({ label: s.name, value: String(s.id) })),
])

// FormKit restituisce stringhe: qui si converte nel payload atteso dall'API
function toNumber(value: unknown): number | undefined {
  if (value === '' || value === null || value === undefined) return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

function handleSubmit(data: Record<string, unknown>) {
  emit('submit', {
    name: String(data.name ?? ''),
    tcgdex_id: data.tcgdex_id ? String(data.tcgdex_id) : undefined,
    series_id: toNumber(data.series_id) ?? null,
    release_date: data.release_date ? String(data.release_date) : null,
    card_count_official: toNumber(data.card_count_official),
    card_count_total: toNumber(data.card_count_total),
  })
}
</script>

<template>
  <ErrorAlert :errors="errors ?? []" />
  <FormKit
    type="form"
    id="set-form"
    :actions="false"
    :value="
      props.set
        ? {
            name: props.set.name,
            tcgdex_id: props.set.tcgdex_id,
            series_id: props.set.series_id ? String(props.set.series_id) : '',
            release_date: props.set.release_date,
            card_count_official: props.set.card_count_official,
            card_count_total: props.set.card_count_total,
          }
        : undefined
    "
    @submit="handleSubmit"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
      <FormKit
        type="text"
        name="name"
        label="Nome"
        placeholder="Es. Sword & Shield"
        validation="required"
        validation-visibility="dirty"
        :validation-messages="{ required: 'Il nome è obbligatorio' }"
        message-class="text-error text-sm mt-1"
        outer-class="max-w-full"
      />
      <FormKit
        type="text"
        name="tcgdex_id"
        label="ID TCGdex"
        placeholder="Es. swsh1"
        :validation="variant === 'create' ? 'required' : ''"
        validation-visibility="dirty"
        :validation-messages="{ required: 'L\'ID TCGdex è obbligatorio' }"
        message-class="text-error text-sm mt-1"
        outer-class="max-w-full"
      />
      <FormKit
        type="select"
        name="series_id"
        label="Serie"
        :options="seriesOptions"
        message-class="text-error text-sm mt-1"
        outer-class="max-w-full"
      />
      <FormKit
        type="date"
        name="release_date"
        label="Data di uscita"
        message-class="text-error text-sm mt-1"
        outer-class="max-w-full"
      />
      <FormKit
        type="number"
        name="card_count_official"
        label="Carte ufficiali"
        placeholder="Es. 202"
        message-class="text-error text-sm mt-1"
        outer-class="max-w-full"
      />
      <FormKit
        type="number"
        name="card_count_total"
        label="Carte totali"
        placeholder="Es. 216"
        message-class="text-error text-sm mt-1"
        outer-class="max-w-full"
      />
    </div>
  </FormKit>
</template>
