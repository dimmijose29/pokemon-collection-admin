<script setup lang="ts">
import { useForm } from 'vee-validate'
import { z } from 'zod'
import type { Language } from '@/types/language'
import type { LanguagePayload } from '@/api/languages'
import { toTypedSchema } from '@/validation/toTypedSchema'
import { requiredString } from '@/validation/schemas'
import BaseInput from '@/components/base/BaseInput.vue'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'

const props = defineProps<{
  language?: Language | null
  variant?: 'create' | 'edit'
  errors?: string[]
}>()

const emit = defineEmits<{
  submit: [data: LanguagePayload]
}>()

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      code: requiredString('Il codice lingua è obbligatorio'),
      name: requiredString('Il nome è obbligatorio'),
      country_code: requiredString('Il codice paese è obbligatorio'),
    }),
  ),
  initialValues: {
    code: props.language?.code ?? '',
    name: props.language?.name ?? '',
    country_code: props.language?.country_code ?? '',
  },
})

// Il pulsante Salva sta nel footer della modale e invia questo form tramite l'id
const onSubmit = handleSubmit((values) => emit('submit', values))
</script>

<template>
  <ErrorAlert :errors="errors ?? []" />
  <form id="language-form" novalidate @submit="onSubmit">
    <!-- Codice lingua ISO 639-1, es. en, it, jp -->
    <BaseInput name="code" label="Codice lingua" placeholder="Es. en" required />
    <BaseInput name="name" label="Nome" placeholder="Es. Inglese" required />
    <!-- Codice paese ISO 3166-1 alpha-2: il backend lo converte in maiuscolo -->
    <BaseInput name="country_code" label="Codice paese" placeholder="Es. US" required />
  </form>
</template>
