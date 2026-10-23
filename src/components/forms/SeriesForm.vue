<script setup lang="ts">
import { useForm } from 'vee-validate'
import { z } from 'zod'
import type { Series, SeriesPayload } from '@/types/series'
import { toTypedSchema } from '@/validation/toTypedSchema'
import { optionalString, requiredString } from '@/validation/schemas'
import BaseInput from '@/components/base/BaseInput.vue'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'

const props = defineProps<{
  series?: Series | null
  variant?: 'create' | 'edit'
  errors?: string[]
}>()

const emit = defineEmits<{
  submit: [data: SeriesPayload]
}>()

// I campi facoltativi vuoti diventano null: l'API li salva come assenti
const emptyToNull = () => optionalString().transform((v) => v || null)

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      name: requiredString('Il nome è obbligatorio'),
      tcgdex_id: emptyToNull(),
      logo_url: emptyToNull(),
    }),
  ),
  initialValues: {
    name: props.series?.name ?? '',
    tcgdex_id: props.series?.tcgdex_id ?? '',
    logo_url: props.series?.logo_url ?? '',
  },
})

const onSubmit = handleSubmit((values) => emit('submit', values))
</script>

<template>
  <ErrorAlert :errors="errors ?? []" />
  <form id="series-form" novalidate @submit="onSubmit">
    <BaseInput name="name" label="Nome" placeholder="Es. Sword & Shield" required />
    <BaseInput name="tcgdex_id" label="TCGdex ID" placeholder="Es. swsh (opzionale)" />
    <BaseInput name="logo_url" label="URL Logo" placeholder="https://assets.tcgdex.net/..." />
  </form>
</template>
