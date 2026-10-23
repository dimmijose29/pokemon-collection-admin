<script setup lang="ts">
import { useForm } from 'vee-validate'
import { z } from 'zod'
import type { Condition } from '@/types/condition'
import type { ConditionPayload } from '@/api/conditions'
import { toTypedSchema } from '@/validation/toTypedSchema'
import { requiredString } from '@/validation/schemas'
import BaseInput from '@/components/base/BaseInput.vue'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'

const props = defineProps<{
  condition?: Condition | null
  variant?: 'create' | 'edit'
  errors?: string[]
}>()

const emit = defineEmits<{
  submit: [data: ConditionPayload]
}>()

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      code: requiredString('Il codice è obbligatorio'),
      name: requiredString('Il nome è obbligatorio'),
    }),
  ),
  initialValues: {
    code: props.condition?.code ?? '',
    name: props.condition?.name ?? '',
  },
})

// Il pulsante Salva sta nel footer della modale e invia questo form tramite l'id
const onSubmit = handleSubmit((values) => emit('submit', values))
</script>

<template>
  <ErrorAlert :errors="errors ?? []" />
  <form id="condition-form" novalidate @submit="onSubmit">
    <!-- Codice breve della condizione, es. NM, LP, MP -->
    <BaseInput name="code" label="Codice" placeholder="Es. NM" required />
    <BaseInput name="name" label="Nome" placeholder="Es. Near Mint" required />
  </form>
</template>
