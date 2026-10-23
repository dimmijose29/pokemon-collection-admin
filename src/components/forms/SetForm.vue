<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import type { Set, SetPayload } from '@/types/set'
import SeriesApi from '@/api/series'
import { toTypedSchema } from '@/validation/toTypedSchema'
import { optionalInteger, optionalString, requiredString } from '@/validation/schemas'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
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

const seriesOptions = computed(() =>
  (seriesList.value ?? [])
    .filter((s) => !s.deleted_at)
    .map((s) => ({ label: s.name, value: String(s.id) })),
)

const isCreate = props.variant === 'create'

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      name: requiredString('Il nome è obbligatorio'),
      // Obbligatorio solo in creazione, come in SetRequest lato API
      tcgdex_id: isCreate
        ? requiredString("L'ID TCGdex è obbligatorio")
        : optionalString().transform((v) => v || undefined),
      series_id: optionalString().transform((v) => (v ? Number(v) : null)),
      release_date: optionalString().transform((v) => v || null),
      card_count_official: optionalInteger(),
      card_count_total: optionalInteger(),
    }),
  ),
  initialValues: {
    name: props.set?.name ?? '',
    tcgdex_id: props.set?.tcgdex_id ?? '',
    series_id: props.set?.series_id ? String(props.set.series_id) : '',
    release_date: props.set?.release_date ?? '',
    card_count_official: props.set?.card_count_official,
    card_count_total: props.set?.card_count_total,
  },
})

const onSubmit = handleSubmit((values) => emit('submit', values))
</script>

<template>
  <ErrorAlert :errors="errors ?? []" />
  <form id="set-form" novalidate @submit="onSubmit">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
      <BaseInput name="name" label="Nome" placeholder="Es. Sword & Shield" required />
      <BaseInput name="tcgdex_id" label="ID TCGdex" placeholder="Es. swsh1" :required="isCreate" />
      <BaseSelect
        name="series_id"
        label="Serie"
        :options="seriesOptions"
        placeholder="Nessuna serie"
      />
      <BaseInput name="release_date" type="date" label="Data di uscita" />
      <BaseInput
        name="card_count_official"
        type="number"
        label="Carte ufficiali"
        placeholder="Es. 202"
      />
      <BaseInput name="card_count_total" type="number" label="Carte totali" placeholder="Es. 216" />
    </div>
  </form>
</template>
