<script setup lang="ts">
import { useForm } from 'vee-validate'
import { z } from 'zod'
import type { Currency } from '@/types/currency'
import type { CurrencyPayload } from '@/api/currencies'
import { toTypedSchema } from '@/validation/toTypedSchema'
import { requiredString } from '@/validation/schemas'
import BaseInput from '@/components/base/BaseInput.vue'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'

const props = defineProps<{
  currency?: Currency | null
  variant?: 'create' | 'edit'
  errors?: string[]
}>()

const emit = defineEmits<{
  submit: [data: CurrencyPayload]
}>()

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      code: requiredString('Il codice è obbligatorio'),
      symbol: requiredString('Il simbolo è obbligatorio'),
    }),
  ),
  initialValues: {
    code: props.currency?.code ?? '',
    symbol: props.currency?.symbol ?? '',
  },
})

// Il pulsante Salva sta nel footer della modale e invia questo form tramite l'id
const onSubmit = handleSubmit((values) => emit('submit', values))
</script>

<template>
  <ErrorAlert :errors="errors ?? []" />
  <form id="currency-form" novalidate @submit="onSubmit">
    <!-- Codice ISO 4217, es. EUR, USD, JPY -->
    <BaseInput name="code" label="Codice" placeholder="Es. EUR" required />
    <BaseInput name="symbol" label="Simbolo" placeholder="Es. €" required />
  </form>
</template>
