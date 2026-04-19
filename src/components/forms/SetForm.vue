<script setup lang="ts">
import type { Set } from '@/types/set'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'

const props = defineProps<{
  set?: Set | null
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
    id="set-form"
    :actions="false"
    :value="
      set
        ? {
            name: set.name,
            tcgdex_id: set.tcgdex_id,
            series: set.series,
            release_date: set.release_date,
            card_count_official: set.card_count_official,
            card_count_total: set.card_count_total,
          }
        : undefined
    "
    @submit="(data) => emit('submit', data)"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
      <FormKit
        type="text"
        name="name"
        label="Nome"
        placeholder="Es. Sword & Shield"
        validation="required"
        validation-visibility="dirty"
        :validation-messages="{ required: 'Il nome è obbligatorio' }"
        message-class="text-error text-sm mt-1"
        outer-class="max-w-full"
      />
      <FormKit
        type="text"
        name="tcgdex_id"
        label="ID TCGdex"
        placeholder="Es. swsh1"
        message-class="text-error text-sm mt-1"
        outer-class="max-w-full"
      />
      <FormKit
        type="text"
        name="series"
        label="Serie"
        placeholder="Es. Sword & Shield"
        message-class="text-error text-sm mt-1"
        outer-class="max-w-full"
      />
      <FormKit
        type="date"
        name="release_date"
        label="Data di uscita"
        message-class="text-error text-sm mt-1"
        outer-class="max-w-full"
      />
      <FormKit
        type="number"
        name="card_count_official"
        label="Carte ufficiali"
        placeholder="Es. 202"
        message-class="text-error text-sm mt-1"
        outer-class="max-w-full"
      />
      <FormKit
        type="number"
        name="card_count_total"
        label="Carte totali"
        placeholder="Es. 216"
        message-class="text-error text-sm mt-1"
        outer-class="max-w-full"
      />
    </div>
  </FormKit>
</template>
