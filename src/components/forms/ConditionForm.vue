<script setup lang="ts">
import type { Condition } from '@/types/condition'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'

defineProps<{
  condition?: Condition | null
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
    id="condition-form"
    :actions="false"
    :value="condition ? { code: condition.code, name: condition.name } : undefined"
    @submit="(data) => emit('submit', data)"
  >
    <!-- Codice breve della condizione, es. NM, LP, MP -->
    <FormKit
      type="text"
      name="code"
      label="Codice"
      placeholder="Es. NM"
      validation="required"
      validation-visibility="dirty"
      :validation-messages="{ required: 'Il codice è obbligatorio' }"
      message-class="text-error text-sm mt-1"
      outer-class="max-w-full"
    />
    <FormKit
      type="text"
      name="name"
      label="Nome"
      placeholder="Es. Near Mint"
      validation="required"
      validation-visibility="dirty"
      :validation-messages="{ required: 'Il nome è obbligatorio' }"
      message-class="text-error text-sm mt-1"
      outer-class="max-w-full"
    />
  </FormKit>
</template>
