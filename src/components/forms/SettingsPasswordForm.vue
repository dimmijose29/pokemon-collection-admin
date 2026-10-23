<script setup lang="ts">
import { Save } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@/validation/toTypedSchema'
import { passwordField, requiredString, validationMessages } from '@/validation/schemas'
import BaseInput from '@/components/base/BaseInput.vue'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'

defineProps<{
  errors: string[]
  loading: boolean
}>()

const emit = defineEmits<{
  submit: [data: { current_password: string; new_password: string; new_password_confirm: string }]
}>()

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    z
      .object({
        current_password: requiredString('Campo obbligatorio'),
        new_password: passwordField(8, 'Campo obbligatorio'),
        new_password_confirm: requiredString('Campo obbligatorio'),
      })
      .refine((v) => v.new_password === v.new_password_confirm, {
        message: validationMessages.confirm,
        path: ['new_password_confirm'],
      }),
  ),
  initialValues: { current_password: '', new_password: '', new_password_confirm: '' },
})

const onSubmit = handleSubmit((values) => emit('submit', values))
</script>

<template>
  <ErrorAlert :errors="errors" />

  <form id="settings-password-form" novalidate @submit="onSubmit">
    <BaseInput
      name="current_password"
      type="password"
      label="Password attuale"
      placeholder="••••••••"
      autocomplete="current-password"
      required
    />
    <BaseInput
      name="new_password"
      type="password"
      label="Nuova password"
      placeholder="••••••••"
      autocomplete="new-password"
      required
    />
    <BaseInput
      name="new_password_confirm"
      type="password"
      label="Conferma password"
      placeholder="••••••••"
      autocomplete="new-password"
      required
    />
    <button type="submit" class="btn btn-sm btn-secondary" :disabled="loading">
      <span v-if="loading" class="loading loading-spinner loading-xs" />
      <Save v-else class="w-4 h-4" />
      Salva
    </button>
  </form>
</template>
