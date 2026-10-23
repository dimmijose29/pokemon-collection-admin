<script setup lang="ts">
import { useId } from 'vue'
import { useField } from 'vee-validate'

// Checkbox booleana collegata al form VeeValidate.
const props = defineProps<{
  name: string
  label: string
}>()

const inputId = useId()
const { value, handleChange } = useField<boolean>(() => props.name, undefined, {
  type: 'checkbox',
  checkedValue: true,
  uncheckedValue: false,
})
</script>

<template>
  <label :for="inputId" class="flex cursor-pointer items-center gap-2 mb-3">
    <input
      :id="inputId"
      type="checkbox"
      class="checkbox checkbox-sm checkbox-secondary"
      :name="name"
      :checked="!!value"
      @change="handleChange(($event.target as HTMLInputElement).checked)"
    />
    <span class="text-sm">{{ label }}</span>
  </label>
</template>
