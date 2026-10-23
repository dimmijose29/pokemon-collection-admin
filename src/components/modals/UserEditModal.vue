<script setup lang="ts">
import { Save } from 'lucide-vue-next'
import AppModal from '@/components/app/AppModal.vue'
import UserEditForm from '@/components/forms/UserEditForm.vue'
import type { User } from '@/types/user'

defineProps<{
  modelValue: boolean
  user: User | null
  loading?: boolean
  errors?: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: FormData | Record<string, unknown>]
}>()
</script>

<template>
  <AppModal
    :model-value="modelValue"
    title="Modifica utente"
    variant="edit"
    :loading="loading"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <UserEditForm v-if="user" :user="user" :errors="errors" @submit="emit('submit', $event)" />

    <template #footer>
      <button
        type="submit"
        form="user-edit-form"
        class="btn btn-success btn-sm"
        :class="{ loading: loading }"
        :disabled="loading"
      >
        <Save class="w-4 h-4" /> Salva
      </button>
    </template>
  </AppModal>
</template>
