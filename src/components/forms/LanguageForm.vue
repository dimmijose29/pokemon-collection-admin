<script setup lang="ts">
import type { Language } from '@/types/language'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'

defineProps<{
  language?: Language | null
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
    id="language-form"
    :actions="false"
    :value="language ? { code: language.code, name: language.name, country_code: language.country_code } : undefined"
    @submit="(data) => emit('submit', data)"
  >
    <!-- Codice lingua ISO 639-1, es. en, it, jp -->
    <FormKit
      type="text"
      name="code"
      label="Codice lingua"
      placeholder="Es. en"
      validation="required"
      validation-visibility="dirty"
      :validation-messages="{ required: 'Il codice lingua è obbligatorio' }"
      message-class="text-error text-sm mt-1"
      outer-class="max-w-full"
    />
    <FormKit
      type="text"
      name="name"
      label="Nome"
      placeholder="Es. Inglese"
      validation="required"
      validation-visibility="dirty"
      :validation-messages="{ required: 'Il nome è obbligatorio' }"
      message-class="text-error text-sm mt-1"
      outer-class="max-w-full"
    />
    <!-- Codice paese ISO 3166-1 alpha-2, es. US, IT, JP — il backend lo converte in maiuscolo -->
    <FormKit
      type="text"
      name="country_code"
      label="Codice paese"
      placeholder="Es. US"
      validation="required"
      validation-visibility="dirty"
      :validation-messages="{ required: 'Il codice paese è obbligatorio' }"
      message-class="text-error text-sm mt-1"
      outer-class="max-w-full"
    />
  </FormKit>
</template>
