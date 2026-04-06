<script setup lang="ts">
import { Eraser, Logs, ShieldCheck } from 'lucide-vue-next'
export type StatusFilterValue = 'all' | 'active' | 'deleted'

const model = defineModel<StatusFilterValue>({ default: 'active' })

const options: { value: StatusFilterValue; label: string; component?: any }[] = [
  { value: 'all', label: 'Tutti', component: Logs },
  { value: 'active', label: 'Attivi', component: ShieldCheck },
  { value: 'deleted', label: 'Eliminati', component: Eraser },
]
</script>

<template>
  <div class="join">
    <button
      v-for="opt in options"
      :key="opt.value"
      class="join-item btn btn-sm"
      :class="model === opt.value ? 'btn-secondary' : 'btn-ghost bg-gray-200 hover:bg-gray-100'"
      @click="model = opt.value"
    >
      <component v-if="opt.component" :is="opt.component" class="w-3.5 h-3.5 mr-1" />
      {{ opt.label }}
    </button>
  </div>
</template>
