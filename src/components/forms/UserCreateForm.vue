<script setup lang="ts">
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@/validation/toTypedSchema'
import { emailField, passwordField, requiredString } from '@/validation/schemas'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseCheckbox from '@/components/base/BaseCheckbox.vue'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'

defineProps<{
  errors?: string[]
}>()

const emit = defineEmits<{
  submit: [data: { email: string; username: string; password: string; is_admin: boolean }]
}>()

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      email: emailField("L'email è obbligatoria"),
      username: requiredString('Lo username è obbligatorio'),
      password: passwordField(8, 'La password è obbligatoria'),
      is_admin: z.boolean(),
    }),
  ),
  initialValues: { email: '', username: '', password: '', is_admin: false },
})

const onSubmit = handleSubmit((values) => emit('submit', values))
</script>

<template>
  <ErrorAlert :errors="errors ?? []" />
  <form id="user-create-form" novalidate @submit="onSubmit">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
      <div class="md:col-span-2">
        <BaseInput
          name="email"
          type="email"
          label="Email"
          placeholder="Es. utente@esempio.it"
          autocomplete="off"
          required
        />
      </div>
      <BaseInput name="username" label="Username" placeholder="Es. ash_ketchum" required />
      <BaseInput
        name="password"
        type="password"
        label="Password"
        placeholder="Minimo 8 caratteri"
        autocomplete="new-password"
        required
      />
      <div class="md:col-span-2 mt-1">
        <BaseCheckbox name="is_admin" label="Amministratore" />
      </div>
    </div>
  </form>
</template>
