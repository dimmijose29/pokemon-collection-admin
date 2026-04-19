<script setup lang="ts">
import ErrorAlert from '@/components/utils/ErrorAlert.vue'

defineProps<{
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
    id="user-create-form"
    :actions="false"
    @submit="(data) => emit('submit', data)"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
      <FormKit
        type="email"
        name="email"
        label="Email"
        placeholder="Es. utente@esempio.it"
        validation="required|email"
        validation-visibility="dirty"
        :validation-messages="{
          required: 'L\'email è obbligatoria',
          email: 'Inserisci un\'email valida',
        }"
        message-class="text-error text-sm mt-1"
        outer-class="max-w-full md:col-span-2"
      />
      <FormKit
        type="text"
        name="username"
        label="Username"
        placeholder="Es. ash_ketchum"
        validation="required"
        validation-visibility="dirty"
        :validation-messages="{ required: 'Lo username è obbligatorio' }"
        message-class="text-error text-sm mt-1"
        outer-class="max-w-full"
      />
      <FormKit
        type="password"
        name="password"
        label="Password"
        placeholder="Minimo 8 caratteri"
        validation="required|length:8"
        validation-visibility="dirty"
        :validation-messages="{
          required: 'La password è obbligatoria',
          length: 'Minimo 8 caratteri',
        }"
        message-class="text-error text-sm mt-1"
        outer-class="max-w-full"
      />
      <FormKit
        type="checkbox"
        name="is_admin"
        label="Amministratore"
        :value="false"
        outer-class="max-w-full md:col-span-2 mt-1"
      />
    </div>
  </FormKit>
</template>
