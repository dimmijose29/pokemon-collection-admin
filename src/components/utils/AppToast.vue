<script setup lang="ts">
import { Check, X, AlertTriangle, Info } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const { toasts } = useToast()

const iconMap = {
  success: Check,
  error: X,
  warning: AlertTriangle,
  info: Info,
}

const alertClassMap = {
  success: 'alert-success',
  error: 'alert-error',
  warning: 'alert-warning',
  info: 'alert-info',
}
</script>

<template>
  <div class="toast toast-end z-50">
    <TransitionGroup
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      leave-active-class="transition-all duration-200 ease-in"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['alert shadow-lg', alertClassMap[toast.type]]"
      >
        <component :is="iconMap[toast.type]" class="w-4 h-4 shrink-0" />
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </div>
</template>
