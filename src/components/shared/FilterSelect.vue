<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ChevronDown, X } from 'lucide-vue-next'

const props = defineProps<{
  options: string[]
  placeholder: string
  multiple?: boolean
}>()

// Single: string, Multiple: string[]
const model = defineModel<string | string[]>()

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const selectedValues = computed<string[]>(() => {
  if (props.multiple) return (model.value as string[]) ?? []
  const v = model.value as string
  return v ? [v] : []
})

const label = computed(() => {
  if (selectedValues.value.length === 0) return props.placeholder
  if (!props.multiple) return selectedValues.value[0]
  if (selectedValues.value.length === 1) return selectedValues.value[0]
  return `${selectedValues.value.length} selezionati`
})

const hasSelection = computed(() => selectedValues.value.length > 0)

function isSelected(option: string) {
  return selectedValues.value.includes(option)
}

function toggle(option: string) {
  if (props.multiple) {
    const current = [...selectedValues.value]
    const idx = current.indexOf(option)
    if (idx === -1) current.push(option)
    else current.splice(idx, 1)
    model.value = current
  } else {
    model.value = isSelected(option) ? '' : option
    isOpen.value = false
  }
}

function clear() {
  model.value = props.multiple ? [] : ''
}

function onClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<template>
  <div ref="containerRef" class="relative">
    <!-- Trigger -->
    <button
      type="button"
      class="btn btn-sm btn-bordered border-base-300 bg-base-100 hover:bg-base-200 gap-1 min-w-[130px] justify-between font-normal"
      :class="hasSelection ? 'text-base-content' : 'text-base-content/50'"
      @click="isOpen = !isOpen"
    >
      <span class="truncate max-w-[120px]">{{ label }}</span>
      <div class="flex items-center gap-0.5 shrink-0">
        <X
          v-if="hasSelection"
          class="w-3.5 h-3.5 text-base-content/40 hover:text-base-content"
          @click.stop="clear"
        />
        <ChevronDown
          class="w-3.5 h-3.5 transition-transform duration-150"
          :class="isOpen ? 'rotate-180' : ''"
        />
      </div>
    </button>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition-all duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-1 scale-95"
      leave-active-class="transition-all duration-100 ease-in"
      leave-to-class="opacity-0 translate-y-1 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute top-full left-0 mt-1 z-50 bg-base-100 border border-base-300 rounded-xl shadow-xl min-w-full max-h-60 overflow-y-auto py-1"
      >
        <button
          v-for="option in options"
          :key="option"
          type="button"
          class="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left hover:bg-base-200 transition-colors"
          :class="isSelected(option) ? 'text-secondary font-medium' : 'text-base-content'"
          @click="toggle(option)"
        >
          <!-- Checkbox per multi, radio dot per single -->
          <span
            v-if="multiple"
            class="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors"
            :class="isSelected(option) ? 'bg-secondary border-secondary' : 'border-base-300'"
          >
            <svg v-if="isSelected(option)" class="w-2.5 h-2.5 text-secondary-content" fill="none" viewBox="0 0 10 8">
              <path d="M1 4l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span
            v-else
            class="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors"
            :class="isSelected(option) ? 'border-secondary' : 'border-base-300'"
          >
            <span v-if="isSelected(option)" class="w-2 h-2 rounded-full bg-secondary" />
          </span>
          {{ option }}
        </button>

        <div v-if="options.length === 0" class="px-3 py-2 text-sm text-base-content/40">
          Nessuna opzione disponibile
        </div>
      </div>
    </Transition>
  </div>
</template>
