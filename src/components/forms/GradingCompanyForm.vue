<script setup lang="ts">
import type { GradingCompany } from '@/types/grading-company'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'

defineProps<{
  gradingCompany?: GradingCompany | null
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
    id="grading-company-form"
    :actions="false"
    :value="gradingCompany ? { name: gradingCompany.name } : undefined"
    @submit="(data) => emit('submit', data)"
  >
    <FormKit
      type="text"
      name="name"
      label="Nome"
      placeholder="Es. PSA"
      validation="required"
      validation-visibility="dirty"
      :validation-messages="{ required: 'Il nome è obbligatorio' }"
      message-class="text-error text-sm mt-1"
      outer-class="max-w-full"
    />
  </FormKit>
</template>
