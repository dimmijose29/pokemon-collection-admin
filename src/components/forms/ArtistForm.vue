<script setup lang="ts">
import type { Artist } from '@/types/artist'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'

defineProps<{
  artist?: Artist | null
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
      :validation-messages="{ required: 'Il nome è obbligatorio' }"
      message-class="text-error text-sm mt-1"
      outer-class="max-w-full"
    />
  </FormKit>
</template>
