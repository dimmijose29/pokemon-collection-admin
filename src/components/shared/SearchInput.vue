<script setup lang="ts">
import { Search } from 'lucide-vue-next'

// Campo di ricerca delle tabelle (v-model), fuori dai form validati.
defineProps<{ placeholder?: string }>()
const model = defineModel<string>({ default: '' })
const emit = defineEmits<{ enter: [] }>()
</script>

<template>
  <label class="input app-field-control flex w-full items-center gap-2">
    <Search class="w-4 h-4 opacity-50 shrink-0" />
    <input
      v-model="model"
      type="search"
      class="grow min-w-0"
      :placeholder="placeholder ?? 'Cerca...'"
      :aria-label="placeholder ?? 'Cerca'"
      @keydown.enter="emit('enter')"
    />
  </label>
</template>
