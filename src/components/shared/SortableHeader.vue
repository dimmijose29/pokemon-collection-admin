<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-vue-next'

export interface SortState {
  field: string
  direction: 'asc' | 'desc'
}

const props = defineProps<{
  field: string
  label: string
  modelValue: SortState | null
  class?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SortState]
}>()

const isActive = computed(() => props.modelValue?.field === props.field)
const direction = computed(() => (isActive.value ? props.modelValue?.direction : null))

function toggle() {
  if (!isActive.value) {
    emit('update:modelValue', { field: props.field, direction: 'asc' })
  } else {
    emit('update:modelValue', {
      field: props.field,
      direction: props.modelValue?.direction === 'asc' ? 'desc' : 'asc',
    })
  }
}
</script>

<template>
  <th
    class="cursor-pointer select-none whitespace-nowrap group"
    :class="props.class"
    @click="toggle"
  >
    <div class="flex items-center gap-1">
      <span>{{ label }}</span>
      <span class="transition-opacity" :class="isActive ? 'opacity-100 text-secondary' : 'opacity-0 group-hover:opacity-40'">
        <ArrowUp v-if="direction === 'asc'" class="w-3.5 h-3.5" />
        <ArrowDown v-else-if="direction === 'desc'" class="w-3.5 h-3.5" />
        <ArrowUpDown v-else class="w-3.5 h-3.5" />
      </span>
    </div>
  </th>
</template>
