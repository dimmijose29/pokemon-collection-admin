<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  label: string
  value?: string | number | null
  sub?: string
  accent?: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error'
  icon?: Component
}>()
</script>

<template>
  <div class="card bg-base-100 border border-base-300 shadow-sm">
    <div class="card-body p-5 gap-1">
      <div class="flex items-center gap-1.5 mb-0.5">
        <component
          :is="icon"
          v-if="icon"
          class="w-3.5 h-3.5 shrink-0"
          :class="accent ? `text-${accent}` : 'text-base-content/40'"
        />
        <p class="text-xs text-base-content/40 uppercase tracking-wider font-medium">{{ label }}</p>
      </div>
      <p
        class="font-heading font-bold text-3xl leading-tight tabular-nums"
        :class="accent ? `text-${accent}` : 'text-base-content'"
      >
        <slot>{{ value ?? '—' }}</slot>
      </p>
      <p v-if="sub" class="text-xs text-base-content/40 mt-0.5">{{ sub }}</p>
    </div>
  </div>
</template>
