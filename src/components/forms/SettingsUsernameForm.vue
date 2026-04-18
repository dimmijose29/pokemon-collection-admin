<script setup lang="ts">
import { Save } from 'lucide-vue-next'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'

const props = defineProps<{
  username?: string
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
    id="settings-username-form"
    :actions="false"
    :value="{ username: props.username }"
    @submit="(data) => emit('submit', data)"
  >
    <FormKit
      type="text"
      name="username"
      label="Username"
      placeholder="Il tuo username"
      validation="required|length:3,30"
      validation-visibility="dirty"
      :validation-messages="{
        required: 'Il campo è obbligatorio',
        length: 'Deve essere tra 3 e 30 caratteri',
      }"
    />
    <button type="submit" class="btn btn-sm btn-secondary" :disabled="loading">
      <span v-if="loading" class="loading loading-spinner loading-xs" />
      <Save v-else class="w-4 h-4" />
      Salva
    </button>
  </FormKit>
</template>
