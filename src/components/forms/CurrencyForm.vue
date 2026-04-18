<script setup lang="ts">
import type { Currency } from '@/types/currency'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'

defineProps<{
  currency?: Currency | null
  variant?: 'create' | 'edit'
  errors?: string[]
}>()

const emit = defineEmits<{
  submit: [data: Record<string, unknown>]
}>()
</script>

<template>
  <ErrorAlert :errors="errors ?? []" />
  <FormKit
    type="form"
    id="currency-form"
    :actions="false"
    :value="currency ? { code: currency.code, symbol: currency.symbol } : undefined"
    @submit="(data) => emit('submit', data)"
  >
    <!-- Codice ISO 4217, es. EUR, USD, JPY -->
    <FormKit
      type="text"
      name="code"
      label="Codice"
      placeholder="Es. EUR"
      validation="required"
      validation-visibility="dirty"
      :validation-messages="{ required: 'Il codice è obbligatorio' }"
      message-class="text-error text-sm mt-1"
      outer-class="max-w-full"
    />
    <!-- Simbolo grafico della valuta -->
    <FormKit
      type="text"
      name="symbol"
      label="Simbolo"
      placeholder="Es. €"
      validation="required"
      validation-visibility="dirty"
      :validation-messages="{ required: 'Il simbolo è obbligatorio' }"
      message-class="text-error text-sm mt-1"
      outer-class="max-w-full"
    />
  </FormKit>
</template>
