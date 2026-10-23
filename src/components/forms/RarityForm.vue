<script setup lang="ts">
import { useForm } from 'vee-validate'
import { z } from 'zod'
import type { Rarity } from '@/types/rarity'
import type { RarityPayload } from '@/api/rarities'
import { toTypedSchema } from '@/validation/toTypedSchema'
import { requiredString } from '@/validation/schemas'
import BaseInput from '@/components/base/BaseInput.vue'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'

const props = defineProps<{
  rarity?: Rarity | null
  variant?: 'create' | 'edit'
  errors?: string[]
}>()

const emit = defineEmits<{
  submit: [data: RarityPayload]
}>()

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      name: requiredString('La rarità è obbligatoria'),
    }),
  ),
  initialValues: {
    name: props.rarity?.name ?? '',
  },
})

// Il pulsante Salva sta nel footer della modale e invia questo form tramite l'id
const onSubmit = handleSubmit((values) => emit('submit', values))
</script>

<template>
  <ErrorAlert :errors="errors ?? []" />
  <form id="rarity-form" novalidate @submit="onSubmit">
    <BaseInput name="name" label="Rarità" placeholder="Es. Holo Rare" required />
  </form>
</template>
