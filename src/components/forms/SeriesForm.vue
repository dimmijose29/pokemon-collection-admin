<script setup lang="ts">
import type { Series } from '@/types/series'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'

defineProps<{
  series?: Series | null
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
    id="series-form"
    :actions="false"
    :value="series ? { name: series.name, tcgdex_id: series.tcgdex_id ?? '', logo_url: series.logo_url ?? '' } : undefined"
    @submit="(data) => emit('submit', data)"
  >
    <FormKit
      type="text"
      name="name"
      label="Nome"
      placeholder="Es. Sword & Shield"
      validation="required"
      validation-visibility="dirty"
      :validation-messages="{ required: 'Il nome è obbligatorio' }"
      outer-class="max-w-full"
    />
    <FormKit
      type="text"
      name="tcgdex_id"
      label="TCGdex ID"
      placeholder="Es. swsh (opzionale)"
      outer-class="max-w-full"
    />
    <FormKit
      type="text"
      name="logo_url"
      label="URL Logo"
      placeholder="https://assets.tcgdex.net/..."
      outer-class="max-w-full"
    />
  </FormKit>
</template>
