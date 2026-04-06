<script setup lang="ts">
import type { Artist } from '@/types/artist'

const props = defineProps<{
  artist?: Artist | null
  variant?: 'create' | 'edit'
}>()

const emit = defineEmits<{
  submit: [data: Record<string, unknown>]
}>()

const inputClass = props.variant === 'edit' ? 'input-success' : ''
</script>

<template>
  <FormKit
    type="form"
    id="artist-form"
    :actions="false"
    :value="artist ? { name: artist.name } : undefined"
    @submit="(data) => emit('submit', data)"
  >
    <FormKit
      type="text"
      name="name"
      label="Nome"
      placeholder="Es. Mitsuhiro Arita"
      validation="required"
      validation-visibility="dirty"
      :validation-messages="{ required: 'Inserisci username o email' }"
      message-class="text-error text-sm mt-1"
      :input-class="inputClass"
      outer-class="max-w-full"
    />
  </FormKit>
</template>
