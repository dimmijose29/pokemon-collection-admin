<script setup lang="ts">
import { Save } from 'lucide-vue-next'
import AppModal from '@/components/app/AppModal.vue'
import UserCreateForm from '@/components/forms/UserCreateForm.vue'

const props = defineProps<{
  modelValue: boolean
  loading?: boolean
  errors?: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: Record<string, unknown>]
}>()
</script>

<template>
  <AppModal
    :model-value="modelValue"
    title="Nuovo utente"
    variant="create"
    :loading="loading"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <UserCreateForm :errors="errors" @submit="emit('submit', $event)" />

    <template #footer>
      <button
        type="submit"
        form="user-create-form"
        class="btn btn-secondary btn-sm"
        :class="{ loading: loading }"
        :disabled="loading"
      >
        <Save class="w-4 h-4" /> Crea utente
      </button>
    </template>
  </AppModal>
</template>
