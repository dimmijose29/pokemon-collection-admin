<script setup lang="ts">
import { useForm } from 'vee-validate'
import { z } from 'zod'
import type { CardType } from '@/types/card-type'
import type { CardTypePayload } from '@/api/card-types'
import { toTypedSchema } from '@/validation/toTypedSchema'
import { requiredString } from '@/validation/schemas'
import BaseInput from '@/components/base/BaseInput.vue'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'

const props = defineProps<{
  cardType?: CardType | null
  variant?: 'create' | 'edit'
  errors?: string[]
}>()

const emit = defineEmits<{
  submit: [data: CardTypePayload]
}>()

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      name: requiredString('Il nome è obbligatorio'),
    }),
  ),
  initialValues: {
    name: props.cardType?.name ?? '',
  },
})

// Il pulsante Salva sta nel footer della modale e invia questo form tramite l'id
const onSubmit = handleSubmit((values) => emit('submit', values))
</script>

<template>
  <ErrorAlert :errors="errors ?? []" />
  <form id="card-type-form" novalidate @submit="onSubmit">
    <BaseInput name="name" label="Nome" placeholder="Es. Base" required />
  </form>
</template>
