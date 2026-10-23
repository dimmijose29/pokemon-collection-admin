<script setup lang="ts">
import { computed, useId } from 'vue'
import { useField } from 'vee-validate'
import BaseField from './BaseField.vue'
import BaseCombobox from './BaseCombobox.vue'

// Select ricercabile collegata al form VeeValidate (valore: stringa, '' = nessuna scelta).
const props = withDefaults(
  defineProps<{
    name: string
    label?: string
    options: { value: string; label: string }[]
    placeholder?: string
    help?: string
    required?: boolean
    clearable?: boolean
  }>(),
  { clearable: true },
)

const inputId = useId()
const { value, errorMessage, handleChange } = useField<string>(() => props.name)
const current = computed(() => value.value ?? '')
</script>

<template>
  <BaseField
    :input-id="inputId"
    :label="label"
    :help="help"
    :error="errorMessage"
    :required="required"
  >
    <BaseCombobox
      :input-id="inputId"
      :model-value="current"
      :options="options"
      :placeholder="placeholder"
      :clearable="clearable"
      :invalid="!!errorMessage"
      :aria-label="label"
      @update:model-value="(v) => handleChange(v, true)"
    />
  </BaseField>
</template>
