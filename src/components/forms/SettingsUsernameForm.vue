<script setup lang="ts">
import { Save } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@/validation/toTypedSchema'
import { requiredString } from '@/validation/schemas'
import BaseInput from '@/components/base/BaseInput.vue'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'

const props = defineProps<{
  username?: string
  errors: string[]
  loading: boolean
}>()

const emit = defineEmits<{
  submit: [data: { username: string }]
}>()

// Stessi limiti di AuthController::updateProfile
const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      username: requiredString('Il campo è obbligatorio')
        .min(3, 'Deve essere tra 3 e 30 caratteri')
        .max(30, 'Deve essere tra 3 e 30 caratteri'),
    }),
  ),
  initialValues: { username: props.username ?? '' },
})

const onSubmit = handleSubmit((values) => emit('submit', values))
</script>

<template>
  <ErrorAlert :errors="errors" />

  <form id="settings-username-form" novalidate @submit="onSubmit">
    <BaseInput name="username" label="Username" placeholder="Il tuo username" required />
    <button type="submit" class="btn btn-sm btn-secondary" :disabled="loading">
      <span v-if="loading" class="loading loading-spinner loading-xs" />
      <Save v-else class="w-4 h-4" />
      Salva
    </button>
  </form>
</template>
