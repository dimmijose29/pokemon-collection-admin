<script setup lang="ts">
import type { CardType } from '@/types/card-type'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'

defineProps<{
  cardType?: CardType | null
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
    id="card-type-form"
    :actions="false"
    :value="cardType ? { name: cardType.name } : undefined"
    @submit="(data) => emit('submit', data)"
  >
    <FormKit
      type="text"
      name="name"
      label="Nome"
      placeholder="Es. Base"
      validation="required"
      validation-visibility="dirty"
      :validation-messages="{ required: 'Il nome è obbligatorio' }"
      message-class="text-error text-sm mt-1"
      outer-class="max-w-full"
    />
  </FormKit>
</template>
