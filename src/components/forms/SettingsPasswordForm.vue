<script setup lang="ts">
import { Save } from 'lucide-vue-next'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'

defineProps<{
  errors: string[]
  loading: boolean
}>()

const emit = defineEmits<{
  submit: [data: Record<string, unknown>]
}>()
</script>

<template>
  <ErrorAlert :errors="errors" />

  <FormKit
    type="form"
    id="settings-password-form"
    :actions="false"
    @submit="(data) => emit('submit', data)"
  >
    <FormKit
      type="password"
      name="current_password"
      label="Password attuale"
      placeholder="••••••••"
      autocomplete="current-password"
      validation="required"
      validation-visibility="dirty"
      :validation-messages="{ required: 'Campo obbligatorio' }"
    />
    <FormKit
      type="password"
      name="new_password"
      label="Nuova password"
      placeholder="••••••••"
      validation="required|length:8"
      validation-visibility="dirty"
      :validation-messages="{
        required: 'Campo obbligatorio',
        length: 'Minimo 8 caratteri',
      }"
    />
    <FormKit
      type="password"
      name="new_password_confirm"
      label="Conferma password"
      placeholder="••••••••"
      validation="required|confirm:new_password"
      validation-visibility="dirty"
      :validation-messages="{
        required: 'Campo obbligatorio',
        confirm: 'Le password non coincidono',
      }"
    />
    <button type="submit" class="btn btn-sm btn-secondary" :disabled="loading">
      <span v-if="loading" class="loading loading-spinner loading-xs" />
      <Save v-else class="w-4 h-4" />
      Salva
    </button>
  </FormKit>
</template>
