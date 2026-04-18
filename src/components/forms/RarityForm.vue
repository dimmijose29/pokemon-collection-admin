<script setup lang="ts">
import type { Rarity } from '@/types/rarity'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'

const props = defineProps<{
  rarity?: Rarity | null
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
    id="rarity-form"
    :actions="false"
    :value="rarity ? { name: rarity.name } : undefined"
    @submit="(data) => emit('submit', data)"
  >
    <FormKit
      type="text"
      name="name"
      label="Rarità"
      placeholder="Es. Near Mint"
      validation="required"
      validation-visibility="dirty"
      :validation-messages="{ required: 'La rarità è obbligatoria' }"
      message-class="text-error text-sm mt-1"
      outer-class="max-w-full"
    />
  </FormKit>
</template>
