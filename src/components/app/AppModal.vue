<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { X, Plus, Pencil } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: boolean
  title: string
  variant?: 'create' | 'edit'
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isRendered = ref(props.modelValue)

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      isRendered.value = true
    } else {
      setTimeout(() => {
        isRendered.value = false
      }, 250)
    }
  },
)

const variantIcon = computed(() => {
  if (props.variant === 'create') return Plus
  if (props.variant === 'edit') return Pencil
  return null
})

const variantColor = computed(() => {
  if (props.variant === 'create') return { text: 'text-secondary', bg: 'bg-secondary/10' }
  if (props.variant === 'edit') return { text: 'text-success', bg: 'bg-success/10' }
  return { text: 'text-base-content', bg: '' }
})

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isRendered" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <Transition
        appear
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-200"
        leave-to-class="opacity-0"
      >
        <div v-if="modelValue" class="absolute inset-0 bg-black/50" @click="close" />
      </Transition>

      <Transition
        appear
        enter-active-class="transition-all duration-250 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        leave-active-class="transition-all duration-200 ease-in"
        leave-to-class="opacity-0 scale-95 translate-y-4"
      >
        <div
          v-if="modelValue"
          class="relative bg-base-100 rounded-2xl shadow-xl w-full max-w-lg z-10 flex flex-col max-h-[90vh]"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between px-6 py-4 border-b border-base-300 shrink-0"
          >
            <div class="flex items-center gap-3">
              <div v-if="variantIcon" class="rounded-xl p-2" :class="variantColor.bg">
                <component :is="variantIcon" class="w-4 h-4" :class="variantColor.text" />
              </div>
              <h3 class="font-heading font-bold text-lg" :class="variantColor.text">
                {{ title }}
              </h3>
            </div>
            <button class="btn btn-ghost btn-sm btn-square" @click="close">
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Content -->
          <div class="px-6 py-5 overflow-y-auto flex-1">
            <slot />
          </div>

          <!-- Footer -->
          <div
            class="flex items-center justify-end gap-2 px-6 py-4 border-t border-base-300 shrink-0"
          >
            <button class="btn btn-ghost btn-sm" :disabled="loading" @click="close">Annulla</button>
            <slot name="footer" />
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>
